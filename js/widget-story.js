// 第二页 Story Mode 故事小组件控制器
import { storage } from './storage.js';
import { DEFAULT_PLACEHOLDER_IMG, DEFAULT_AVATAR_IMG, getRandomQuote, INS_QUOTES } from './constants.js';

export const StoryWidget = {
  defaultData: {
    userName: '测试员',
    userStatus: 'If onli I were in your eye...',
    quoteText: getRandomQuote(),
    dateText: '2026年06月13日',
    timeText: '08:58',
    avatarImg: DEFAULT_AVATAR_IMG,
    photo1: DEFAULT_PLACEHOLDER_IMG,
    photo2: DEFAULT_PLACEHOLDER_IMG,
    photo3: DEFAULT_PLACEHOLDER_IMG
  },

  async render(container, onEditClick) {
    const data = await this.getData();
    const avatarUrl = await storage.getImageURL('story_avatar') || data.avatarImg || DEFAULT_AVATAR_IMG;
    const photo1Url = await storage.getImageURL('story_photo_1') || data.photo1 || DEFAULT_PLACEHOLDER_IMG;
    const photo2Url = await storage.getImageURL('story_photo_2') || data.photo2 || DEFAULT_PLACEHOLDER_IMG;
    const photo3Url = await storage.getImageURL('story_photo_3') || data.photo3 || DEFAULT_PLACEHOLDER_IMG;

    container.innerHTML = `
      <div class="widget-story-card" id="widget-story-inner">
        <button class="widget-edit-btn" title="编辑Story小组件" id="story-edit-trigger">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>

        <!-- 顶部 Story 标签栏 -->
        <div class="story-header">
          <div class="story-pill-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            <span>STORY</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; font-weight:700; font-size:12px; color:#1D1D1F;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#1D1D1F"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span>Story Mode</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#1D1D1F"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
        </div>

        <!-- 用户名 / 状态 -->
        <div class="story-user-row">
          <div class="story-user-left">
            <div class="story-avatar-box">
              <img src="${avatarUrl}" alt="Avatar" class="story-avatar-img">
            </div>
            <div class="story-user-meta">
              <span class="story-user-name">${data.userName}</span>
              <span class="story-user-status">${data.userStatus}</span>
            </div>
          </div>
          <div class="story-user-right">
            <svg class="story-heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <svg class="story-heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <svg class="story-heart-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span class="story-rank-num">#1</span>
          </div>
        </div>

        <!-- 4张照片展示区 -->
        <div class="story-photos-grid">
          <div class="story-photo-item"><img src="${photo1Url}" alt="Photo 1" class="story-photo-img"></div>
          <div class="story-photo-item"><img src="${photo2Url}" alt="Photo 2" class="story-photo-img"></div>
          <div class="story-photo-item"><img src="${photo3Url}" alt="Photo 3" class="story-photo-img"></div>
          <div class="story-photo-item story-photo-add-slot" id="story-add-slot">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A0A0A5" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
        </div>

        <!-- 故事名言 / 黑色底部时间栏 -->
        <div class="story-quote-box">
          <div class="story-quote-content" id="story-display-quote">${data.quoteText}</div>
          <div class="story-quote-footer">
            <div class="story-date-info">
              <span>${data.dateText}</span>
              <span>${data.timeText}</span>
            </div>
            <div class="story-footer-icons">
              <div class="story-stars-row">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="#FFF"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="#FFF"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="#FFF"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </div>
          </div>
        </div>

        <!-- 底部胶囊刷新文案按键 -->
        <div class="story-bottom-action-bar">
          <button class="story-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="2.5"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
          </button>
          <button class="story-reroll-btn" id="story-reroll-action">
            <span style="display:flex; align-items:center; gap:6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Latest Re-roll</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    `;

    // 绑定编辑点击事件
    container.querySelector('#story-edit-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      onEditClick('story');
    });

    // 绑定第四个槽位点击触发编辑
    container.querySelector('#story-add-slot').addEventListener('click', (e) => {
      e.stopPropagation();
      onEditClick('story');
    });

    // 绑定 Re-roll 随机切换文案
    container.querySelector('#story-reroll-action').addEventListener('click', async (e) => {
      e.stopPropagation();
      const newQuote = getRandomQuote();
      const current = await this.getData();
      current.quoteText = newQuote;
      await storage.set('story_data', current);
      const quoteEl = container.querySelector('#story-display-quote');
      if (quoteEl) {
        quoteEl.style.opacity = '0';
        setTimeout(() => {
          quoteEl.textContent = newQuote;
          quoteEl.style.opacity = '1';
        }, 150);
      }
    });
  },

  async getData() {
    const saved = await storage.get('story_data');
    return saved ? { ...this.defaultData, ...saved } : this.defaultData;
  },

  async saveData(newData, avatarFile, photo1File, photo2File, photo3File) {
    await storage.set('story_data', newData);
    if (avatarFile) await storage.saveImageBlob('story_avatar', avatarFile);
    if (photo1File) await storage.saveImageBlob('story_photo_1', photo1File);
    if (photo2File) await storage.saveImageBlob('story_photo_2', photo2File);
    if (photo3File) await storage.saveImageBlob('story_photo_3', photo3File);
  }
};
