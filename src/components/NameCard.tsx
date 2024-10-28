import React, { useState } from 'react';
import { RefreshCcw, Copy, Globe, Heart, BookOpen, Info, Sparkles } from 'lucide-react';
import { getNameMeaning } from '../utils/nameMeanings';
import { getRandomScenario } from '../utils/scenarios';
import { NameType, CardConfig } from '../types';

interface NameCardProps {
  type: NameType;
  name: string;
  surname?: string;
  onRegenerate: () => void;
}

const cardConfig: Record<NameType, CardConfig> = {
  formal: {
    icon: <BookOpen className="w-6 h-6 text-teal-500" />,
    title: '学名',
    description: '正式场合使用的名字',
    gradient: 'from-teal-50 to-emerald-50'
  },
  nickname: {
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    title: '小名',
    description: '亲切可爱的昵称',
    gradient: 'from-rose-50 to-pink-50'
  },
  english: {
    icon: <Globe className="w-6 h-6 text-blue-500" />,
    title: '英文名',
    description: '国际交流使用的名字',
    gradient: 'from-blue-50 to-indigo-50'
  }
};

const NameCard: React.FC<NameCardProps> = ({ type, name, surname, onRegenerate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { icon, title, description, gradient } = cardConfig[type];
  const displayName = type === 'formal' && surname ? `${surname}${name}` : name;
  const meaning = getNameMeaning(type, type === 'formal' ? name : displayName);
  const scenario = getRandomScenario(type, displayName);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayName);
  };

  return (
    <div className={`relative bg-gradient-to-br ${gradient} rounded-xl shadow-lg overflow-hidden group`}>
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {icon}
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 hover:bg-gray-100/80 rounded-full transition-colors"
              title="查看详情"
            >
              <Info className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-100/80 rounded-full transition-colors"
              title="复制到剪贴板"
            >
              <Copy className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={onRegenerate}
              className="p-2 hover:bg-gray-100/80 rounded-full transition-colors"
              title="重新生成"
            >
              <RefreshCcw className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-wide">{displayName}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ${
          showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">名字释义</span>
                <BookOpen className="w-4 h-4 text-gray-400" />
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">{meaning}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">未来印记</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </h4>
              <div className="text-sm text-gray-600 leading-relaxed italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                {scenario}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameCard;