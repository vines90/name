/**
 * 名字生成器的配置选项接口
 */
interface NameGeneratorOptions {
  gender: 'male' | 'female'  // 性别
  surname: string           // 姓氏
  nameLength: number        // 名字长度(1或2)
  style: string            // 名字风格
  birthYear?: number       // 出生年份
  fatherName?: string      // 父亲姓名
  motherName?: string      // 母亲姓名
  preferredElements?: string[] // 偏好的五行属性
  desiredProfession?: string  // 期望职业
  generation?: string      // 字辈要求
  mbti?: string           // MBTI性格类型
}

/**
 * 生成的名字数据结构接口
 */
interface NameData {
  formal: string;          // 正式全名
  meaning: string;         // 名字含义解释
  nickname: string;        // 昵称
  english: string;         // 英文名
  origin: {
    fiveElements: string;  // 五行分析
    allusion: string;      // 相关典故
    implication: string;   // 深层寓意
  };
}

/**
 * AI接口返回数据结构
 */
interface AIResponse {
  names: NameData[];      // 生成的名字列表
}

// API配置常量
const API_BASE_URL = 'https://www.DMXapi.com/v1/';
const API_KEY = 'sk-uolQ9eUX7849ggURAcCf29lCAkglpJO4lzAE4xSgZmppKGzY';

/**
 * 生成单个名字
 * @param options 名字生成配置选项
 * @param existingNames 已存在的名字列表，用于避免重复
 * @param retryCount 重试次数
 * @returns 生成的名字数据，失败返回null
 */
