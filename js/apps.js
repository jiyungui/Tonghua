// 应用与 Dock 栏图标组件模块（严格杜绝Emoji，纯高级INS几何线条与文字排版）

export const AppsModule = {
  // 第一页 8 个 APP (4列 x 2行): chat-记忆世界-相册-日记-世界书-老福特-闲鱼-美团
  page1Apps: [
    {
      id: 'chat',
      name: 'chat',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      `
    },
    {
      id: 'memory',
      name: '记忆世界',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <circle cx="12" cy="12" r="9"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      `
    },
    {
      id: 'photos',
      name: '相册',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <rect x="3" y="3" width="18" height="18" rx="4" ry="4"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      `
    },
    {
      id: 'diary',
      name: '日记',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <line x1="9" y1="7" x2="15" y2="7"/>
          <line x1="9" y1="11" x2="15" y2="11"/>
        </svg>
      `
    },
    {
      id: 'world-book',
      name: '世界书',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
      `
    },
    {
      id: 'lofter',
      name: '老福特',
      iconSvg: `
        <span style="font-family: Georgia, serif; font-size: 20px; font-weight: 800; color: #1D1D1F; letter-spacing: -1px;">L</span>
      `
    },
    {
      id: 'xianyu',
      name: '闲鱼',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <path d="M6.5 12c.5-3 2.5-6 6.5-6 3.5 0 5.5 2.5 5.5 5.5s-2 5.5-5.5 5.5c-4 0-6-3-6.5-5z"/>
          <circle cx="14.5" cy="10.5" r="1.5" fill="#1D1D1F"/>
          <path d="M4 8l2.5 4L4 16"/>
        </svg>
      `
    },
    {
      id: 'meituan',
      name: '美团',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <path d="M3 8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2a8 8 0 0 1-8 8H9a6 6 0 0 1-6-6V8z"/>
          <circle cx="12" cy="11" r="3"/>
        </svg>
      `
    }
  ],

  // 第二页 4 个 APP: 视频、恋人之家、你懂得、查手机
  page2Apps: [
    {
      id: 'video',
      name: '视频',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      `
    },
    {
      id: 'lovers-home',
      name: '恋人之家',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <path d="M12 11.5l-1.2-1.1C9.6 9.3 9 8.7 9 8c0-.8.6-1.5 1.5-1.5.5 0 1 .3 1.5.8.5-.5 1-.8 1.5-.8.9 0 1.5.7 1.5 1.5 0 .7-.6 1.3-1.8 2.4L12 11.5z"/>
        </svg>
      `
    },
    {
      id: 'secret-app',
      name: '你懂得',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      `
    },
    {
      id: 'check-phone',
      name: '查手机',
      iconSvg: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <rect x="5" y="2" width="14" height="20" rx="3" ry="3"/>
          <circle cx="12" cy="11" r="3"/>
          <line x1="14" y1="13" x2="17" y2="16"/>
        </svg>
      `
    }
  ],

  // 底部 Dock 栏 4 个应用：设置-美化-短信-频道
  dockApps: [
    {
      id: 'settings',
      name: '设置',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      `
    },
    {
      id: 'theme',
      name: '美化',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      `
    },
    {
      id: 'messages',
      name: '短信',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      `
    },
    {
      id: 'channels',
      name: '频道',
      iconSvg: `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="1.8">
          <line x1="4" y1="9" x2="20" y2="9"/>
          <line x1="4" y1="15" x2="20" y2="15"/>
          <line x1="10" y1="3" x2="8" y2="21"/>
          <line x1="16" y1="3" x2="14" y2="21"/>
        </svg>
      `
    }
  ],

  renderPage1Apps(container) {
    container.innerHTML = this.page1Apps.map(app => `
      <div class="app-item" data-id="${app.id}">
        <div class="app-icon-wrapper">
          ${app.iconSvg}
        </div>
        <div class="app-name">${app.name}</div>
      </div>
    `).join('');
  },

  renderPage2Apps(container) {
    container.innerHTML = this.page2Apps.map(app => `
      <div class="app-item" data-id="${app.id}">
        <div class="app-icon-wrapper">
          ${app.iconSvg}
        </div>
        <div class="app-name">${app.name}</div>
      </div>
    `).join('');
  },

  renderDock(container) {
    container.innerHTML = this.dockApps.map(app => `
      <div class="dock-item" data-id="${app.id}">
        <div class="dock-icon-wrapper">
          ${app.iconSvg}
        </div>
        <div class="dock-name">${app.name}</div>
      </div>
    `).join('');
  }
};
