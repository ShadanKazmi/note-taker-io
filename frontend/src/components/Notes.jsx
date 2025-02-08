import React from 'react';
import { GiRoundStar } from "react-icons/gi";
import { FiImage, FiMusic } from "react-icons/fi";

const Notes = ({ CreatedAt, Title, TextContent, onClick, fav, isFav, Image, Audio }) => {
  const truncateContent = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : text;
  };

  const formattedDate = new Date(CreatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(CreatedAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="max-w-md h-[450px] w-[380px] bg-white shadow-lg rounded-lg p-6 border border-black cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{formattedDate}</span>
          <span>|</span>
          <span>{formattedTime}</span>
          <span>
            <GiRoundStar
              onClick={(e) => {
                e.stopPropagation();
                fav();
              }}
              className={`${isFav ? 'text-red-500' : 'text-yellow-400'} text-xl hover:text-yellow-500 transition-transform transform hover:scale-125 cursor-pointer`}
              title={isFav ? 'Unmark as Favorite' : 'Mark as Favorite'}
            />
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{Title}</h2>
      </div>

      <p className="text-gray-700 text-base">
        {truncateContent(TextContent, 50)}
      </p>

      <div className="flex space-x-4 mt-4 items-center">
        {Image && (
          <div className="flex items-center">
            <FiImage className="text-blue-500 text-2xl hover:text-blue-700" title="Image Attached" />
          </div>
        )}
        {Audio && (
          <div className="flex items-center">
            <FiMusic className="text-green-500 text-2xl hover:text-green-700" title="Audio Attached" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
