interface NameInterpretation {
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

export async function interpretName(
  name: string,
  options: {
    gender: 'male' | 'female',
    birthYear?: number,
    mbti?: string,
    preferredElements?: string[],
    desiredProfession?: string,
    nameInspiration?: string,
    generation?: string,
    fatherName?: string,
    motherName?: string
  }
): Promise<NameInterpretation | null> {
  const prompt = `请对这个中文名字"${name}"进行深入解读，并以严格的JSON格式返回结果。

背景信息：
- 性别：${options.gender === 'male' ? '男' : '女'}
- 出生年份：${options.birthYear || new Date().getFullYear()}
${options.mbti ? `- MBTI性格：${options.mbti}` : ''}
${options.preferredElements?.length ? `- 五行偏好：${options.preferredElements.join('、')}` : ''}
${options.desiredProfession ? `- 期望职业：${options.desiredProfession}` : ''}
${options.nameInspiration ? `- 名字灵感来源：${options.nameInspiration}` : ''}
${options.generation ? `- 字辈要求：${options.generation}` : ''}
${options.fatherName ? `- 父亲姓名：${options.fatherName}` : ''}
${options.motherName ? `- 母亲姓名：${options.motherName}` : ''}

请严格按照以下JSON格式返回（注意：所有属性名必须使用双引号，不要添加任何注释或说明）：
{
  "formal": "${name}",
  "meaning": "详细解释每个字的出处、含义，并结合用户背景信息分析名字的整体寓意",
  "nickname": "基于名字特点派生的小名",
  "english": "与中文名字意境相符的英文名，不要直接用拼音，要符合英国人名习惯",
  "origin": {
    "fiveElements": "分析名字中每个字的五行属性，说明与用户五行偏好的关系，预测对人生的影响",
    "allusion": "相关的历史典故、文化典故，特别是与用户选择的名字灵感来源相关的典故",
    "implication": "结合用户的具体情况分析名字的深层寓意和期望"
  }
}`

  try {
    const response = await fetch(`${API_BASE_URL}chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        format: 'json_object',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的名字解读专家。请确保返回严格的JSON格式，所有属性名必须使用双引号，不要添加任何注释或额外说明。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    try {
      // 清理可能的非 JSON 内容
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const cleanContent = jsonMatch ? jsonMatch[0] : content;
      
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error('解析名字解读结果失败：', error);
      console.error('原始内容：', content);
      return null;
    }
  } catch (error) {
    console.error('获取名字解读失败：', error);
    return null;
  }
} 