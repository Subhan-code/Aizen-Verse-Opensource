import React from 'react';

interface FilterBarProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      <div className="flex gap-3 min-w-max">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`whitespace-nowrap px-6 py-2 rounded-full font-outfit font-medium transition-all ${
              activeFilter === filter
                ? 'bg-white text-black'
                : 'bg-transparent text-white border border-white/30 hover:border-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;