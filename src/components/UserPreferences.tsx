import React from 'react';
import { UserInputs } from '../types';
import { Wand2 } from 'lucide-react';

interface UserPreferencesProps {
  userInputs: UserInputs;
  onInputChange: (inputs: Partial<UserInputs>) => void;
  onAIGenerate: () => void;
  isGenerating: boolean;
}

const mbtiOptions = [
  { value: '', label: '请选择' },
  { value: 'INTJ', label: 'INTJ - 建筑师' },
  { value: 'INTP', label: 'INTP - 逻辑学家' },
  { value: 'ENTJ', label: 'ENTJ - 指挥官' },
  { value: 'ENTP', label: 'ENTP - 辩论家' },
  { value: 'INFJ', label: 'INFJ - 提倡者' },
  { value: 'INFP', label: 'INFP - 调停者' },
  { value: 'ENFJ', label: 'ENFJ - 主人公' },
  { value: 'ENFP', label: 'ENFP - 竞选者' },
  { value: 'ISTJ', label: 'ISTJ - 物流师' },
  { value: 'ISFJ', label: 'ISFJ - 守卫者' },
  { value: 'ESTJ', label: 'ESTJ - 总经理' },
  { value: 'ESFJ', label: 'ESFJ - 执政官' },
  { value: 'ISTP', label: 'ISTP - 鉴赏家' },
  { value: 'ISFP', label: 'ISFP - 探险家' },
  { value: 'ESTP', label: 'ESTP - 企业家' },
  { value: 'ESFP', label: 'ESFP - 表演者' }
];

const inspirationOptions = [
  { value: '', label: '请选择' },
  { value: '四书五经', label: '四书五经 - 儒家经典的智慧' },
  { value: '唐诗宋词', label: '唐诗宋词 - 诗词之美' },
  { value: '楚辞诗经', label: '楚辞诗经 - 远古文化' },
  { value: '数理科技', label: '数理科技 - 现代创新' },
  { value: '山水自然', label: '山水自然 - 自然之美' },
  { value: '文雅大方', label: '文雅大方 - 温和典雅' },
  { value: '英姿飒爽', label: '英姿飒爽 - 英气勃发' },
  { value: '旷达豁达', label: '旷达豁达 - 胸怀开阔' },
  { value: '儒雅随和', label: '儒雅随和 - 温文尔雅' },
  { value: '才智灵慧', label: '才智灵慧 - 聪明智慧' },
  { value: '军事将领', label: '军事将领 - 气势磅礴' },
  { value: '商业企业', label: '商业企业 - 经营智慧' },
  { value: '艺术审美', label: '艺术审美 - 艺术气息' },
  { value: '医药养生', label: '医药养生 - 济世救人' }
];

const UserPreferences: React.FC<UserPreferencesProps> = ({
  userInputs,
  onInputChange,
  onAIGenerate,
  isGenerating
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">个性化设置</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 性别选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            性别
          </label>
          <select
            value={userInputs.gender}
            onChange={(e) => onInputChange({ gender: e.target.value as 'male' | 'female' | 'neutral' })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="neutral">不限</option>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>

        {/* 名字长度 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            名字长度
          </label>
          <select
            value={userInputs.nameLength}
            onChange={(e) => onInputChange({ nameLength: Number(e.target.value) as 1 | 2 })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value={1}>单字名</option>
            <option value={2}>双字名</option>
          </select>
        </div>

        {/* 出生年份 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            出生年份
          </label>
          <input
            type="number"
            value={userInputs.birthYear}
            onChange={(e) => onInputChange({ birthYear: parseInt(e.target.value) })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {/* 姓氏 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            姓氏
          </label>
          <input
            type="text"
            value={userInputs.surname}
            onChange={(e) => onInputChange({ surname: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="请输入姓氏"
          />
        </div>

        {/* 字辈 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            字辈
          </label>
          <input
            type="text"
            value={userInputs.generation}
            onChange={(e) => onInputChange({ generation: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="可选，如'德'字辈"
          />
        </div>

        {/* MBTI性格 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            MBTI性格
          </label>
          <select
            value={userInputs.mbti}
            onChange={(e) => onInputChange({ mbti: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {mbtiOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 父亲姓名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            父亲姓名
          </label>
          <input
            type="text"
            value={userInputs.fatherName}
            onChange={(e) => onInputChange({ fatherName: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="可选"
          />
        </div>

        {/* 母亲姓名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            母亲姓名
          </label>
          <input
            type="text"
            value={userInputs.motherName}
            onChange={(e) => onInputChange({ motherName: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="可选"
          />
        </div>

        {/* 五行喜好 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            五行喜好
          </label>
          <div className="flex flex-wrap gap-2">
            {['金', '木', '水', '火', '土'].map((element) => (
              <label key={element} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={userInputs.preferredElements.includes(element)}
                  onChange={(e) => {
                    const newElements = e.target.checked
                      ? [...userInputs.preferredElements, element]
                      : userInputs.preferredElements.filter(el => el !== element);
                    onInputChange({ preferredElements: newElements });
                  }}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 mr-3">{element}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 期望职业 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            期望职业
          </label>
          <input
            type="text"
            value={userInputs.desiredProfession}
            onChange={(e) => onInputChange({ desiredProfession: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="可选"
          />
        </div>

        {/* 名字灵感 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            名字灵感
            <span className="text-xs text-gray-500 ml-2">（影响名字的风格与内涵）</span>
          </label>
          <select
            value={userInputs.nameInspiration}
            onChange={(e) => onInputChange({ nameInspiration: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {inspirationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {userInputs.nameInspiration && (
            <p className="mt-1 text-xs text-gray-500">
              {inspirationOptions.find(opt => opt.value === userInputs.nameInspiration)?.label.split(' - ')[1]}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onAIGenerate}
          disabled={isGenerating || !userInputs.surname}
          className={`
            inline-flex items-center px-6 py-3 rounded-full text-white
            ${isGenerating || !userInputs.surname
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'}
            transition-all duration-200 shadow-md hover:shadow-lg
          `}
        >
          <Wand2 className="w-5 h-5 mr-2" />
          {isGenerating ? '生成中...' : '开始创造独特且美好的名字'}
        </button>
        {!userInputs.surname && (
          <p className="mt-2 text-sm text-red-500">请输入姓氏后继续</p>
        )}
      </div>
    </div>
  );
};

export default UserPreferences;