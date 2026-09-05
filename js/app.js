// 祁祁phone 主逻辑启动入口
import { storage } from './storage.js';
import { P1Widget } from './widget-p1.js';
import { P2Widget } from './widget-p2.js';
import { P3Widget } from './widget-p3.js';
import { AppsModule } from './apps.js';
import { EditModal } from './modal.js';
import { ViewportController } from './viewport.js';

class App {
  constructor() {
    this.modal = null;
    this.viewport = null;
  }

  async init() {
    // 1. 初始化视口与多页滑动
    const track = document.getElementById('pages-track');
    const dots = document.querySelectorAll('.indicator-dot');
    this.viewport = new ViewportController({ track, dots });

    // 点击小圆点切页
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.viewport.goToPage(index));
    });

    // 2. 初始化弹窗管理器
    this.modal = new EditModal({
      onSave: async (type, data, files) => {
        if (type === 'p1') {
          await P1Widget.saveData(data, files.p1_bg, files.p1_avatar);
          await this.renderP1();
        } else if (type === 'p2') {
          await P2Widget.saveData(data, files.p2_img);
          await this.renderP2();
        } else if (type === 'p3') {
          await P3Widget.saveData(data, files.p3_top, files.p3_avatar);
          await this.renderP3();
        }
      }
    });

    // 3. 渲染小组件与应用
    await this.renderP1();
    await this.renderP2();
    await this.renderP3();
    this.renderApps();

    // 4. 注册 PWA Service Worker (若支持)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => {
          console.log('SW registration skipped:', err);
        });
      });
    }
  }

  async renderP1() {
    const container = document.getElementById('slot-widget-p1');
    if (!container) return;
    await P1Widget.render(container, async (type) => {
      const data = await P1Widget.getData();
      this.modal.open(type, data);
    });
  }

  async renderP2() {
    const container = document.getElementById('slot-widget-p2');
    if (!container) return;
    await P2Widget.render(container, async (type) => {
      const data = await P2Widget.getData();
      this.modal.open(type, data);
    });
  }

  async renderP3() {
    const container = document.getElementById('slot-widget-p3');
    if (!container) return;
    await P3Widget.render(container, async (type) => {
      const data = await P3Widget.getData();
      this.modal.open(type, data);
    });
  }

  renderApps() {
    const appsContainer = document.getElementById('slot-apps-page1');
    if (appsContainer) {
      AppsModule.renderPage1Apps(appsContainer);
    }

    const dockContainer = document.getElementById('slot-dock-apps');
    if (dockContainer) {
      AppsModule.renderDock(dockContainer);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
