import React from 'react';
import { NameData } from '../types';

interface NameCardProps {
  nameData: NameData;
  isViewed: boolean;
  onClick: (name: string) => void;
}

const NameCard: React.FC<NameCardProps> = ({ nameData, isViewed, onClick }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer
        ${isViewed ? 'border-2 border-purple-300' : ''}
      `}
      onClick={() => onClick(nameData.formal)}
    >
      <div className="p-6">
        <div className="text-3xl font-bold text-gray-800 text-center mb-4">
          {nameData.formal}
        </div>
        <div className="text-sm text-center">
          {isViewed ? (
            <span className="text-purple-500">已查看详细解读</span>
          ) : (
            <span className="text-gray-500">点击查看详细解读</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NameCard;