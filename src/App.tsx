import React, { useState } from 'react';
import { Sparkles, Copy } from 'lucide-react';
import UserPreferences from './components/UserPreferences';
import { generateAIName } from './utils/aiNameGenerator';
import { UserInputs } from './types';

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

  const handleInputChange = (newInputs: Partial<UserInputs>) => {
    const updatedInputs = { ...userInputs, ...newInputs };
    setUserInputs(updatedInputs);
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setAiNames([]);
    setPinyinMap({});
    setProgress(0);

    const options = {
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
    };

    let generatedCount = 0;
    const tempNames: NameData[] = [];

    try {
      for await (const nameData of generateAIName(options)) {
        if (nameData) {
          generatedCount++;
          tempNames.push(nameData);
          
          setAiNames([...tempNames]);
          setProgress(generatedCount * 5);
          
          const pinyin = await getPinyin(nameData.formal, options.surname);
          setPinyinMap(prev => ({
            ...prev,
            [nameData.formal]: pinyin
          }));
        }
      }
    } catch (error) {
      console.error('生成名字时出错:', error);
      setError('部分名字生成失败，请重试。');
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
              即将为您推荐10个名字
              {isGenerating && <span className="text-gray-500 text-sm ml-2">（正在取名中...）</span>}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiNames.map((nameData, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 
                    animate-fadeInUp opacity-0"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-baseline mb-4">
                      <div className="text-3xl font-bold text-gray-800 text-left">
                        {nameData.formal}
                      </div>
                      <div className="ml-3 text-sm text-gray-400 font-serif italic">
                        {pinyinMap[nameData.formal]}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      {nameData.meaning}
                    </div>
                    
                    <div className="flex justify-between text-sm mb-4">
                      <div className="text-gray-500">
                        <span className="font-medium">小名：</span>
                        {nameData.nickname}
                      </div>
                      <div className="text-gray-500">
                        <span className="font-medium">英文名：</span>
                        {nameData.english}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="text-xs text-gray-500 mb-2">
                        <span className="font-medium">五行运势：</span>
                        {nameData.origin.fiveElements}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        <span className="font-medium">典故：</span>
                        {nameData.origin.allusion}
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">寓意：</span>
                        {nameData.origin.implication}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => copyToClipboard(nameData.formal)}
                      className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-gray-600 
                        hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      复制完整名字
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;