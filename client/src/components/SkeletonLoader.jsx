import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 bg-slate-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-3 bg-slate-200 rounded"></div>
      <div className="h-3 bg-slate-200 rounded w-5/6"></div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
      <div className="h-6 bg-slate-200 rounded-full w-16"></div>
      <div className="h-6 bg-slate-200 rounded-full w-20"></div>
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="animate-pulse space-y-3">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-14 bg-white border border-slate-200 rounded-xl flex items-center px-4 gap-4">
        <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
        <div className="h-4 bg-slate-200 rounded w-48"></div>
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-4 bg-slate-200 rounded w-32"></div>
        <div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div>
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="h-72 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-slate-400">
    Loading chart visualization...
  </div>
);

