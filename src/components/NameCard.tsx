import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { getNameMeaning } from '../utils/nameMeanings';

interface NameCardProps {
  type: 'formal' | 'nickname' | 'english';
  name: string;
  surname?: string;
  onRegenerate: () => void;
}

const typeLabels = {
  formal: '正式名字',
  nickname: '昵称',
  english: '英文名'
};

const NameCard: React.FC<NameCardProps> = ({ type, name, surname = '', onRegenerate }) => {
  const fullName = type === 'formal' ? `${surname}${name}` : name;
  const meaning = type === 'formal' ? getNameMeaning(name, surname) : '';

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-600">
            {typeLabels[type]}
          </h3>
          <button
            onClick={onRegenerate}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            title="重新生成"
          >
            <RefreshCcw className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {fullName}
          </div>
          {meaning && (
            <div className="text-sm text-gray-500 mt-2">
              {meaning}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NameCard;