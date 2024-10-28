import { NameType } from '../types';

interface ScenarioBank {
  formal: (name: string) => string[];
  nickname: (name: string) => string[];
  english: (name: string) => string[];
}

const scenarios: ScenarioBank = {
  formal: (name: string) => [
    `"${name}同学，请上台领取特等奖学金。"校长在毕业典礼上庄重宣读`,
    `《人民日报》报道：青年科学家${name}获得国家自然科学奖`,
    `${name}医生在手术室里专注地拯救生命`,
    `央视新闻：${name}教授在国际会议上发表重要演讲`,
    `${name}法官庄严地敲下法槌，主持正义`,
    `"让我们欢迎${name}建筑师分享这座地标性建筑的设计理念"`,
    `${name}总裁在年度股东大会上自信地展望未来`,
    `诺贝尔奖获得者${name}在斯德哥尔摩发表获奖演说`
  ],
  nickname: (name: string) => [
    `"${name}，快来吃奶奶包的饺子啦！"温暖的年夜饭场景`,
    `"${name}真棒！"爸爸妈妈在幼儿园表演上开心鼓掌`,
    `外婆轻声细语："${name}乖，让外婆抱抱"`,
    `"${name}，生日快乐！"全家人围着蛋糕温馨祝福`,
    `"${name}，你画的画真漂亮！"老师在作品展上称赞`,
    `"${name}，快来和表妹一起玩！"春节团圆其乐融融`,
    `"今天${name}第一天上幼儿园，真是个勇敢的小朋友！"`,
    `"${name}，要和小伙伴好好分享玩具哦！"妈妈温柔地说`
  ],
  english: (name: string) => [
    `"${name}, your presentation was brilliant!" praised the Harvard professor`,
    `"Please welcome our exchange student, ${name}!" announced the international school principal`,
    `"${name}, you'll lead the global project team," the CEO announced confidently`,
    `"Congratulations ${name} on winning the International Youth Science Award!"`,
    `"${name}, your research paper has been accepted by Nature magazine!"`,
    `"Here's ${name}, our talented pianist from the Shanghai Conservatory of Music"`,
    `"${name}, would you share your experience about studying abroad?" asked the mentor`,
    `"Meet ${name}, our new cultural ambassador," introduced the UN representative`
  ]
};

export const getRandomScenario = (type: NameType, name: string): string => {
  const scenarioList = scenarios[type](name);
  return scenarioList[Math.floor(Math.random() * scenarioList.length)];
};