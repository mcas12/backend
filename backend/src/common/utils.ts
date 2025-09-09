/**
 * 计算两个字符串之间的 Levenshtein 距离。
 * Levenshtein 距离是指将一个字符串转换为另一个字符串所需的最少单字符编辑（插入、删除或替换）次数。
 *
 * @param str1 第一个字符串
 * @param str2 第二个字符串
 * @returns 两个字符串之间的 Levenshtein 距离
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length

  // 创建一个 (m+1) x (n+1) 的矩阵来存储距离
  // dp[i][j] 将表示 str1 的前 i 个字符与 str2 的前 j 个字符之间的距离
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  // 初始化第一行和第一列
  // 将空字符串转换为长度为 j 的字符串需要 j 次插入
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j
  }
  // 将长度为 i 的字符串转换为空字符串需要 i 次删除
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i
  }

  // 填充矩阵的其余部分
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // 如果 str1[i-1] 和 str2[j-1] 相同，则替换成本为 0，否则为 1
      // 注意：字符串索引是 0-based，所以我们用 i-1 和 j-1
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1

      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // 删除 str1 中的字符
        dp[i][j - 1] + 1, // 插入字符到 str1 (或从 str2 中删除)
        dp[i - 1][j - 1] + substitutionCost // 替换 (或匹配)
      )
    }
  }

  // 矩阵右下角的值即为 Levenshtein 距离
  return dp[m][n]
}

/**
 * 计算文本相似度
 * 使用Levenshtein距离算法，统一的相似度计算逻辑
 *
 * @param text1 第一个文本
 * @param text2 第二个文本
 * @returns 相似度值 (0-1之间，1表示完全相同)
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) {
    return 0
  }

  // 清理文本：去除多余空格和换行符
  const cleanText1 = text1.replace(/\s+/g, ' ').trim()
  const cleanText2 = text2.replace(/\s+/g, ' ').trim()

  if (cleanText1.length === 0 || cleanText2.length === 0) {
    return 0
  }

  // 使用较长的文本作为分母，确保相似度计算的一致性
  const maxLength = Math.max(cleanText1.length, cleanText2.length)
  const distance = levenshteinDistance(cleanText1, cleanText2)

  return 1 - distance / maxLength
}

/**
 * 清理和解析JSON响应
 * 处理可能包含markdown代码块的响应，统一的JSON解析逻辑
 *
 * @param content 原始响应内容
 * @returns 解析后的JSON对象
 */
export function parseJsonResponse(content: string): any {
  try {
    // 首先尝试直接解析
    return JSON.parse(content)
  } catch (error) {
    console.log('Direct JSON parse failed, trying to clean content...')

    // 清理可能的markdown代码块标记
    let cleanedContent = content.trim()

    // 移除开头的 ```json 或 ```
    cleanedContent = cleanedContent.replace(/^```(?:json)?\s*\n?/i, '')

    // 移除结尾的 ```
    cleanedContent = cleanedContent.replace(/\n?\s*```\s*$/i, '')

    // 移除可能的其他markdown标记
    cleanedContent = cleanedContent.replace(/^#+\s*.*\n/gm, '') // 移除标题
    cleanedContent = cleanedContent.replace(/^\*\*.*\*\*\s*\n/gm, '') // 移除粗体文本

    // 尝试找到JSON数组的开始和结束
    const jsonStart = cleanedContent.indexOf('[')
    const jsonEnd = cleanedContent.lastIndexOf(']')

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedContent = cleanedContent.substring(jsonStart, jsonEnd + 1)
    }

    console.log(
      'Cleaned content preview:',
      cleanedContent.substring(0, 200) + '...'
    )

    try {
      return JSON.parse(cleanedContent)
    } catch (secondError) {
      console.error('Failed to parse cleaned content:', secondError)
      console.error('Original content:', content.substring(0, 500) + '...')
      console.error(
        'Cleaned content:',
        cleanedContent.substring(0, 500) + '...'
      )
      throw new Error(`Failed to parse JSON response: ${secondError.message}`)
    }
  }
}
