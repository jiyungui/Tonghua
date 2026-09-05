// 高清无损极简浅灰 INS 矢量默认图（标准 Base64 编码，确保所有浏览器 100% 完美解析且绝不破坏 HTML 结构）
const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340"><rect width="100%" height="100%" fill="#E3E4E3"/><circle cx="300" cy="170" r="36" fill="#D2D3D2"/><path d="M282 170h36M300 152v36" stroke="#BBBCBB" stroke-width="2.5" stroke-linecap="round"/></svg>`;
const squareSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="#E3E4E3"/><rect x="95" y="95" width="110" height="110" rx="18" fill="#D2D3D2"/><circle cx="150" cy="150" r="22" fill="#BBBCBB"/></svg>`;
const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="100%" height="100%" fill="#DBDEDB"/><circle cx="60" cy="46" r="20" fill="#C5C8C5"/><path d="M26 104c0-18.77 15.23-34 34-34s34 15.23 34 34" fill="#C5C8C5"/></svg>`;

export const DEFAULT_GRAY_IMAGES = {
  banner: `data:image/svg+xml;base64,${btoa(bannerSvg)}`,
  square: `data:image/svg+xml;base64,${btoa(squareSvg)}`,
  avatar: `data:image/svg+xml;base64,${btoa(avatarSvg)}`
};

// 预设诗意文案语录库
export const RANDOM_QUOTES = [
  "跟我一起看星星吧，一起聊哪里是北极星，哪里是你的星座，哪里是你的曾经。【片刻须臾就好】",
  "风吹过林梢，把所有的喧嚣都过滤成诗篇。愿你在平和的日光里，拾得片刻宁静。",
  "如果生活是一场漫游，那就把每一个平淡的黄昏，都收集成独一无二的纪念。",
  "在白昼与黑夜的交界处，万物都在安眠，唯有思绪随月光悄然蔓延。",
  "日子被微风吹拂，缓慢而温柔地向前流淌，一切都是最恰当的模样。"
];
