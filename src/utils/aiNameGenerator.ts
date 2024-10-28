import OpenAI from 'openai';
import { UserInputs } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
  dangerouslyAllowBrowser: true
});

export async function generateAIName(inputs: UserInputs) {
  try {
    const prompt = `请为一个${inputs.gender === 'male' ? '男孩' : 
      inputs.gender === 'female' ? '女孩' : '孩子'}起一个完整的名字组合，包括：
      1. 正式名字（学名）
      2. 小名（昵称）
      3. 英文名

      条件：
      ${inputs.surname ? `姓氏：${inputs.surname}` : ''}
      ${inputs.fatherName ? `父亲姓名：${inputs.fatherName}` : ''}
      ${inputs.motherName ? `母亲姓名：${inputs.motherName}` : ''}
      ${inputs.preferredElements.length > 0 ? 
        `喜欢的五行元素：${inputs.preferredElements.join('、')}` : ''}
      ${inputs.desiredProfession ? `期望职业：${inputs.desiredProfession}` : ''}
      ${inputs.nameInspiration ? `灵感来源：${inputs.nameInspiration}` : ''}

      要求：
      1. 学名要富有诗意，寓意美好，与所设置的条件有紧密联系
      2. 小名要可爱亲切，易于长辈呼唤，且与学名相关联
      3. 英文名要考虑与中文名的含义相呼应
      4. 三个名字要有内在联系，体现统一的人格特征

      请只返回名字，格式：学名|小名|英文名`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 100,
    });

    const generatedName = completion.choices[0]?.message?.content?.trim();
    if (!generatedName) {
      throw new Error('No name was generated');
    }

    const [formal, nickname, english] = generatedName.split('|');
    return formal;
  } catch (error) {
    console.error('AI name generation failed:', error);
    throw error;
  }
}