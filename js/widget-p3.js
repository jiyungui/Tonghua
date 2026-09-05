// P3 小组件逻辑控制器
import { storage } from './storage.js';
import { DEFAULT_GRAY_IMAGES, POETIC_QUOTES, getRandomItem } from './quotes.js';

export const P3Widget = {
  getDefaultData() {
    const months = ['October', 'November', 'December', 'January', 'February', 'March', 'April', 'May'];
    return {
      monthText: getRandomItem(months),
      titleText: getRandomItem(POETIC_QUOTES.p3LifeTitles),
      dateText: '27/10/2025',
      kaomojiText: getRandomItem(POETIC_QUOTES.p3Kaomojis)
    };
  },

  async render(container, onEditClick) {
    const data = await this.getData();
    const topImgUrl = await storage.getImageURL('p3_top') || DEFAULT_GRAY_IMAGES.banner;
    const avatarUrl = await storage.getImageURL('p3_avatar') || DEFAULT_GRAY_IMAGES.avatar;

    container.innerHTML = `
      <div class="widget-p3-card" id="widget-p3-inner">
        <button class="widget-edit-btn" title="编辑P3小组件" id="p3-edit-trigger">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>

        <div class="p3-top-photo-wrapper">
          <img src="${topImgUrl}" alt="Life Photo" class="p3-top-img" id="p3-display-top-img">
          <div class="p3-photo-overlay-text">
            <span class="p3-overlay-month">${data.monthText}</span>
            <span class="p3-overlay-title">${data.titleText}</span>
          </div>
        </div>

        <div class="p3-calendar-strip">
          <div class="p3-calendar-col current"><span class="p3-cal-day">一</span><span class="p3-cal-num">27</span></div>
          <div class="p3-calendar-col"><span class="p3-cal-day">二</span><span class="p3-cal-num">28</span></div>
          <div class="p3-calendar-col"><span class="p3-cal-day">三</span><span class="p3-cal-num">29</span></div>
          <div class="p3-calendar-col"><span class="p3-cal-day">四</span><span class="p3-cal-num">30</span></div>
          <div class="p3-calendar-col"><span class="p3-cal-day">五</span><span class="p3-cal-num">31</span></div>
          <div class="p3-calendar-col"><span class="p3-cal-day">六</span><span class="p3-cal-num">01</span></div>
          <div class="p3-calendar-col"><span class="p3-cal-day">日</span><span class="p3-cal-num">02</span></div>
        </div>

        <div class="p3-capsule-bar">
          <div class="p3-capsule-left">
            <div class="p3-avatar-circle">
              <img src="${avatarUrl}" alt="Avatar" class="p3-avatar-img" id="p3-display-avatar-img">
            </div>
            <div class="p3-capsule-info">
              <span class="p3-capsule-date">${data.dateText}</span>
              <span class="p3-capsule-kaomoji">${data.kaomojiText}</span>
            </div>
          </div>
          <div class="p3-more-dots">
            <div class="p3-dot"></div>
            <div class="p3-dot"></div>
            <div class="p3-dot"></div>
          </div>
        </div>
      </div>
    `;

    const cardEl = container.querySelector('#widget-p3-inner');
    cardEl.addEventListener('click', () => {
      onEditClick('p3');
    });
  },

  async getData() {
    try {
      const saved = await storage.get('p3_data');
      if (saved && typeof saved === 'object') return saved;
      const defaults = this.getDefaultData();
      await storage.set('p3_data', defaults);
      return defaults;
    } catch (e) {
      return this.getDefaultData();
    }
  },

  async saveData(newData, imageResources) {
    await storage.set('p3_data', newData);
    if (imageResources) {
      if (imageResources.p3_top) await storage.saveImageResource('p3_top', imageResources.p3_top);
      if (imageResources.p3_avatar) await storage.saveImageResource('p3_avatar', imageResources.p3_avatar);
    }
  }
};