async function generateSingleName(
  options: NameGeneratorOptions, 
  existingNames: string[] = [],
  retryCount = 3
): Promise<NameData | null> {
  // 解构配置选项
  const { 
    gender, 
    surname, 
    nameLength, 
    style, 
    birthYear, 
    fatherName, 
    motherName, 
    preferredElements, 
    desiredProfession,
    generation,
    mbti
  } = options;
  
  // 构建已生成名字的上下文记忆
  const existingNamesContext = existingNames.length > 0 
    ? `已经生成过以下名字，请确保新生成的名字与这些名字不重复，且不使用这些名字中的字：
${existingNames.map((name, index) => `${index + 1}. ${name}`).join('\n')}`
    : '';

  // 构建AI提示词
  const prompt = `请根据以下详细信息生成一个独特的中文名字：

${existingNamesContext ? existingNamesContext + '\n\n' : ''}个人基本信息：
- 性别：${gender === 'male' ? '男' : '女'}
- 姓氏：${surname}（必须使用此姓氏）
- 出生年份：${birthYear || new Date().getFullYear()}
- 父亲姓名：${fatherName || '未提供'}
- 母亲姓名：${motherName || '未提供'}
- 五行喜好：${Array.isArray(preferredElements) && preferredElements.length > 0 ? preferredElements.join('、') : '未指定'}
- 期望职业：${desiredProfession || '未指定'}
- 名字灵感：${style || '文雅大方'}
- 名字长度：${nameLength === 1 ? '单字名' : '双字名'}
- 字辈要求：${generation ? `必须包含字辈"${generation}"` : '无'}
- MBTI性格：${mbti || '未指定'}

命名要求：
1. 必须严格使用指定的姓氏"${surname}"
2. 名字长度必须是${nameLength === 1 ? '一个字' : '两个字'}(长度不包含姓氏)
${generation ? `3. 必须包含指定的字辈"${generation}"` : ''}
4. 必须符合${gender === 'male' ? '男孩' : '女孩'}的特点
5. 需要考虑出生年份${birthYear || new Date().getFullYear()}的时代特点
${Array.isArray(preferredElements) && preferredElements.length > 0 ? 
  `6. 优先使用五行属性为 ${preferredElements.join('、')} 的字` : ''}
${desiredProfession ? 
  `7. 名字寓意要与期望职业 ${desiredProfession} 相呼应` : ''}
${mbti ? 
  `8. 名字要体现 ${mbti} 性格特点` : ''}
9. 整体风格要体现"${style || '文雅大方'}"的特点
10. 避免生僻字或难读的字
11. 字形要优美
12. 名字要朗朗上口
${fatherName || motherName ? 
  '13. 可以适当参考父母名字中优美的用字' : ''}
14. 严格禁止使用已生成名字中的任何字
15. 新生成的名字必须与已有名字在含义和写法上有明显区别

请按照以下JSON格式返回（不要包含markdown标记）：
{
  "names": [
    {
      "formal": "完整名字（包含姓氏）",
      "meaning": "详细解释每个字的出处、五行属性和寓意，说明如何契合用户的具体要求",
      "nickname": "[加一个emoj]基于正式名字派生的亲切小名",
      "english": "建议的英文名（优先与名字含义相关）",
      "origin": {
        "fiveElements": "详细分析名字中每个字的五行属性，以及对人生运势的影响",
        "allusion": "相关的历史典故或文化典故",
        "implication": "结合个人信息（包括MBTI性格特点）的深层寓意和期望"
      }
    }
  ]
}`

  // 尝试生成名字，最多重试retryCount次
  for (let attempt = 0; attempt < retryCount; attempt++) {
    try {
      console.log(`尝试生成名字，第 ${attempt + 1} 次尝试`);
      
      // 调用AI API
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
              content: '你是一个专业的取名专家，精通中国传统文化和现代命名理念。请直接返回JSON格式数据，不要包含任何markdown标记。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000
        })
      })

      const responseText = await response.text();
      console.log('API 响应:', responseText);

      // 检查API响应状态
      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}, 响应内容: ${responseText}`);
      }

      // 解析API返回数据
      const data = JSON.parse(responseText);
      const content = data.choices[0]?.message?.content || '';
      console.log('解析后的内容:', content);
      
      try {
        // 清理返回内容中的markdown标记
        const cleanContent = content
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        console.log('清理后的内容:', cleanContent);
        
        // 解析JSON数据
        const parsedData: AIResponse = JSON.parse(cleanContent);
        if (parsedData.names?.[0]) {
          console.log('成功生成名字:', parsedData.names[0]);
          return parsedData.names[0];
        }
        throw new Error('返回数据格式不正确');
      } catch (parseError) {
        console.error('JSON 解析错误:', parseError);
        if (attempt === retryCount - 1) {
          console.error('所有重试都失败了，最后的错误:', parseError);
          return null;
        }
        continue;
      }
    } catch (error) {
      console.error(`第 ${attempt + 1} 次尝试失败:`, error);
      if (attempt === retryCount - 1) {
        console.error('所有重试都失败了，最后的错误:', error);
        return null;
      }
      // 失败后等待一段时间再重试，时间随重试次数增加
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  return null;
}

/**
 * 生成多个AI名字的异步生成器函数
 * @param options 名字生成配置选项
 * @yields 生成的名字数据
 */
export async function* generateAIName(options: NameGeneratorOptions): AsyncGenerator<NameData | null, void, unknown> {
  const totalNames = 10; // 要生成的总名字数量
  const failedAttempts: number[] = []; // 记录失败的尝试
  let successCount = 0; // 成功生成的名字计数
  const generatedNames: string[] = []; // 已生成的名字列表
  
  let attemptCount = 0;
  while (successCount < totalNames && attemptCount < totalNames * 2) { // 添加最大尝试次数限制
    attemptCount++;
    try {
      console.log(`开始生成第 ${successCount + 1} 个名字 (尝试次数: ${attemptCount})`);
      const nameData = await generateSingleName(options, generatedNames);
      
      if (nameData) {
        successCount++;
        generatedNames.push(nameData.formal);
        console.log(`成功生成第 ${successCount} 个名字:`, nameData);
        yield nameData;
      } else {
        failedAttempts.push(successCount + 1);
        console.log(`第 ${successCount + 1} 个名字生成失败，将继续尝试`);
        
        // 如果直接失败，添加短暂延迟后继续
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      // 成功生成后添加延迟避免API限制
      const delay = 500 + (failedAttempts.length * 200);
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      console.error(`生成第 ${successCount + 1} 个名字时发生错误:`, error);
      failedAttempts.push(successCount + 1);
      // 不再yield null，而是继续尝试
      await new Promise(resolve => setTimeout(resolve, 1000));
      continue;
    }
  }

  // 输出生成结果统计
  console.log(`名字生成完成，成功: ${successCount}，总尝试次数: ${attemptCount}`);
  console.log(`生成的所有名字: ${generatedNames.join(', ')}`);
  if (failedAttempts.length > 0) {
    console.warn(`失败的尝试序号：${failedAttempts.join(', ')}`);
  }
}