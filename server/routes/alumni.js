const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Alumni = require('../models/Alumni');
const { protect } = require('../middleware/auth');

// Validation rules for create/update
const alumniValidationRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('A valid email address is required'),
  body('graduationYear')
    .isInt({ min: 1950, max: 2050 })
    .withMessage('Valid graduation year between 1950 and 2050 is required'),
  body('department')
    .isIn(['CSE', 'IT', 'ECE', 'Mechanical', 'Civil', 'MBA', 'Other'])
    .withMessage('Department must be one of: CSE, IT, ECE, Mechanical, Civil, MBA, Other'),
];

// @desc    Get aggregate stats for dashboard
// @route   GET /api/alumni/stats
// @access  Public
router.get('/stats', async (req, res, next) => {
  try {
    const totalAlumni = await Alumni.countDocuments();
    const mentorCount = await Alumni.countDocuments({ isMentor: true });

    // Count by department
    const departmentStats = await Alumni.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Count by graduation year
    const yearStats = await Alumni.aggregate([
      {
        $group: {
          _id: '$graduationYear',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top 5 companies
    const topCompanies = await Alumni.aggregate([
      {
        $match: {
          currentCompany: { $exists: true, $ne: '' },
        },
      },
      {
        $group: {
          _id: '$currentCompany',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Distinct cities count
    const distinctCities = await Alumni.distinct('city', { city: { $ne: '' } });

    res.json({
      success: true,
      stats: {
        totalAlumni,
        mentorCount,
        citiesCount: distinctCities.length,
        departmentStats: departmentStats.map((d) => ({
          name: d._id,
          count: d.count,
        })),
        yearStats: yearStats.map((y) => ({
          year: y._id,
          count: y.count,
        })),
        topCompanies: topCompanies.map((c) => ({
          company: c._id,
          count: c.count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get filter options (departments, years, cities)
// @route   GET /api/alumni/filter-options
// @access  Public
router.get('/filter-options', async (req, res, next) => {
  try {
    const departments = await Alumni.distinct('department');
    const years = await Alumni.distinct('graduationYear');
    const cities = await Alumni.distinct('city', { city: { $ne: '' } });

    res.json({
      success: true,
      options: {
        departments: departments.sort(),
        years: years.sort((a, b) => b - a),
        cities: cities.sort(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all alumni with search, filters & pagination
// @route   GET /api/alumni
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      year,
      department,
      city,
      isMentor,
      page = 1,
      limit = 9,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    // Search query on name, company, or skills
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { fullName: searchRegex },
        { currentCompany: searchRegex },
        { jobTitle: searchRegex },
        { skills: searchRegex },
      ];
    }

    // Filter by graduation year
    if (year) {
      query.graduationYear = Number(year);
    }

    // Filter by department
    if (department && department !== 'All') {
      query.department = department;
    }

    // Filter by city
    if (city && city !== 'All') {
      query.city = new RegExp(`^${city}$`, 'i');
    }

    // Filter by isMentor
    if (isMentor !== undefined && isMentor !== '' && isMentor !== 'all') {
      query.isMentor = isMentor === 'true' || isMentor === true;
    }

    const currentPage = Math.max(1, parseInt(page, 10));
    const pageLimit = Math.max(1, parseInt(limit, 10));
    const skip = (currentPage - 1) * pageLimit;

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const [alumni, total] = await Promise.all([
      Alumni.find(query).sort(sortOptions).skip(skip).limit(pageLimit),
      Alumni.countDocuments(query),
    ]);

    res.json({
      success: true,
      alumni,
      pagination: {
        total,
        page: currentPage,
        limit: pageLimit,
        pages: Math.ceil(total / pageLimit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single alumni by ID
// @route   GET /api/alumni/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }
    res.json({ success: true, alumni });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new alumni
// @route   POST /api/alumni
// @access  Private (Admin)
router.post('/', protect, alumniValidationRules, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Process skills if provided as string or array
    let skillsArray = req.body.skills;
    if (typeof skillsArray === 'string') {
      skillsArray = skillsArray
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    // Pick photo fallback if empty
    let profilePhoto = req.body.profilePhoto;
    if (!profilePhoto || profilePhoto.trim() === '') {
      const randomImg = Math.floor(Math.random() * 70) + 1;
      profilePhoto = `https://i.pravatar.cc/150?img=${randomImg}`;
    }

    const alumniData = {
      ...req.body,
      skills: skillsArray || [],
      profilePhoto,
    };

    const alumni = await Alumni.create(alumniData);
    res.status(201).json({ success: true, alumni });
  } catch (error) {
    next(error);
  }
});

// @desc    Update alumni
// @route   PUT /api/alumni/:id
// @access  Private (Admin)
router.put('/:id', protect, alumniValidationRules, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let skillsArray = req.body.skills;
    if (typeof skillsArray === 'string') {
      skillsArray = skillsArray
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    const updateData = {
      ...req.body,
    };
    if (skillsArray !== undefined) {
      updateData.skills = skillsArray;
    }

    const alumni = await Alumni.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }

    res.json({ success: true, alumni });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete alumni
// @route   DELETE /api/alumni/:id
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!alumni) {
      return res.status(404).json({ success: false, message: 'Alumni not found' });
    }
    res.json({ success: true, message: 'Alumni record removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

