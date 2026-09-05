// 祁祁phone「美化 APP」核心控制器 (全功能六大板块 · 壁纸全参数调节 + 独立壁纸库系统)
import { storage } from './storage.js';

export class BeautifyApp {
  constructor() {
    this.container = null;
    this.isOpen = false;
    this.currentSubPage = null; // 'wallpaper' | 'icon' | 'screen' | 'widget' | 'font' | 'data'

    // 当前活跃的壁纸参数
    this.wallpaperParams = {
      id: 'default',
      name: '纯净白灰',
      type: 'color', // 'color' | 'image'
      src: '#F1F2F1', // 颜色值或图片 Blob/URL
      blur: 0,        // 模糊 0 ~ 30px
      glass: 0,       // 毛玻璃 0 ~ 20px
      opacity: 100,   // 不透明度 0 ~ 100%
      mode: 'cover',  // 'cover'(铺满全屏) | 'center'(居中原始) | 'custom'(自定义拉条缩放/偏移)
      scale: 100,     // 缩放 50% ~ 200%
      posX: 50,       // 水平位置 0% ~ 100%
      posY: 50        // 垂直位置 0% ~ 100%
    };

    // 壁纸库列表
    this.wallpaperGallery = [];

    // 全局美化其他配置
    this.config = {
      iconRadius: 18,
      iconScale: 100,
      iconLabelHide: false,
      screenGrayscale: 0,
      screenBorderRadius: 0,
      widgetRadius: 22,
      fontFamily: 'System'
    };

    this.init();
  }

  async init() {
    await this.loadAllData();
    this.applyGlobalStyles();
    this.render();
    this.bindEvents();
  }

  async loadAllData() {
    try {
      // 1. 读取壁纸当前状态与壁纸库
      const savedWallpaper = await storage.get('beautify_active_wallpaper');
      if (savedWallpaper) {
        this.wallpaperParams = { ...this.wallpaperParams, ...savedWallpaper };
      }

      const savedGallery = await storage.get('beautify_wallpaper_gallery');
      if (savedGallery && Array.isArray(savedGallery)) {
        this.wallpaperGallery = savedGallery;
      } else {
        // 初始预设
        this.wallpaperGallery = [
          {
            id: 'preset_1',
            name: '极简浅灰',
            type: 'color',
            src: '#F1F2F1',
            blur: 0,
            glass: 0,
            opacity: 100,
            mode: 'cover',
            scale: 100,
            posX: 50,
            posY: 50
          },
          {
            id: 'preset_2',
            name: '冷雾微阶',
            type: 'color',
            src: '#E5E6E5',
            blur: 0,
            glass: 0,
            opacity: 100,
            mode: 'cover',
            scale: 100,
            posX: 50,
            posY: 50
          },
          {
            id: 'preset_3',
            name: '炭黑高级灰',
            type: 'color',
            src: '#2C2C2E',
            blur: 0,
            glass: 0,
            opacity: 100,
            mode: 'cover',
            scale: 100,
            posX: 50,
            posY: 50
          }
        ];
      }

      // 2. 读取其他配置
      const savedConfig = await storage.get('beautify_config');
      if (savedConfig) {
        this.config = { ...this.config, ...savedConfig };
      }
    } catch (e) {
      console.warn('Load beautify data fallback', e);
    }
  }

  async saveAllData() {
    try {
      await storage.set('beautify_active_wallpaper', this.wallpaperParams);
      await storage.set('beautify_wallpaper_gallery', this.wallpaperGallery);
      await storage.set('beautify_config', this.config);
      this.applyGlobalStyles();
    } catch (e) {
      console.error('Save beautify error', e);
    }
  }

