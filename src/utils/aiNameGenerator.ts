interface NameGeneratorOptions {
  gender: 'male' | 'female'
  surname: string
  nameLength: number
  style: string
  birthYear?: number
  fatherName?: string
  motherName?: string
  preferredElements?: string[]
  desiredProfession?: string
  generation?: string
  mbti?: string
}

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

interface AIResponse {
  names: NameData[];
}

// 添加一个用于检查名字相似度的函数
function isSimilarName(name1: string, name2: string): boolean {
  // 移除姓氏后再比较
  const getName = (fullName: string) => {
    // 假设第一个字是姓氏
    return fullName.slice(1);
  };
  
  const firstName = getName(name1);
  const secondName = getName(name2);
  
  // 如果名字完全相同
  if (firstName === secondName) return true;
  
  // 如果名字中有相同的字（只比较名字部分，不比较姓氏）
  const chars1 = firstName.split('');
  const chars2 = secondName.split('');
  
  // 对于单字名，只有完全相同才算重复
  if (chars1.length === 1 && chars2.length === 1) {
    return firstName === secondName;
  }
  
  // 对于双字名，有相同的字才算重复
  const commonChars = chars1.filter(char => chars2.includes(char));
  return commonChars.length > 0;
}

async function generateSingleName(
  options: NameGeneratorOptions, 
  existingNames: string[] = [],
  retryCount = 3
): Promise<NameData | null> {
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
  
  const prompt = `请根据以下详细信息生成一个独特的中文名字：

个人基本信息：
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
2. 名字长度必须是${nameLength === 1 ? '一个字' : '两个字'}
${generation ? `3. 必须包含指定的字辈"${generation}"` : ''}
4. 必须符合${gender === 'male' ? '男孩' : '女孩'}的特点
5. 需要考虑出生年份${birthYear || new Date().getFullYear()}的时代特点
${Array.isArray(preferredElements) && preferredElements.length > 0 ? 
  `6. 优先使用五行属性为 ${preferredElements.join('、')} 的字` : ''}
${desiredProfession ? 
  `7. 名字寓意要与期望职业 ${desiredProfession} 相呼应` : ''}
${mbti ? 
  `8. 名字要体现 ${mbti} 性格特点：
    - INTJ: 独立理性、战略思维
    - INTP: 创新思考、逻辑分析
    - ENTJ: 领导魅力、果断决策
    - ENTP: 创意无限、思维活跃
    - INFJ: 洞察人心、理想主义
    - INFP: 理想主义、重视内在
    - ENFJ: 感召力强、关怀他人
    - ENFP: 热情活力、创意无限
    - ISTJ: 务实可靠、条理分明
    - ISFJ: 温暖细心、尽职尽责
    - ESTJ: 执行力强、组织管理
    - ESFJ: 友善热心、乐于助人
    - ISTP: 灵活务实、善于解决问题
    - ISFP: 艺术审美、随和自然
    - ESTP: 冒险精神、随机应变
    - ESFP: 活力四射、享受生活` : ''}
9. 整体风格要体现"${style || '文雅大方'}"的特点
10. 避免生僻字或难读的字
11. 字形要优美
12. 名字要朗朗上口
${fatherName || motherName ? 
  '13. 可以适当参考父母名字中优美的用字' : ''}
${existingNames.length > 0 ?
  `14. 请勿使用以下名字或包含这些名字中的字：${existingNames.join('、')}` : ''}

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

  for (let attempt = 0; attempt < retryCount; attempt++) {
    try {
      console.log(`尝试生成名字，第 ${attempt + 1} 次尝试`);
      
      const response = await fetch(`${import.meta.env.VITE_OPENAI_BASE_URL}chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
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

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}, 响应内容: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      const content = data.choices[0]?.message?.content || '';
      console.log('解析后的内容:', content);
      
      try {
        const cleanContent = content
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        console.log('清理后的内容:', cleanContent);
        
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
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  return null;
}

export async function* generateAIName(options: NameGeneratorOptions): AsyncGenerator<NameData | null, void, unknown> {
  const totalNames = 20;
  const failedAttempts: number[] = [];
  let successCount = 0;
  const generatedNames: string[] = [];
  
  for (let i = 0; i < totalNames; i++) {
    try {
      console.log(`开始生成第 ${i + 1} 个名字`);
      const nameData = await generateSingleName(options, generatedNames);
      
      if (nameData) {
        // 检查是否与已生成的名字重复或相似
        const isDuplicate = generatedNames.some(existingName => 
          isSimilarName(nameData.formal, existingName)
        );

        if (!isDuplicate) {
          successCount++;
          generatedNames.push(nameData.formal);
          console.log(`成功生成第 ${i + 1} 个名字:`, nameData);
          yield nameData;
        } else {
          console.log(`生成的名字 ${nameData.formal} 与已有名字重复，尝试重新生成`);
          i--; // 重试当前索引
          continue;
        }
      } else {
        failedAttempts.push(i + 1);
        console.log(`第 ${i + 1} 个名字生成失败，尝试重试`);
        
        const retryNameData = await generateSingleName(options, generatedNames, 5);
        if (retryNameData && !generatedNames.some(existingName => 
          isSimilarName(retryNameData.formal, existingName)
        )) {
          successCount++;
          generatedNames.push(retryNameData.formal);
          console.log(`重试成功生成第 ${i + 1} 个名字:`, retryNameData);
          yield retryNameData;
        } else {
          console.error(`第 ${i + 1} 个名字重试也失败了`);
        }
      }
      
      const delay = 500 + (failedAttempts.length * 200);
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      console.error(`生成第 ${i + 1} 个名字时发生错误:`, error);
      failedAttempts.push(i + 1);
      yield null;
    }
  }

  console.log(`名字生成完成，成功: ${successCount}，失败: ${failedAttempts.length}`);
  console.log(`生成的所有名字: ${generatedNames.join(', ')}`);
  if (failedAttempts.length > 0) {
    console.warn(`失败的序号：${failedAttempts.join(', ')}`);
  }
}