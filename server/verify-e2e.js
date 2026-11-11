const http = require('http');

function apiCall(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(raw) });
          } catch (e) {
            resolve({ status: res.statusCode, raw });
          }
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function verifyAll() {
  console.log('=== STARTING COMPLETE E2E VERIFICATION ===');
  let failures = 0;

  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      failures++;
    } else {
      console.log(`✅ PASS: ${message}`);
    }
  }

  // 1. Health
  const health = await apiCall('/api/health');
  assert(health.status === 200 && health.data.status === 'healthy', 'Health check returns 200 healthy');

  // 2. Stats
  const stats = await apiCall('/api/alumni/stats');
  assert(stats.status === 200, 'Stats endpoint returns 200');
  assert(stats.data.stats.totalAlumni === 24, `Total Alumni equals 24 (found ${stats.data.stats.totalAlumni})`);
  assert(stats.data.stats.mentorCount >= 6, `Mentor count between 6-10 (found ${stats.data.stats.mentorCount})`);
  assert(stats.data.stats.departmentStats.length >= 5, 'Department stats aggregated correctly');
  assert(stats.data.stats.topCompanies.length > 0, 'Top companies returned');

  // 3. Filter options
  const filterOpts = await apiCall('/api/alumni/filter-options');
  assert(filterOpts.status === 200 && filterOpts.data.options.departments.length > 0, 'Filter options returned');

  // 4. Query: Search by name
  const searchName = await apiCall('/api/alumni?search=Aarav');
  assert(searchName.data.alumni.length > 0 && searchName.data.alumni[0].fullName === 'Aarav Sharma', 'Search by name returns Aarav');

  // 5. Query: Filter by department
  const cseAlumni = await apiCall('/api/alumni?department=CSE');
  assert(cseAlumni.data.alumni.every((a) => a.department === 'CSE'), 'Filter by department CSE strictly returns CSE');

  // 6. Query: Filter by isMentor
  const mentorAlumni = await apiCall('/api/alumni?isMentor=true');
  assert(mentorAlumni.data.alumni.every((a) => a.isMentor === true), 'Filter isMentor=true strictly returns mentors');

  // 7. Query: Pagination
  const page1 = await apiCall('/api/alumni?page=1&limit=5');
  const page2 = await apiCall('/api/alumni?page=2&limit=5');
  assert(page1.data.alumni.length === 5, 'Page 1 limit 5 returns 5 alumni');
  assert(page2.data.alumni.length === 5, 'Page 2 limit 5 returns 5 alumni');
  assert(page1.data.alumni[0]._id !== page2.data.alumni[0]._id, 'Page 1 and Page 2 alumni are distinct');

  // 8. Auth: Login with bad credentials
  const badLogin = await apiCall('/api/auth/login', { method: 'POST' }, { email: 'admin@alumni.com', password: 'WrongPassword' });
  assert(badLogin.status === 401, 'Bad credentials correctly rejected with 401');

  // 9. Auth: Login with good credentials
  const goodLogin = await apiCall('/api/auth/login', { method: 'POST' }, { email: 'admin@alumni.com', password: 'Admin@123' });
  assert(goodLogin.status === 200 && !!goodLogin.data.token, 'Good login returns 200 and JWT token');
  const token = goodLogin.data.token;

  // 10. Auth: /api/auth/me
  const me = await apiCall('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  assert(me.status === 200 && me.data.admin.email === 'admin@alumni.com', 'Me endpoint returns admin email');

  // 11. Unauthorized Create
  const unauthCreate = await apiCall('/api/alumni', { method: 'POST' }, { fullName: 'Hacker' });
  assert(unauthCreate.status === 401, 'Create without token is rejected with 401');

  // 12. Authorized Create
  const createAlumni = await apiCall(
    '/api/alumni',
    { method: 'POST', headers: { Authorization: `Bearer ${token}` } },
    {
      fullName: 'Rahul Dravid',
      email: 'rahul.dravid@example.com',
      graduationYear: 2013,
      department: 'Mechanical',
      currentCompany: 'BCCI Tech',
      jobTitle: 'Head Coach & Systems Lead',
      city: 'Bengaluru',
      country: 'India',
      skills: ['Leadership', 'Mentoring', 'Team Building'],
      isMentor: true
    }
  );
  assert(createAlumni.status === 201 && createAlumni.data.alumni.fullName === 'Rahul Dravid', 'Created alumni with 201');
  const newId = createAlumni.data.alumni._id;

  // 13. Authorized Update
  const updateAlumni = await apiCall(
    `/api/alumni/${newId}`,
    { method: 'PUT', headers: { Authorization: `Bearer ${token}` } },
    {
      fullName: 'Rahul Dravid',
      email: 'rahul.dravid@example.com',
      graduationYear: 2013,
      department: 'Mechanical',
      currentCompany: 'National Cricket Academy',
      jobTitle: 'Director',
      city: 'Bengaluru'
    }
  );
  assert(updateAlumni.status === 200 && updateAlumni.data.alumni.currentCompany === 'National Cricket Academy', 'Updated alumni company with 200');

  // 14. Authorized Delete
  const deleteAlumni = await apiCall(
    `/api/alumni/${newId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
  );
  assert(deleteAlumni.status === 200, 'Deleted alumni profile with 200');

  // 15. Verify Alumni Count returns to 24
  const statsAfter = await apiCall('/api/alumni/stats');
  assert(statsAfter.data.stats.totalAlumni === 24, 'Alumni count returned to 24 after deletion');

  console.log(`=== VERIFICATION FINISHED: ${failures === 0 ? 'ALL CHECKS PASSED 🎉' : `${failures} FAILURES`} ===`);
  process.exit(failures);
}

setTimeout(verifyAll, 1500);