  // 渲染并应用全局壁纸与样式
  applyGlobalStyles() {
    const root = document.documentElement;
    const bgImgEl = document.getElementById('wallpaper-bg-img');
    const glassOverlay = document.getElementById('wallpaper-glass-overlay');
    const phoneScreen = document.getElementById('phone-screen');

    // 1. 应用当前动态壁纸
    if (bgImgEl && glassOverlay) {
      const p = this.wallpaperParams;
      if (p.type === 'color') {
        bgImgEl.style.backgroundImage = 'none';
        bgImgEl.style.backgroundColor = p.src;
        bgImgEl.style.filter = 'none';
        bgImgEl.style.transform = 'none';
        bgImgEl.style.opacity = '1';
        glassOverlay.style.backdropFilter = 'none';
        glassOverlay.style.webkitBackdropFilter = 'none';
        glassOverlay.style.backgroundColor = 'transparent';
      } else {
        // 图片壁纸
        bgImgEl.style.backgroundColor = 'transparent';
        bgImgEl.style.backgroundImage = `url("${p.src}")`;
        bgImgEl.style.opacity = `${p.opacity / 100}`;
        bgImgEl.style.filter = `blur(${p.blur}px)`;

        if (p.mode === 'cover') {
          bgImgEl.style.backgroundSize = 'cover';
          bgImgEl.style.backgroundPosition = 'center';
          bgImgEl.style.transform = 'none';
        } else if (p.mode === 'center') {
          bgImgEl.style.backgroundSize = 'contain';
          bgImgEl.style.backgroundPosition = 'center';
          bgImgEl.style.transform = 'none';
        } else {
          // 自定义拉条
          bgImgEl.style.backgroundSize = 'cover';
          bgImgEl.style.backgroundPosition = `${p.posX}% ${p.posY}%`;
          bgImgEl.style.transform = `scale(${p.scale / 100})`;
        }

        // 毛玻璃
        if (p.glass > 0) {
          glassOverlay.style.backdropFilter = `blur(${p.glass}px)`;
          glassOverlay.style.webkitBackdropFilter = `blur(${p.glass}px)`;
          glassOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        } else {
          glassOverlay.style.backdropFilter = 'none';
          glassOverlay.style.webkitBackdropFilter = 'none';
          glassOverlay.style.backgroundColor = 'transparent';
        }
      }
    }

    // 2. 图标与圆角
    root.style.setProperty('--radius-app', `${this.config.iconRadius}px`);
    const appIcons = document.querySelectorAll('.app-icon');
    appIcons.forEach(icon => {
      icon.style.transform = `scale(${this.config.iconScale / 100})`;
    });

    const appLabels = document.querySelectorAll('.app-label, .app-name');
    appLabels.forEach(label => {
      label.style.display = this.config.iconLabelHide ? 'none' : 'block';
    });

    // 3. 屏幕色彩
    if (phoneScreen) {
      phoneScreen.style.filter = `grayscale(${this.config.screenGrayscale}%)`;
    }

    // 4. 小组件
    root.style.setProperty('--radius-widget', `${this.config.widgetRadius}px`);

    // 5. 字体
    if (this.config.fontFamily === 'CatFont') {
      document.body.style.fontFamily = "'CatFont', sans-serif";
    } else if (this.config.fontFamily === 'DiaryFont') {
      document.body.style.fontFamily = "'DiaryFont', sans-serif";
    } else {
      document.body.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";
    }

    // 同步刷新小预览框
    this.updateMiniPreview();
  }

  // 刷新壁纸调整板块内的屏幕小预览
  updateMiniPreview() {
    const miniWallpaper = document.getElementById('mini-phone-wallpaper');
    const miniGlass = document.getElementById('mini-phone-glass');
    if (!miniWallpaper || !miniGlass) return;

    const p = this.wallpaperParams;
    if (p.type === 'color') {
      miniWallpaper.style.backgroundImage = 'none';
      miniWallpaper.style.backgroundColor = p.src;
      miniWallpaper.style.filter = 'none';
      miniWallpaper.style.transform = 'none';
      miniWallpaper.style.opacity = '1';
      miniGlass.style.backdropFilter = 'none';
      miniGlass.style.webkitBackdropFilter = 'none';
    } else {
      miniWallpaper.style.backgroundColor = 'transparent';
      miniWallpaper.style.backgroundImage = `url("${p.src}")`;
      miniWallpaper.style.opacity = `${p.opacity / 100}`;
      miniWallpaper.style.filter = `blur(${p.blur / 2}px)`;

      if (p.mode === 'cover') {
        miniWallpaper.style.backgroundSize = 'cover';
        miniWallpaper.style.backgroundPosition = 'center';
        miniWallpaper.style.transform = 'none';
      } else if (p.mode === 'center') {
        miniWallpaper.style.backgroundSize = 'contain';
        miniWallpaper.style.backgroundPosition = 'center';
        miniWallpaper.style.transform = 'none';
      } else {
        miniWallpaper.style.backgroundSize = 'cover';
        miniWallpaper.style.backgroundPosition = `${p.posX}% ${p.posY}%`;
        miniWallpaper.style.transform = `scale(${p.scale / 100})`;
      }

      if (p.glass > 0) {
        miniGlass.style.backdropFilter = `blur(${p.glass / 2}px)`;
        miniGlass.style.webkitBackdropFilter = `blur(${p.glass / 2}px)`;
        miniGlass.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
      } else {
        miniGlass.style.backdropFilter = 'none';
        miniGlass.style.webkitBackdropFilter = 'none';
        miniGlass.style.backgroundColor = 'transparent';
      }
    }
  }

  render() {
    this.container = document.getElementById('beautify-app-view');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'beautify-app-view';
      this.container.className = 'beautify-app-view';
      document.body.appendChild(this.container);
    }

