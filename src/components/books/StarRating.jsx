import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import { FiStar } from 'react-icons/fi';

export const StarRating = ({ rating, count }) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex text-[hsl(var(--accent))]">
        {[1, 2, 3, 4, 5].map((star) => (
          <SafeIcon 
            key={star} 
            icon={FiStar} 
            className={`w-4 h-4 ${star <= rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-sm text-[hsl(var(--muted-foreground))] ml-2">({count})</span>
      )}
    </div>
  );
};