import React, { useState } from 'react';
import { Sparkles, Copy } from 'lucide-react';
import UserPreferences from './components/UserPreferences';
import { generateNames } from './utils/aiNameGenerator';
import { interpretName } from './utils/nameInterpreter';
import { UserInputs } from './types';
import NameCard from './components/NameCard';

interface NameData {
  formal: string;
  meaning: string;
  nickname: string;
  english: string;
  origin: {
    fiveElements: string;
    allusion: string;
    implication: string;
  };
}

const API_BASE_URL = 'https://www.DMXapi.com/v1/';
const API_KEY = 'sk-uolQ9eUX7849ggURAcCf29lCAkglpJO4lzAE4xSgZmppKGzY';

async function getPinyin(text: string, surname: string): Promise<string> {
  try {
    const name = text.startsWith(surname) ? text.slice(surname.length) : text;
    
    const response = await fetch(`${API_BASE_URL}chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的中文拼音转换工具。请返回带声调的拼音，用空格分隔。例如：李明 -> míng'
          },
          {
            role: 'user',
            content: `请将以下中文名字转换为带声调的拼音：${name}`
          }
        ]
      })
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('获取拼音失败:', error);
    return '';
  }
}

function App() {
  const [userInputs, setUserInputs] = useState<UserInputs>({
    gender: 'neutral',
    birthYear: new Date().getFullYear(),
    surname: '',
    fatherName: '',
    motherName: '',
    preferredElements: [],
    desiredProfession: '',
    nameInspiration: '',
    nameLength: 2,
    generation: '',
    mbti: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiNames, setAiNames] = useState<NameData[]>([]);
  const [progress, setProgress] = useState(0);
  const [pinyinMap, setPinyinMap] = useState<Record<string, string>>({});
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [nameInterpretation, setNameInterpretation] = useState<NameData | null>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [viewedNames, setViewedNames] = useState<Set<string>>(new Set());

  const handleInputChange = (newInputs: Partial<UserInputs>) => {
    const updatedInputs = { ...userInputs, ...newInputs };
    setUserInputs(updatedInputs);
  };

  const handleNameClick = async (name: string) => {
    setSelectedName(name);
    setIsInterpreting(true);
    
    setViewedNames(prev => new Set(prev).add(name));
    
    try {
      const interpretation = await interpretName(name, {
        gender: userInputs.gender === 'neutral' ? 'male' : userInputs.gender,
        birthYear: userInputs.birthYear,
        mbti: userInputs.mbti,
        preferredElements: userInputs.preferredElements
      });
      
      if (interpretation) {
        setNameInterpretation(interpretation);
      }
    } catch (error) {
      console.error('解读名字失败：', error);
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setAiNames([]);
    setProgress(0);

    try {
      const names = await generateNames({
        gender: userInputs.gender === 'neutral' ? 'male' : userInputs.gender,
        surname: userInputs.surname,
        nameLength: userInputs.nameLength || 2,
        style: userInputs.nameInspiration || '文雅大方',
        birthYear: userInputs.birthYear,
        fatherName: userInputs.fatherName,
        motherName: userInputs.motherName,
        preferredElements: userInputs.preferredElements,
        desiredProfession: userInputs.desiredProfession,
        generation: userInputs.generation,
        mbti: userInputs.mbti
      });

      if (names.length > 0) {
        // 显示名字列表
        setAiNames(names.map(name => ({
          formal: name,
          meaning: '点击查看详细解读',
          nickname: '',
          english: '',
          origin: {
            fiveElements: '',
            allusion: '',
            implication: ''
          }
        })));
      } else {
        throw new Error('未能生成名字');
      }
    } catch (error) {
      console.error('生成名字时出错:', error);
      setError('生成名字失败，请重试。');
    } finally {
      setIsGenerating(false);
      setProgress(100);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            寻找完美名字
            <span className="inline-block ml-2">
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </span>
          </h1>
          <p className="text-gray-600 text-lg">为您的宝宝创造独特而美好的名字</p>
        </header>

        <UserPreferences 
          userInputs={userInputs} 
          onInputChange={handleInputChange}
          onAIGenerate={handleAIGenerate}
          isGenerating={isGenerating}
        />

        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">取名进度</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {aiNames.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              即将为您推荐20个名字
              {isGenerating && <span className="text-gray-500 text-sm ml-2">（正在取名中...）</span>}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiNames.map((nameData, index) => {
                const isViewed = viewedNames.has(nameData.formal);
                
                return (
                  <div
                    key={index}
                    className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer
                      ${isViewed ? 'border-2 border-purple-300' : ''}
                    `}
                    onClick={() => handleNameClick(nameData.formal)}
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
              })}
            </div>
          </div>
        )}
      </div>

      {/* 名字解读弹窗 */}
      {selectedName && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            style={{
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {isInterpreting ? (
              // 加载动画
              <div className="p-12 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">正在解读名字的寓意...</p>
              </div>
            ) : nameInterpretation ? (
              // 名字解读内容
              <>
                {/* 关闭按钮 */}
                <button
                  onClick={() => {
                    setSelectedName(null);
                    setNameInterpretation(null);
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  ✕
                </button>

                <div className="p-6 animate-fadeIn">
                  {/* 大名 */}
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-800">
                      {typeof nameInterpretation.formal === 'string' ? nameInterpretation.formal : ''}
                    </h3>
                  </div>

                  {/* 昵称和英文名 */}
                  <div className="flex justify-between mb-6">
                    <div className="text-center flex-1">
                      <div className="text-sm text-gray-500 mb-1">昵称</div>
                      <div className="text-lg font-medium text-gray-700">
                        {typeof nameInterpretation.nickname === 'string' ? nameInterpretation.nickname : ''}
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-sm text-gray-500 mb-1">英文名</div>
                      <div className="text-lg font-medium text-gray-700">
                        {typeof nameInterpretation.english === 'string' ? nameInterpretation.english : ''}
                      </div>
                    </div>
                  </div>

                  {/* 名字释义 */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">名字释义</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {typeof nameInterpretation.meaning === 'string' ? nameInterpretation.meaning : ''}
                    </p>
                  </div>

                  {/* 五行分析 */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">五行分析</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {typeof nameInterpretation.origin.fiveElements === 'string' ? nameInterpretation.origin.fiveElements : ''}
                    </p>
                  </div>

                  {/* 典故 */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">典故出处</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {typeof nameInterpretation.origin.allusion === 'string' ? nameInterpretation.origin.allusion : ''}
                    </p>
                  </div>

                  {/* 寓意 */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">深层寓意</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {typeof nameInterpretation.origin.implication === 'string' ? nameInterpretation.origin.implication : ''}
                    </p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;