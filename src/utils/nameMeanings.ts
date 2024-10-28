interface NameMeanings {
  [key: string]: string[];
}

const chineseMeanings: NameMeanings = {
  '金': ['象征坚强、高贵', '代表纯洁、光明'],
  '木': ['寓意生机、成长', '象征挺拔、正直'],
  '水': ['代表智慧、灵动', '象征纯净、柔和'],
  '火': ['寓意热情、活力', '代表光明、温暖'],
  '土': ['象征稳重、厚实', '代表踏实、包容']
};

const nicknameMeanings: NameMeanings = {
  '小虎': '像小老虎一样勇敢活泼',
  '阳阳': '阳光开朗，充满活力',
  '小龙': '像龙一样充满力量',
  '小勇': '勇敢无畏的小英雄',
  '小帅': '英俊帅气的小男孩',
  '甜甜': '性格甜美，讨人喜欢',
  '萌萌': '可爱迷人，天真烂漫',
  '欢欢': '快乐开心，充满欢乐',
  '小美': '美丽可爱的小女孩',
  '小莲': '纯洁优雅如莲花',
  '豆豆': '小巧可爱，活泼可人',
  '乐乐': '快乐开朗，给人欢乐',
  '多多': '寓意美好事物会越来越多',
  '暖暖': '性格温暖，给人温馨',
  '星星': '闪耀明亮如星星'
};

const englishMeanings: NameMeanings = {
  'Liam': '意为"坚强的战士"，源自爱尔兰',
  'Noah': '意为"安慰、休息"，源自希伯来语',
  'Oliver': '意为"和平之树"，源自拉丁语',
  'William': '意为"坚定的保护者"，日耳曼语源',
  'James': '意为"取代者"，源自希伯来语',
  'Benjamin': '意为"幸运之子"，希伯来语源',
  'Lucas': '意为"光明"，源自拉丁语',
  'Henry': '意为"统治者"，日耳曼语源',
  'Theodore': '意为"上帝的礼物"，希腊语源',
  'Emma': '意为"全部"，日耳曼语源',
  'Olivia': '意为"和平之树"，拉丁语源',
  'Ava': '意为"生命"，拉丁语源',
  'Isabella': '意为"上帝的誓言"，希伯来语源',
  'Sophia': '意为"智慧"，希腊语源',
  'Charlotte': '意为"自由的人"，法语源',
  'Amelia': '意为"勤劳"，日耳曼语源',
  'Mia': '意为"我的"，意大利语源',
  'Harper': '意为"竖琴演奏者"，英语源',
  'Alex': '意为"保护者"，希腊语源',
  'Jordan': '意为"流动的"，希伯来语源',
  'Taylor': '意为"裁缝"，英语职业姓氏',
  'Morgan': '意为"海边"，威尔士语源',
  'Riley': '意为"勇敢"，爱尔兰语源',
  'Casey': '意为"勇敢的"，爱尔兰语源',
  'Quinn': '意为"智慧"，盖尔语源',
  'Skylar': '意为"学者"，荷兰语源',
  'Avery': '意为"统治者"，盎格鲁-撒克逊语源'
};

export const getNameMeaning = (type: string, name: string): string => {
  if (type === 'formal') {
    const characters = name.slice(1).split('');
    const meanings = characters.map(char => {
      for (const [element, meanings] of Object.entries(chineseMeanings)) {
        if (Object.values(element).includes(char)) {
          return meanings[Math.floor(Math.random() * meanings.length)];
        }
      }
      return '寓意美好、吉祥';
    });
    return `${name[0]}氏，${meanings.join('，')}。`;
  }
  
  if (type === 'nickname') {
    return nicknameMeanings[name] || '可爱活泼的昵称';
  }
  
  if (type === 'english') {
    return englishMeanings[name] || '优雅独特的英文名';
  }
  
  return '蕴含美好寓意的名字';
};