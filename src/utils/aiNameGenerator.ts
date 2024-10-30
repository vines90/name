const API_BASE_URL = 'https://www.DMXapi.com/v1/';
const API_KEY = 'sk-uolQ9eUX7849ggURAcCf29lCAkglpJO4lzAE4xSgZmppKGzY';

interface NameResponse {
  names: string[];
}

export async function generateNames(options: {
  gender: 'male' | 'female',
  surname: string,
  nameLength: number,
  style: string,
  birthYear?: number,
  fatherName?: string,
  motherName?: string,
  preferredElements?: string[],
  desiredProfession?: string,
  generation?: string,
  mbti?: string
}): Promise<string[]> {
  const prompt = `请根据以下要求生成20个独特的中文名字：

个人信息：
- 性别：${options.gender === 'male' ? '男' : '女'}
- 姓氏：${options.surname}
- 名字长度：${options.nameLength === 1 ? '单字名' : '双字名'}
- 风格倾向：${options.style}
${options.birthYear ? `- 出生年份：${options.birthYear}` : ''}
${options.fatherName ? `- 父亲姓名：${options.fatherName}` : ''}
${options.motherName ? `- 母亲姓名：${options.motherName}` : ''}
${options.preferredElements?.length ? `- 五行喜好：${options.preferredElements.join('、')}` : ''}
${options.desiredProfession ? `- 期望职业：${options.desiredProfession}` : ''}
${options.generation ? `- 字辈要求：${options.generation}` : ''}
${options.mbti ? `- MBTI性格：${options.mbti}` : ''}

要求：
1. 必须严格使用指定的姓氏"${options.surname}"
2. 名字长度必须是${options.nameLength === 1 ? '一个字' : '两个字'}
3. 避免生僻字或难读的字
4. 字形要优美
5. 名字要朗朗上口
6. 每个名字要独特，不要重复用字
请以JSON格式返回20个完整名字（包含姓氏），不要包含解释。
格式示例：
{
  "names": [
    "${options.surname}明轩",
    "${options.surname}子墨"
  ]
}
...`;

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
            content: '你是一个专业的取名专家，精通中国传统文化和现代命名理念。请直接返回名字列表，每行一个名字。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      console.error('API响应错误:', await response.text());
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    try {
      const cleanContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const parsedData: NameResponse = JSON.parse(cleanContent);
      
      if (!Array.isArray(parsedData.names) || parsedData.names.length === 0) {
        console.error('API返回的名字列表无效:', parsedData);
        throw new Error('未能生成有效的名字列表');
      }

      const validNames = parsedData.names.filter(name => 
        typeof name === 'string' && 
        name.trim().length > 0 && 
        name.startsWith(options.surname)
      );

      if (validNames.length === 0) {
        console.error('没有有效的名字:', parsedData.names);
        throw new Error('未能生成有效的名字');
      }

      return validNames;
    } catch (parseError) {
      console.error('解析 JSON 响应失败:', parseError);
      console.error('原始内容:', content);
      throw new Error('解析生成的名字失败');
    }
  } catch (error) {
    console.error('生成名字列表失败：', error);
    throw error;
  }
}