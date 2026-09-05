// 高清无损极简浅灰 INS 矢量默认图（标准 Base64 编码，确保所有浏览器 100% 完美解析且绝不破坏 HTML 结构）
const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340"><rect width="100%" height="100%" fill="#E3E4E3"/><circle cx="300" cy="170" r="36" fill="#D2D3D2"/><path d="M282 170h36M300 152v36" stroke="#BBBCBB" stroke-width="2.5" stroke-linecap="round"/></svg>`;
const squareSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="#E3E4E3"/><rect x="95" y="95" width="110" height="110" rx="18" fill="#D2D3D2"/><circle cx="150" cy="150" r="22" fill="#BBBCBB"/></svg>`;
const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="100%" height="100%" fill="#DBDEDB"/><circle cx="60" cy="46" r="20" fill="#C5C8C5"/><path d="M26 104c0-18.77 15.23-34 34-34s34 15.23 34 34" fill="#C5C8C5"/></svg>`;

export const DEFAULT_GRAY_IMAGES = {
  banner: `data:image/svg+xml;base64,${btoa(bannerSvg)}`,
  square: `data:image/svg+xml;base64,${btoa(squareSvg)}`,
  avatar: `data:image/svg+xml;base64,${btoa(avatarSvg)}`
};

// 预设诗意 INS 风语录库（严格杜绝 Emoji，纯粹高质感排版）
export const POETIC_QUOTES = {
  // P1 简介/Bio 预设文案池
  bios: [
    "风吹过林梢，把所有的喧嚣都过滤成诗篇。愿你在平和的日光里，拾得片刻宁静与自由。",
    "如果生活是一场漫游，那就把每一个平淡的黄昏，都收集成独一无二的纪念。",
    "在白昼与黑夜的交界处，万物都在安眠，唯有思绪随月光悄然蔓延。",
    "日子被微风吹拂，缓慢而温柔地向前流淌，一切都是最恰当的模样。",
    "宇宙浩瀚无垠，我们皆是偶然相遇的星尘。在光影流转中，静候内心的回响。",
    "万物皆有裂痕，那是光照进来的地方。保持纯粹，向着日光肆意生长。"
  ],
  // P1 气泡短句池
  bubbleTexts: [
    "Stay gentle and pure.",
    "Whispers in the quiet wind.",
    "It's very close to you.",
    "Collecting little moments.",
    "A secret in the twilight.",
    "Walking through soft daylight."
  ],
  // P2 搜索栏提示词
  searchPlaceholders: [
    "search silence...",
    "explore memories",
    "find peaceful thoughts",
    "search moonlight...",
    "wander into dream"
  ],
  // P2 短文案组
  p2Texts: [
    { line1: "serenity", line2: "soft breeze and quiet afternoon", line3: "plog .!′ diary fragment" },
    { line1: "daylight", line2: "gentle rhythm of a quiet day", line3: "record .!′ moment in life" },
    { line1: "moonlit", line2: "listening to the stars whispers", line3: "night .!′ deep thought" },
    { line1: "solitude", line2: "peace found in the quiet space", line3: "echo .!′ mind archive" },
    { line1: "warmth", line2: "drinking tea while time flows slow", line3: "scene .!′ poetic life" }
  ],
  // P3 诗意标题与心情
  p3LifeTitles: [
    "My little life.",
    "A peaceful afternoon.",
    "Glimpse of sunlight.",
    "Echo of quiet days.",
    "Fragments of time."
  ],
  p3Kaomojis: [
    "quiet mood * calm soul",
    "soft light * peaceful mind",
    "inner quiet * starry night",
    "slow life * morning breath",
    "serene thoughts * pure vibe"
  ],
  // P4 Story Mode 专属语录池
  storyQuotes: [
    "跟我一起看星星吧，一起聊哪里是北极星，哪里是你的星座，哪里是你的曾经。【片刻须臾就好】",
    "生活不需要波澜壮阔的誓言，只要在暮色四合时，有一扇窗为你留着温热的光。",
    "我们都在这庸常的世界里，寻找着属于自己的那一抹微光，不疾不徐，温柔坚定。",
    "山海皆有归期，风雨自有相逢。在每一个安稳的黎明，向过去的遗憾轻声道别。",
    "把所有的心事折叠进胶卷里，等光线穿透胶片，映出最深邃而真挚的画卷。"
  ],
  // P4 个性签名池
  mottos: [
    "If only I were in your eyes...",
    "Walking gently through the seasons.",
    "Writing poetry with silent footsteps.",
    "Living quietly in my own universe.",
    "Chasing shadows under soft moonlight."
  ]
};

// 辅助工具：随机获取数组元素
export function getRandomItem(arr) {
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

// 兼容导出
export const RANDOM_QUOTES = POETIC_QUOTES.storyQuotes;
