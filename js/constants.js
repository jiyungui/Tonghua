// 统一默认轻奢灰白占位图（SVG Data URI，轻量极简不依赖外链）
export const DEFAULT_PLACEHOLDER_IMG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23EAEAEC"/><circle cx="200" cy="150" r="40" fill="%23D8D8DC"/><path d="M190 140 L210 140 M200 130 L200 150 M185 165 L215 165" stroke="%23B0B2B8" stroke-width="2" stroke-linecap="round"/></svg>`;

export const DEFAULT_AVATAR_IMG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="%23E2E2E6"/><circle cx="60" cy="48" r="22" fill="%23D0D0D6"/><path d="M28 100 C28 78, 92 78, 92 100" fill="%23D0D0D6"/></svg>`;

// 优雅文艺语录库（随机文案）
export const INS_QUOTES = [
  "跟我一起看星星吧，一起聊哪里是北极星，哪里是你的星座，哪里是你的曾经【片刻须臾就好】",
  "在所有的告别里，我最喜欢明天见。",
  "收集每一个温柔的瞬间，拼凑成生活的诗意与远方。",
  "日光倾斜的午后，微风掠过琴弦，留下时光的轻声低语。",
  "世间所有的浪漫，都是为了唤醒心中那份平静的炽热。",
  "保持纯粹与热爱，奔赴下一场山海与花期。",
  "有些故事不需赘述，藏在每一次指尖的触碰与微风里。",
  "在黑白灰的底色里，感知万物生长的安宁。"
];

export function getRandomQuote() {
  return INS_QUOTES[Math.floor(Math.random() * INS_QUOTES.length)];
}