    this.container.innerHTML = `
      <!-- 顶部导航栏 -->
      <div class="beautify-header">
        <button class="beautify-nav-btn" id="beautify-nav-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          <span id="beautify-nav-text">退出</span>
        </button>
        <div class="beautify-nav-title" id="beautify-title">BEAUTIFY</div>
        <div class="beautify-header-right">
          <button class="beautify-reset-btn" id="beautify-reset-all">RESET</button>
        </div>
      </div>

      <!-- 多级板块滑轨视图栈 -->
      <div class="beautify-view-stack">

        <!-- ================= 1. 一级菜单：六大悬浮胶囊项目 ================= -->
        <div class="beautify-menu-pane" id="beautify-main-menu">
          
          <div class="beautify-hero-card">
            <div class="beautify-hero-title">AESTHETIC STUDIO</div>
            <div class="beautify-hero-desc">个性化桌面美学与系统视觉配置</div>
          </div>

          <!-- 胶囊 1: 壁纸调整 -->
          <div class="beautify-capsule-item" data-sub="wallpaper">
            <div class="capsule-left">
              <div class="capsule-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </div>
              <div class="capsule-info">
                <div class="capsule-title">壁纸调整</div>
                <div class="capsule-subtitle">WALLPAPER & THEME</div>
              </div>
            </div>
            <div class="capsule-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </div>

          <!-- 胶囊 2: 图标调整 -->
          <div class="beautify-capsule-item" data-sub="icon">
            <div class="capsule-left">
              <div class="capsule-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>
              </div>
              <div class="capsule-info">
                <div class="capsule-title">图标调整</div>
                <div class="capsule-subtitle">APP ICONS & LABELS</div>
              </div>
            </div>
            <div class="capsule-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </div>

          <!-- 胶囊 3: 屏幕调整 -->
          <div class="beautify-capsule-item" data-sub="screen">
            <div class="capsule-left">
              <div class="capsule-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
              </div>
              <div class="capsule-info">
                <div class="capsule-title">屏幕调整</div>
                <div class="capsule-subtitle">DISPLAY & FILTER</div>
              </div>
            </div>
            <div class="capsule-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </div>

          <!-- 胶囊 4: 小组件调整 -->
          <div class="beautify-capsule-item" data-sub="widget">
            <div class="capsule-left">
              <div class="capsule-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="10" rx="2"/><rect x="3" y="15" width="8" height="6" rx="2"/><rect x="13" y="15" width="8" height="6" rx="2"/></svg>
              </div>
              <div class="capsule-info">
                <div class="capsule-title">小组件调整</div>
                <div class="capsule-subtitle">WIDGETS & BORDER</div>
              </div>
            </div>
            <div class="capsule-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </div>

          <!-- 胶囊 5: 字体调整 -->
          <div class="beautify-capsule-item" data-sub="font">
            <div class="capsule-left">
              <div class="capsule-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
              </div>
              <div class="capsule-info">
                <div class="capsule-title">字体调整</div>
                <div class="capsule-subtitle">FONTS & TYPOGRAPHY</div>
              </div>
            </div>
            <div class="capsule-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </div>

          <!-- 胶囊 6: 美化数据设置 -->
          <div class="beautify-capsule-item" data-sub="data">
            <div class="capsule-left">
              <div class="capsule-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
              </div>
              <div class="capsule-info">
                <div class="capsule-title">美化数据设置</div>
                <div class="capsule-subtitle">BACKUP & RESTORE</div>
              </div>
            </div>
            <div class="capsule-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </div>

        </div>

        <!-- ================= 2. 二级板块：壁纸调整 (全功能高级版) ================= -->
        <div class="beautify-sub-pane" id="sub-wallpaper">
          
          <!-- 1. 屏幕实时小预览框 -->
          <div class="wallpaper-preview-wrapper">
            <div class="wallpaper-mini-phone">
              <div class="mini-phone-notch"></div>
              <div class="mini-phone-screen">
                <div class="mini-phone-wallpaper" id="mini-phone-wallpaper"></div>
                <div class="mini-phone-glass" id="mini-phone-glass"></div>
              </div>
              <!-- 拟态悬浮小组件与图标 -->
              <div class="mini-phone-content">
                <div class="mini-dummy-widget"></div>
                <div class="mini-dummy-grid">
                  <div class="mini-dummy-icon"></div>
                  <div class="mini-dummy-icon"></div>
                  <div class="mini-dummy-icon"></div>
                  <div class="mini-dummy-icon"></div>
                </div>
                <div class="mini-dummy-dock">
                  <div class="mini-dummy-dock-icon"></div>
                  <div class="mini-dummy-dock-icon"></div>
                  <div class="mini-dummy-dock-icon"></div>
                  <div class="mini-dummy-dock-icon"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 上传与导入通道 (相册 / URL) -->
          <div class="sub-panel-card">
            <div class="sub-panel-title">更换壁纸源</div>
            
            <div class="wallpaper-input-tabs">
              <button class="wallpaper-tab-btn active" data-tab="album">相册文件</button>
              <button class="wallpaper-tab-btn" data-tab="url">网络 URL</button>
            </div>

            <!-- Tab 1: 本地相册无损上传 -->
            <div class="wallpaper-tab-content active" id="tab-content-album">
              <div class="upload-capsule-btn" id="upload-wallpaper-file-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2C2C2E" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <div class="upload-capsule-text">从手机相册选择壁纸</div>
                <div class="upload-capsule-sub">IndexedDB 无损原图直存 · 实时生效</div>
                <input type="file" id="wp-file-input" accept="image/*" style="display:none;">
              </div>
            </div>

            <!-- Tab 2: 网络 URL 导入 -->
            <div class="wallpaper-tab-content" id="tab-content-url">
              <div class="wallpaper-url-box">
                <input type="text" class="wallpaper-url-input" id="wp-url-input" placeholder="粘贴图片 HTTPS 链接...">
                <button class="wallpaper-url-btn" id="wp-url-btn">导入</button>
              </div>
            </div>
          </div>

          <!-- 3. 壁纸精细微调参数 -->
          <div class="sub-panel-card">
            <div class="sub-panel-title">壁纸微调与特效</div>

            <!-- 模式选择 (铺满 / 居中 / 自定义) -->
            <div class="sub-setting-row" style="flex-direction: column; align-items: flex-start; gap: 8px;">
              <div class="setting-name">排版模式</div>
              <div class="mode-segmented">
                <button class="mode-btn ${this.wallpaperParams.mode === 'cover' ? 'active' : ''}" data-mode="cover">铺满全屏</button>
                <button class="mode-btn ${this.wallpaperParams.mode === 'center' ? 'active' : ''}" data-mode="center">居中原始</button>
                <button class="mode-btn ${this.wallpaperParams.mode === 'custom' ? 'active' : ''}" data-mode="custom">自定义拉条</button>
              </div>
            </div>

            <!-- 模糊度 -->
            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">背景模糊</div>
                <div class="setting-desc" id="val-wp-blur">${this.wallpaperParams.blur}px</div>
              </div>
              <input type="range" class="beautify-range" id="range-wp-blur" min="0" max="30" value="${this.wallpaperParams.blur}">
            </div>

            <!-- 毛玻璃 -->
            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">拟态毛玻璃</div>
                <div class="setting-desc" id="val-wp-glass">${this.wallpaperParams.glass}px</div>
              </div>
              <input type="range" class="beautify-range" id="range-wp-glass" min="0" max="25" value="${this.wallpaperParams.glass}">
            </div>

            <!-- 不透明度 -->
            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">不透明度</div>
                <div class="setting-desc" id="val-wp-opacity">${this.wallpaperParams.opacity}%</div>
              </div>
              <input type="range" class="beautify-range" id="range-wp-opacity" min="20" max="100" value="${this.wallpaperParams.opacity}">
            </div>

            <!-- 自定义拉条微调区 (自定义模式下激活) -->
            <div id="wp-custom-sliders" style="display: ${this.wallpaperParams.mode === 'custom' ? 'flex' : 'none'}; flex-direction: column; gap: 14px; border-top: 1px dashed #E5E6E5; padding-top: 12px;">
              <!-- 缩放 -->
              <div class="sub-setting-row">
                <div class="setting-label">
                  <div class="setting-name">壁纸大小缩放</div>
                  <div class="setting-desc" id="val-wp-scale">${this.wallpaperParams.scale}%</div>
                </div>
                <input type="range" class="beautify-range" id="range-wp-scale" min="50" max="200" value="${this.wallpaperParams.scale}">
              </div>

              <!-- 水平左右 -->
              <div class="sub-setting-row">
                <div class="setting-label">
                  <div class="setting-name">水平左右位置</div>
                  <div class="setting-desc" id="val-wp-posx">${this.wallpaperParams.posX}%</div>
                </div>
                <input type="range" class="beautify-range" id="range-wp-posx" min="0" max="100" value="${this.wallpaperParams.posX}">
              </div>

              <!-- 垂直上下 -->
              <div class="sub-setting-row">
                <div class="setting-label">
                  <div class="setting-name">垂直上下位置</div>
                  <div class="setting-desc" id="val-wp-posy">${this.wallpaperParams.posY}%</div>
                </div>
                <input type="range" class="beautify-range" id="range-wp-posy" min="0" max="100" value="${this.wallpaperParams.posY}">
              </div>
            </div>

            <!-- 保存壁纸及所有参数至壁纸库 -->
            <button class="action-capsule-btn primary" id="btn-save-to-gallery" style="margin-top: 8px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <span>保存参数并收录至壁纸库</span>
            </button>
          </div>

          <!-- 4. 壁纸库板块 (保存/历史记录) -->
          <div class="sub-panel-card">
            <div class="sub-panel-title">壁纸库 (WALLPAPER GALLERY)</div>
            <div class="setting-desc">点击即可一键应用，并完整还原其保存时的所有模糊、缩放与毛玻璃数值：</div>
            
            <div class="gallery-grid" id="wallpaper-gallery-container">
              ${this.renderGalleryItems()}
            </div>
          </div>

        </div>

        <!-- ================= 3. 二级板块：图标调整 ================= -->
        <div class="beautify-sub-pane" id="sub-icon">
          <div class="sub-panel-card">
            <div class="sub-panel-title">APP 图标形态</div>
            
            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">圆角弧度</div>
                <div class="setting-desc" id="icon-radius-val">${this.config.iconRadius}px</div>
              </div>
              <input type="range" class="beautify-range" id="range-icon-radius" min="8" max="28" value="${this.config.iconRadius}">
            </div>

            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">图标尺寸缩放</div>
                <div class="setting-desc" id="icon-scale-val">${this.config.iconScale}%</div>
              </div>
              <input type="range" class="beautify-range" id="range-icon-scale" min="85" max="115" value="${this.config.iconScale}">
            </div>

            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">隐藏图标文字</div>
                <div class="setting-desc">极简纯图标视觉</div>
              </div>
              <div class="beautify-segment">
                <button class="beautify-segment-btn ${!this.config.iconLabelHide ? 'active' : ''}" data-hide-label="false">显示</button>
                <button class="beautify-segment-btn ${this.config.iconLabelHide ? 'active' : ''}" data-hide-label="true">隐藏</button>
              </div>
            </div>

          </div>
        </div>

        <!-- ================= 4. 二级板块：屏幕调整 ================= -->
        <div class="beautify-sub-pane" id="sub-screen">
          <div class="sub-panel-card">
            <div class="sub-panel-title">显示风格与质感</div>
            
            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">黑白灰滤镜灰阶</div>
                <div class="setting-desc" id="screen-gray-val">${this.config.screenGrayscale}%</div>
              </div>
              <input type="range" class="beautify-range" id="range-screen-gray" min="0" max="100" value="${this.config.screenGrayscale}">
            </div>

            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">拟态光影增强</div>
                <div class="setting-desc">细腻柔和白灰阴影</div>
              </div>
              <div class="beautify-segment">
                <button class="beautify-segment-btn active">开启</button>
                <button class="beautify-segment-btn">极简</button>
              </div>
            </div>

          </div>
        </div>

        <!-- ================= 5. 二级板块：小组件调整 ================= -->
        <div class="beautify-sub-pane" id="sub-widget">
          <div class="sub-panel-card">
            <div class="sub-panel-title">组件卡片圆角</div>

            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">小组件圆角</div>
                <div class="setting-desc" id="widget-radius-val">${this.config.widgetRadius}px</div>
              </div>
              <input type="range" class="beautify-range" id="range-widget-radius" min="12" max="32" value="${this.config.widgetRadius}">
            </div>

            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">卡片纯白度</div>
                <div class="setting-desc">高透拟态 / 纯白卡片</div>
              </div>
              <div class="beautify-segment">
                <button class="beautify-segment-btn active">纯白 INS</button>
                <button class="beautify-segment-btn">轻雾灰</button>
              </div>
            </div>

          </div>
        </div>

        <!-- ================= 6. 二级板块：字体调整 ================= -->
        <div class="beautify-sub-pane" id="sub-font">
          <div class="sub-panel-card">
            <div class="sub-panel-title">字体类型切换</div>

            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">系统极简无衬线</div>
                <div class="setting-desc">SF Pro / Helvetica 风格</div>
              </div>
              <button class="beautify-segment-btn ${this.config.fontFamily === 'System' ? 'active' : ''}" data-font="System">应用</button>
            </div>

            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">一只心呆的小猫</div>
                <div class="setting-desc">纯黑无彩色萌系字体</div>
              </div>
              <button class="beautify-segment-btn ${this.config.fontFamily === 'CatFont' ? 'active' : ''}" data-font="CatFont">应用</button>
            </div>

            <div class="sub-setting-row">
              <div class="setting-label">
                <div class="setting-name">日記的第一頁</div>
                <div class="setting-desc">手写日记温润质感</div>
              </div>
              <button class="beautify-segment-btn ${this.config.fontFamily === 'DiaryFont' ? 'active' : ''}" data-font="DiaryFont">应用</button>
            </div>

          </div>
        </div>

        <!-- ================= 7. 二级板块：美化数据设置 ================= -->
        <div class="beautify-sub-pane" id="sub-data">
          <div class="sub-panel-card">
            <div class="sub-panel-title">数据备份与导出</div>
            <div class="setting-desc" style="line-height: 1.5; margin-bottom: 8px;">
              将当前手机所有小组件配置、个性化文案及壁纸美化参数打包为 JSON 数据文件。
            </div>
            <button class="action-capsule-btn primary" id="btn-export-data">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              导出整套配置备份
            </button>
          </div>

          <div class="sub-panel-card">
            <div class="sub-panel-title">数据恢复与导入</div>
            <div class="setting-desc" style="line-height: 1.5; margin-bottom: 8px;">
              从外部 JSON 备份文件一键还原整套手机美化与小组件数据。
            </div>
            <button class="action-capsule-btn secondary" id="btn-import-trigger">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              选择备份文件导入
            </button>
            <input type="file" id="data-import-input" accept=".json" style="display:none;">
          </div>
        </div>

      </div>
    `;
  }

  // 渲染壁纸库列表 HTML
  renderGalleryItems() {
    if (!this.wallpaperGallery.length) {
      return '<div class="gallery-empty">壁纸库暂无收录，上传保存后在此呈现</div>';
    }

    return this.wallpaperGallery.map(item => {
      const isCurrent = this.wallpaperParams.id === item.id;
      const bgStyle = item.type === 'color' 
        ? `background-color: ${item.src};` 
        : `background-image: url('${item.src}'); background-size: cover; background-position: center;`;

      return `
        <div class="gallery-item ${isCurrent ? 'active' : ''}" data-gallery-id="${item.id}">
          <div class="gallery-thumb" style="${bgStyle}"></div>
          <button class="gallery-delete-btn" data-delete-id="${item.id}" title="删除此壁纸">×</button>
        </div>
      `;
    }).join('');
  }

  bindEvents() {
    // 1. 顶部返回/退出
    const navBackBtn = this.container.querySelector('#beautify-nav-back');
    navBackBtn.addEventListener('click', () => {
      if (this.currentSubPage) {
        this.switchSubPage(null);
      } else {
        this.close();
      }
    });

    // 2. 六大胶囊点击切换子板块
    const capsules = this.container.querySelectorAll('.beautify-capsule-item');
    capsules.forEach(item => {
      item.addEventListener('click', () => {
        const subId = item.dataset.sub;
        this.switchSubPage(subId);
      });
    });

    // 3. 全局 RESET
    const resetAllBtn = this.container.querySelector('#beautify-reset-all');
    resetAllBtn.addEventListener('click', async () => {
      if (confirm('确认恢复默认 INS 纯净白灰美化配置吗？')) {
        this.wallpaperParams = {
          id: 'preset_1',
          name: '纯净白灰',
          type: 'color',
          src: '#F1F2F1',
          blur: 0,
          glass: 0,
          opacity: 100,
          mode: 'cover',
          scale: 100,
          posX: 50,
          posY: 50
        };
        this.config = {
          iconRadius: 18,
          iconScale: 100,
          iconLabelHide: false,
          screenGrayscale: 0,
          screenBorderRadius: 0,
          widgetRadius: 22,
          fontFamily: 'System'
        };
        await this.saveAllData();
        this.render();
        this.bindEvents();
      }
    });

    // ================= 壁纸专属交互 =================
    // Tab 切换 (相册 / URL)
    const wpTabs = this.container.querySelectorAll('.wallpaper-tab-btn');
    const tabAlbum = this.container.querySelector('#tab-content-album');
    const tabUrl = this.container.querySelector('#tab-content-url');

    wpTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        wpTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        if (tab === 'album') {
          tabAlbum.classList.add('active');
          tabUrl.classList.remove('active');
        } else {
          tabUrl.classList.add('active');
          tabAlbum.classList.remove('active');
        }
      });
    });

    // 本地相册上传
    const uploadBtn = this.container.querySelector('#upload-wallpaper-file-btn');
    const fileInput = this.container.querySelector('#wp-file-input');
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          const wpKey = `wp_blob_${Date.now()}`;
          await storage.saveImageResource(wpKey, file);
          const url = await storage.getImageURL(wpKey);

          this.wallpaperParams.id = `user_${Date.now()}`;
          this.wallpaperParams.type = 'image';
          this.wallpaperParams.src = url;
          this.wallpaperParams.storageKey = wpKey; // 记录 IndexedDB 键
          this.applyGlobalStyles();
        }
      });
    }

    // 网络 URL 导入
    const wpUrlBtn = this.container.querySelector('#wp-url-btn');
    const wpUrlInput = this.container.querySelector('#wp-url-input');
    if (wpUrlBtn && wpUrlInput) {
      wpUrlBtn.addEventListener('click', () => {
        const val = wpUrlInput.value.trim();
        if (val) {
          this.wallpaperParams.id = `url_${Date.now()}`;
          this.wallpaperParams.type = 'image';
          this.wallpaperParams.src = val;
          this.applyGlobalStyles();
        }
      });
    }

    // 模式切换 (铺满 / 居中 / 自定义)
    const modeBtns = this.container.querySelectorAll('.mode-btn');
    const customSliders = this.container.querySelector('#wp-custom-sliders');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const m = btn.dataset.mode;
        this.wallpaperParams.mode = m;
        if (customSliders) {
          customSliders.style.display = m === 'custom' ? 'flex' : 'none';
        }
        this.applyGlobalStyles();
      });
    });

    // 模糊度
    const rBlur = this.container.querySelector('#range-wp-blur');
    const vBlur = this.container.querySelector('#val-wp-blur');
    if (rBlur) {
      rBlur.addEventListener('input', (e) => {
        this.wallpaperParams.blur = Number(e.target.value);
        vBlur.innerText = `${this.wallpaperParams.blur}px`;
        this.applyGlobalStyles();
      });
    }

    // 毛玻璃
    const rGlass = this.container.querySelector('#range-wp-glass');
    const vGlass = this.container.querySelector('#val-wp-glass');
    if (rGlass) {
      rGlass.addEventListener('input', (e) => {
        this.wallpaperParams.glass = Number(e.target.value);
        vGlass.innerText = `${this.wallpaperParams.glass}px`;
        this.applyGlobalStyles();
      });
    }

    // 不透明度
    const rOpacity = this.container.querySelector('#range-wp-opacity');
    const vOpacity = this.container.querySelector('#val-wp-opacity');
    if (rOpacity) {
      rOpacity.addEventListener('input', (e) => {
        this.wallpaperParams.opacity = Number(e.target.value);
        vOpacity.innerText = `${this.wallpaperParams.opacity}%`;
        this.applyGlobalStyles();
      });
    }

    // 自定义缩放
    const rScale = this.container.querySelector('#range-wp-scale');
    const vScale = this.container.querySelector('#val-wp-scale');
    if (rScale) {
      rScale.addEventListener('input', (e) => {
        this.wallpaperParams.scale = Number(e.target.value);
        vScale.innerText = `${this.wallpaperParams.scale}%`;
        this.applyGlobalStyles();
      });
    }

    // 水平左右
    const rPosX = this.container.querySelector('#range-wp-posx');
    const vPosX = this.container.querySelector('#val-wp-posx');
    if (rPosX) {
      rPosX.addEventListener('input', (e) => {
        this.wallpaperParams.posX = Number(e.target.value);
        vPosX.innerText = `${this.wallpaperParams.posX}%`;
        this.applyGlobalStyles();
      });
    }

    // 垂直上下
    const rPosY = this.container.querySelector('#range-wp-posy');
    const vPosY = this.container.querySelector('#val-wp-posy');
    if (rPosY) {
      rPosY.addEventListener('input', (e) => {
        this.wallpaperParams.posY = Number(e.target.value);
        vPosY.innerText = `${this.wallpaperParams.posY}%`;
        this.applyGlobalStyles();
      });
    }

    // 保存至壁纸库按钮
    const btnSaveGallery = this.container.querySelector('#btn-save-to-gallery');
    if (btnSaveGallery) {
      btnSaveGallery.addEventListener('click', async () => {
        const itemToSave = { ...this.wallpaperParams };
        
        // 查找是否已存在同 ID，没有则添加，有则更新
        const existingIdx = this.wallpaperGallery.findIndex(g => g.id === itemToSave.id);
        if (existingIdx >= 0) {
          this.wallpaperGallery[existingIdx] = itemToSave;
        } else {
          this.wallpaperGallery.unshift(itemToSave);
        }

        await this.saveAllData();
        
        // 局部刷新壁纸库网格
        const galleryBox = this.container.querySelector('#wallpaper-gallery-container');
        if (galleryBox) {
          galleryBox.innerHTML = this.renderGalleryItems();
          this.bindGalleryEvents();
        }
      });
    }

    this.bindGalleryEvents();

    // ================= 其他各板块交互 =================
    // 图标圆角与缩放
    const rIconRad = this.container.querySelector('#range-icon-radius');
    const vIconRad = this.container.querySelector('#icon-radius-val');
    if (rIconRad) {
      rIconRad.addEventListener('input', (e) => {
        this.config.iconRadius = Number(e.target.value);
        vIconRad.innerText = `${this.config.iconRadius}px`;
        this.saveAllData();
      });
    }

    const rIconScale = this.container.querySelector('#range-icon-scale');
    const vIconScale = this.container.querySelector('#icon-scale-val');
    if (rIconScale) {
      rIconScale.addEventListener('input', (e) => {
        this.config.iconScale = Number(e.target.value);
        vIconScale.innerText = `${this.config.iconScale}%`;
        this.saveAllData();
      });
    }

    // 隐藏文字
    const labelBtns = this.container.querySelectorAll('[data-hide-label]');
    labelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        labelBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.config.iconLabelHide = btn.dataset.hideLabel === 'true';
        this.saveAllData();
      });
    });

    // 屏幕灰度
    const rScreenGray = this.container.querySelector('#range-screen-gray');
    const vScreenGray = this.container.querySelector('#screen-gray-val');
    if (rScreenGray) {
      rScreenGray.addEventListener('input', (e) => {
        this.config.screenGrayscale = Number(e.target.value);
        vScreenGray.innerText = `${this.config.screenGrayscale}%`;
        this.saveAllData();
      });
    }

    // 小组件圆角
    const rWidgetRad = this.container.querySelector('#range-widget-radius');
    const vWidgetRad = this.container.querySelector('#widget-radius-val');
    if (rWidgetRad) {
      rWidgetRad.addEventListener('input', (e) => {
        this.config.widgetRadius = Number(e.target.value);
        vWidgetRad.innerText = `${this.config.widgetRadius}px`;
        this.saveAllData();
      });
    }

    // 字体
    const fontBtns = this.container.querySelectorAll('[data-font]');
    fontBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        fontBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.config.fontFamily = btn.dataset.font;
        this.saveAllData();
      });
    });

    // 数据备份与导入
    const exportBtn = this.container.querySelector('#btn-export-data');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        const fullBackup = {
          version: '2.0',
          timestamp: new Date().toISOString(),
          activeWallpaper: this.wallpaperParams,
          wallpaperGallery: this.wallpaperGallery,
          beautifyConfig: this.config,
          p1: await storage.get('widget_p1_data'),
          p2: await storage.get('widget_p2_data'),
          p2_page2: await storage.get('widget_p2_page2_data'),
          p3: await storage.get('widget_p3_data'),
          p4: await storage.get('widget_p4_data')
        };
        const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qiqiphone-full-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const importTrigger = this.container.querySelector('#btn-import-trigger');
    const importInput = this.container.querySelector('#data-import-input');
    if (importTrigger && importInput) {
      importTrigger.addEventListener('click', () => importInput.click());
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            try {
              const data = JSON.parse(event.target.result);
              if (data.activeWallpaper) this.wallpaperParams = data.activeWallpaper;
              if (data.wallpaperGallery) this.wallpaperGallery = data.wallpaperGallery;
              if (data.beautifyConfig) this.config = data.beautifyConfig;
              await this.saveAllData();
              if (data.p1) await storage.set('widget_p1_data', data.p1);
              if (data.p2) await storage.set('widget_p2_data', data.p2);
              if (data.p2_page2) await storage.set('widget_p2_page2_data', data.p2_page2);
              if (data.p3) await storage.set('widget_p3_data', data.p3);
              if (data.p4) await storage.set('widget_p4_data', data.p4);
              alert('数据备份已全部恢复！');
              window.location.reload();
            } catch (err) {
              alert('导入失败，请选择有效的备份 JSON 文件。');
            }
          };
          reader.readAsText(file);
        }
      });
    }
  }

  // 绑定壁纸库内卡片的点击选择与删除
  bindGalleryEvents() {
    const galleryItems = this.container.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      item.addEventListener('click', async (e) => {
        if (e.target.closest('.gallery-delete-btn')) return; // 拦截删除
        const id = item.dataset.galleryId;
        const targetWp = this.wallpaperGallery.find(g => g.id === id);
        if (targetWp) {
          this.wallpaperParams = { ...targetWp };
          
          // 如果是本地 Blob，重新解析有效 URL
          if (this.wallpaperParams.storageKey) {
            const validUrl = await storage.getImageURL(this.wallpaperParams.storageKey);
            if (validUrl) this.wallpaperParams.src = validUrl;
          }

          await this.saveAllData();
          this.applyGlobalStyles();
          this.render();
          this.bindEvents();
          this.switchSubPage('wallpaper');
        }
      });
    });

    const deleteBtns = this.container.querySelectorAll('.gallery-delete-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const delId = btn.dataset.deleteId;
        if (confirm('确认从壁纸库中移除此壁纸吗？')) {
          this.wallpaperGallery = this.wallpaperGallery.filter(g => g.id !== delId);
          await this.saveAllData();
          const galleryBox = this.container.querySelector('#wallpaper-gallery-container');
          if (galleryBox) {
            galleryBox.innerHTML = this.renderGalleryItems();
            this.bindGalleryEvents();
          }
        }
      });
    });
  }

  // 切换子页面
  switchSubPage(subId) {
    const mainMenu = this.container.querySelector('#beautify-main-menu');
    const subPanes = this.container.querySelectorAll('.beautify-sub-pane');
    const navText = this.container.querySelector('#beautify-nav-text');
    const navTitle = this.container.querySelector('#beautify-title');

    this.currentSubPage = subId;

    if (subId) {
      mainMenu.classList.add('slide-left');
      subPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `sub-${subId}`) {
          pane.classList.add('active');
        }
      });
      navText.innerText = '返回';
      
      const titles = {
        wallpaper: 'WALLPAPER',
        icon: 'ICON STYLE',
        screen: 'SCREEN',
        widget: 'WIDGETS',
        font: 'TYPOGRAPHY',
        data: 'DATA'
      };
      navTitle.innerText = titles[subId] || 'SETTINGS';

      if (subId === 'wallpaper') {
        this.updateMiniPreview();
      }
    } else {
      mainMenu.classList.remove('slide-left');
      subPanes.forEach(pane => pane.classList.remove('active'));
      navText.innerText = '退出';
      navTitle.innerText = 'BEAUTIFY';
    }
  }

  open() {
    this.isOpen = true;
    this.switchSubPage(null);
    this.container.classList.add('active');
  }

  close() {
    this.isOpen = false;
    this.container.classList.remove('active');
  }
}
