/**
 * Standard 5512 Pedagogical Activities Helper
 * Supports dynamic activity list per resource with default 5512 fallback
 */

export const DEFAULT_5512_ACTIVITIES = [
  {
    id: 'default-1',
    title: '1. Hoạt động Khởi động (5 phút):',
    content: 'Cho học sinh quan sát ảnh hiện vật trên màn hình thông minh. Đặt câu hỏi: "Dựa vào hình dáng và hoa văn, em có suy nghĩ gì về đời sống tinh thần của cư dân thời kỳ này?"'
  },
  {
    id: 'default-2',
    title: '2. Hoạt động Khám phá & Bóc tách kiến thức:',
    content: 'Học sinh làm việc theo nhóm 4 người, truy cập mô hình 3D tương tác để đo đạc và phát hiện các chi tiết khảo cổ học tiêu biểu.'
  },
  {
    id: 'default-3',
    title: '3. Luyện tập & Vận dụng:',
    content: 'Hoàn thành các câu trắc nghiệm nhanh bên dưới để kiểm tra mức độ ghi nhớ và hiểu sâu về tư liệu.'
  }
];

/**
 * Parses resource.tip into a list of activities.
 * If tip is empty or invalid, falls back to DEFAULT_5512_ACTIVITIES.
 */
export function parseLearningActivities(tipValue) {
  if (!tipValue) return DEFAULT_5512_ACTIVITIES;

  if (Array.isArray(tipValue)) {
    if (tipValue.length === 0) return DEFAULT_5512_ACTIVITIES;
    return tipValue.map((item, idx) => ({
      id: item.id || `act-${idx}`,
      title: item.title || `Hoạt động ${idx + 1}:`,
      content: item.content || item.desc || (typeof item === 'string' ? item : '')
    }));
  }

  if (typeof tipValue === 'string') {
    const trimmed = tipValue.trim();
    if (!trimmed) return DEFAULT_5512_ACTIVITIES;

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          id: item.id || `act-${idx}`,
          title: item.title || `Hoạt động ${idx + 1}:`,
          content: item.content || item.desc || (typeof item === 'string' ? item : '')
        }));
      }
      if (typeof parsed === 'string' && parsed.trim()) {
        return [{
          id: 'act-0',
          title: 'Gợi ý sư phạm:',
          content: parsed.trim()
        }];
      }
    } catch {
      return [{
        id: 'act-0',
        title: 'Gợi ý sư phạm:',
        content: trimmed
      }];
    }
  }

  return DEFAULT_5512_ACTIVITIES;
}

/**
 * Formats resource.tip for compact card previews
 */
export function formatActivitiesForPreview(tipValue) {
  if (!tipValue) return '';
  if (typeof tipValue === 'string') {
    const trimmed = tipValue.trim();
    if (!trimmed) return '';
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = parsed[0];
        const title = first.title ? `${first.title} ` : '';
        return `${title}${first.content || ''}`.trim();
      }
      if (typeof parsed === 'string') return parsed.trim();
    } catch {
      return trimmed;
    }
  }
  return '';
}
