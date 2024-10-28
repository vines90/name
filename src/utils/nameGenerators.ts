import { UserInputs } from '../types';

const surnames = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴'];

const maleNames = {
  '金': ['鑫', '铭', '钧', '锋', '铮'],
  '木': ['桐', '楠', '榕', '森', '桢'],
  '水': ['洋', '波', '润', '泽', '涛'],
  '火': ['炎', '煜', '焱', '炫', '烨'],
  '土': ['堃', '垚', '磊', '砚', '墨']
};

const femaleNames = {
  '金': ['金', '琳', '璐', '瑶', '玲'],
  '木': ['芸', '荷', '莲', '桃', '菱'],
  '水': ['瑗', '滢', '湘', '漪', '澜'],
  '火': ['炫', '煜', '琰', '熠', '烨'],
  '土': ['璞', '琪', '瑾', '玥', '珺']
};

const neutralNames = {
  '金': ['鑫', '琳', '璐', '铭', '钧'],
  '木': ['桐', '芸', '楠', '榕', '森'],
  '水': ['洋', '瑗', '滢', '湘', '漪'],
  '火': ['炫', '煜', '焱', '琰', '熠'],
  '土': ['堃', '璞', '琪', '瑾', '玥']
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const generateChineseName = (inputs: UserInputs): string => {
  const nameBank = inputs.gender === 'male' ? maleNames :
                  inputs.gender === 'female' ? femaleNames :
                  neutralNames;
  
  const elements = inputs.preferredElements.length > 0 ? 
                  inputs.preferredElements :
                  ['金', '木', '水', '火', '土'];
  
  const firstElement = getRandomElement(elements);
  const secondElement = getRandomElement(elements);
  
  const firstName = getRandomElement(nameBank[firstElement]);
  const secondName = getRandomElement(nameBank[secondElement]);
  
  return `${firstName}${secondName}`;
};

export const generateNickname = (inputs: UserInputs): string => {
  const name = generateChineseName(inputs);
  const repeatedChar = name[0];
  return `${repeatedChar}${repeatedChar}`;
};

export const generateEnglishName = (inputs: UserInputs): string => {
  const englishNames = {
    male: ['Liam', 'Noah', 'Oliver', 'William', 'James', 'Benjamin', 'Lucas', 'Henry', 'Theodore'],
    female: ['Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Charlotte', 'Amelia', 'Mia', 'Harper'],
    neutral: ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Riley', 'Casey', 'Quinn', 'Skylar', 'Avery']
  };

  const nameBank = inputs.gender === 'male' ? englishNames.male :
                  inputs.gender === 'female' ? englishNames.female :
                  englishNames.neutral;
  
  return getRandomElement(nameBank);
};