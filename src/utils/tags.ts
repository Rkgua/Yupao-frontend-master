/**
 * 标签解析工具函数
 * 后端 tags 字段可能是 JSON 数组字符串或逗号分隔字符串
 */

/**
 * 将 tags 解析为字符串数组
 */
export function parseTags(tags: string | string[] | undefined | null): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // 不是 JSON 格式，尝试逗号分割
    }
    return tags.split(',').map((t: string) => t.trim()).filter(Boolean);
  }
  return [];
}

/**
 * 获取标签显示文本（前 maxCount 个）
 */
export function getDisplayTags(tags: string | string[] | undefined | null, maxCount: number = 3): string[] {
  return parseTags(tags).slice(0, maxCount);
}

/**
 * 获取标签总数
 */
export function getTagCount(tags: string | string[] | undefined | null): number {
  return parseTags(tags).length;
}
