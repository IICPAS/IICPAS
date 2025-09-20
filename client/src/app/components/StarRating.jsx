"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function StarRating({ rating = 0, onRatingChange, interactive = true, size = "text-lg" }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (newRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating) => {
    if (interactive) {
      setHoverRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            className={`${size} transition-colors duration-200 ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
          >
            <FaStar
              className={`${
                isFilled
                  ? 'text-yellow-400 drop-shadow-sm'
                  : 'text-gray-300'
              } transition-colors duration-200`}
            />
          </button>
        );
      })}
      {interactive && (
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Rate this'}
        </span>
      )}
    </div>
  );
}
