// P3 小组件逻辑控制器（生活记录与日期胶囊）
import { storage } from './storage.js';

export const P3Widget = {
  defaultData: {
    monthText: 'October',
    titleText: 'My little life.',
    dateText: '27/10/2025',
    kaomojiText: '( ੭;ω;)੭ ✦ .o ✧°',
    topImage: '图片/IMG_6065等22项文件/9.jpg',
    avatarImage: '图片/IMG_6065等22项文件/7.jpg'
  },

  async render(container, onEditClick) {
    const data = await this.getData();
    const topImgUrl = await storage.getImageURL('p3_top_image') || data.topImage;
    const avatarUrl = await storage.getImageURL('p3_avatar_image') || data.avatarImage;

    container.innerHTML = `
      <div class="widget-p3-card" id="widget-p3-inner">
        <button class="widget-edit-btn" title="编辑P3小组件" id="p3-edit-trigger">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>

        <!-- 上部分图片与标语 -->
        <div class="p3-top-photo-wrapper">
          <img src="${topImgUrl}" alt="Life Photo" class="p3-top-img" id="p3-display-top-img">
          <div class="p3-photo-overlay-text">
            <span class="p3-overlay-month">${data.monthText}</span>
            <span class="p3-overlay-title">${data.titleText}</span>
          </div>
        </div>

        <!-- 紧凑日历星期条 -->
        <div class="p3-calendar-strip">
          <div class="p3-calendar-col current"><span class="p3-cal-day">一</span><span class="p3-cal-num">27</span></div>
          <div class="p3-calendar-col"><span class="p3-cal-day">二</span><span class="p3-cal-num">28</span></div>
          <div class="p3-calendar-col"><span class="p3-cal-day">三</span><span class="p3-cal-num">29</span></div>
          <div class="p3-calendar-col"><span class="p3-cal-day">四</span><span class="p3-cal-num">30</span></div>
          <div class="p3-calendar-col"><span class="p3-cal-day">五</span><span class="p3-cal-num">31</span></div>
          <div class="p3-calendar-col"><span class="p3-cal-day">六</span><span class="p3-cal-num">01</span></div>
          <div class="p3-calendar-col"><span class="p3-cal-day">日</span><span class="p3-cal-num">02</span></div>
        </div>

        <!-- 胶囊生活状态条 -->
        <div class="p3-capsule-bar">
          <div class="p3-capsule-left">
            <div class="p3-avatar-circle">
              <img src="${avatarUrl}" alt="Cute Toy" class="p3-avatar-img" id="p3-display-avatar-img">
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

    container.querySelector('#p3-edit-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      onEditClick('p3');
    });
  },

  async getData() {
    const saved = await storage.get('p3_data');
    return saved ? { ...this.defaultData, ...saved } : this.defaultData;
  },

  async saveData(newData, topImgFile, avatarFile) {
    await storage.set('p3_data', newData);
    if (topImgFile) {
      await storage.saveImageBlob('p3_top_image', topImgFile);
    }
    if (avatarFile) {
      await storage.saveImageBlob('p3_avatar_image', avatarFile);
    }
  }
};
