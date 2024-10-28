import React from 'react';
import { UserInputs } from '../types';
import { Sparkles } from 'lucide-react';

interface UserPreferencesProps {
  userInputs: UserInputs;
  onInputChange: (inputs: Partial<UserInputs>) => void;
  onAIGenerate: () => void;
  isGenerating: boolean;
}

const elements = ['金', '木', '水', '火', '土'];
const inspirations = [
  '唐诗宋词',
  '诗经楚辞',
  '四大名著',
  '历史人物',
  '自然风物',
  '神话传说'
];

const professions = [
  '医生',
  '教师',
  '科学家',
  '艺术家',
  '企业家',
  '工程师',
  '作家',
  '律师'
];

const UserPreferences: React.FC<UserPreferencesProps> = ({ 
  userInputs, 
  onInputChange, 
  onAIGenerate,
  isGenerating 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">个性化设置</h2>
        <button
          onClick={onAIGenerate}
          disabled={isGenerating}
          className={`flex items-center px-6 py-2.5 rounded-lg text-white
            ${isGenerating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'}
            transition-all duration-300 shadow-md hover:shadow-lg`}
        >
          <Sparkles className={`w-5 h-5 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? '正在生成中...' : 'AI智能起名'}
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              性别
            </label>
            <select
              value={userInputs.gender}
              onChange={(e) => onInputChange({ gender: e.target.value as UserInputs['gender'] })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
            >
              <option value="neutral">不限</option>
              <option value="male">男孩</option>
              <option value="female">女孩</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              出生年份
            </label>
            <input
              type="number"
              value={userInputs.birthYear}
              onChange={(e) => onInputChange({ birthYear: parseInt(e.target.value) })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
              min="1900"
              max="2100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              姓氏
            </label>
            <input
              type="text"
              value={userInputs.surname}
              onChange={(e) => onInputChange({ surname: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="请输入姓氏"
              maxLength={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              父亲姓名
            </label>
            <input
              type="text"
              value={userInputs.fatherName}
              onChange={(e) => onInputChange({ fatherName: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="请输入父亲姓名"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              母亲姓名
            </label>
            <input
              type="text"
              value={userInputs.motherName}
              onChange={(e) => onInputChange({ motherName: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="请输入母亲姓名"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              五行喜好
            </label>
            <div className="flex flex-wrap gap-2">
              {elements.map((element) => (
                <button
                  key={element}
                  onClick={() => {
                    const newElements = userInputs.preferredElements.includes(element)
                      ? userInputs.preferredElements.filter(e => e !== element)
                      : [...userInputs.preferredElements, element];
                    onInputChange({ preferredElements: newElements });
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    userInputs.preferredElements.includes(element)
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {element}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              期望职业
            </label>
            <select
              value={userInputs.desiredProfession}
              onChange={(e) => onInputChange({ desiredProfession: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
            >
              <option value="">请选择</option>
              {professions.map((profession) => (
                <option key={profession} value={profession}>
                  {profession}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              名字灵感来源
            </label>
            <select
              value={userInputs.nameInspiration}
              onChange={(e) => onInputChange({ nameInspiration: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
            >
              <option value="">请选择</option>
              {inspirations.map((inspiration) => (
                <option key={inspiration} value={inspiration}>
                  {inspiration}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;