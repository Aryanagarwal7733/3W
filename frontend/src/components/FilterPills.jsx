import React from 'react';

export default function FilterPills({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'All Post' },
    { id: 'foryou', label: 'For You' },
    { id: 'likes', label: 'Most Liked' },
    { id: 'comments', label: 'Most Commented' }
  ];

  return (
    <div className="tp-filter-pills-container scroll-hide">
      {filters.map((filter) => (
        <div
          key={filter.id}
          className={`tp-filter-pill ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </div>
      ))}
    </div>
  );
}
