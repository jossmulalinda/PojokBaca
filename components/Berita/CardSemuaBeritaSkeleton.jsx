import React from "react";

const CardSemuaBeritaSkeleton = () => {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-dark-blue border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm h-full">
      {/* Image Skeleton */}
      <div className="h-48 w-full bg-gray-200 dark:bg-slate-800 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col gap-3">
        {/* Meta Skeleton */}
        <div className="w-1/3 bg-gray-100 dark:bg-slate-900 h-3 rounded-full animate-pulse" />
        
        {/* Title Skeletons */}
        <div className="w-full bg-gray-200 dark:bg-slate-800 h-4 rounded-full animate-pulse" />
        <div className="w-3/4 bg-gray-200 dark:bg-slate-800 h-4 rounded-full animate-pulse" />
        
        {/* Excerpt Skeletons */}
        <div className="w-full bg-gray-100 dark:bg-slate-900 h-3 rounded-full animate-pulse mt-2" />
        <div className="w-5/6 bg-gray-100 dark:bg-slate-900 h-3 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default CardSemuaBeritaSkeleton;
