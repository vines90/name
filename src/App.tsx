import React, { useState } from 'react';
import { Sparkles, RefreshCcw } from 'lucide-react';
import NameCard from './components/NameCard';
import UserPreferences from './components/UserPreferences';
import { generateChineseName, generateNickname, generateEnglishName } from './utils/nameGenerators';
import { generateAIName } from './utils/aiNameGenerator';
import { UserInputs } from './types';

function App() {
  const [userInputs, setUserInputs] = useState<UserInputs>({
    gender: 'neutral',
    birthYear: new Date().getFullYear(),
    surname: '',
    fatherName: '',
    motherName: '',
    preferredElements: [],
    desiredProfession: '',
    nameInspiration: ''
  });

  const [formalName, setFormalName] = useState(generateChineseName(userInputs));
  const [nickname, setNickname] = useState(generateNickname(userInputs));
  const [englishName, setEnglishName] = useState(generateEnglishName(userInputs));
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const regenerateAll = () => {
    setFormalName(generateChineseName(userInputs));
    setNickname(generateNickname(userInputs));
    setEnglishName(generateEnglishName(userInputs));
    setError(null);
  };

  const handleInputChange = (newInputs: Partial<UserInputs>) => {
    const updatedInputs = { ...userInputs, ...newInputs };
    setUserInputs(updatedInputs);
    regenerateAll();
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const aiName = await generateAIName(userInputs);
      setFormalName(aiName);
    } catch (error) {
      setError('AI生成名字失败，已切换到本地生成。');
      setFormalName(generateChineseName(userInputs));
    } finally {
      setIsGenerating(false);
    }
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

        <div className="grid md:grid-cols-3 gap-8 my-12">
          <NameCard
            type="formal"
            name={formalName}
            surname={userInputs.surname}
            onRegenerate={() => setFormalName(generateChineseName(userInputs))}
          />
          <NameCard
            type="nickname"
            name={nickname}
            onRegenerate={() => setNickname(generateNickname(userInputs))}
          />
          <NameCard
            type="english"
            name={englishName}
            onRegenerate={() => setEnglishName(generateEnglishName(userInputs))}
          />
        </div>

        <div className="text-center">
          <button
            onClick={regenerateAll}
            className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-full
              font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            重新生成所有名字
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;