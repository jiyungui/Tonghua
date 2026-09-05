// 祁祁phone 主逻辑启动入口
import { storage } from './storage.js';
import { SplashScreen } from './splash.js';
import { P1Widget } from './widget-p1.js';
import { P2Widget } from './widget-p2.js';
import { P3Widget } from './widget-p3.js';
import { P4Widget } from './widget-p4.js';
import { AppsModule } from './apps.js';
import { EditModal } from './modal.js';
import { ViewportController } from './viewport.js';

class App {
  constructor() {
    this.modal = null;
    this.viewport = null;
  }

  async init() {
    // 0. 启动人机恋开屏进场动画
    const splash = new SplashScreen({
      duration: 2500
    });
    splash.init();

    // 1. 初始化视口与双页滑动
    const track = document.getElementById('pages-track');
    const dots = document.querySelectorAll('.indicator-dot');
    this.viewport = new ViewportController({ track, dots });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.viewport.goToPage(index));
    });

    // 2. 初始化编辑弹窗
    this.modal = new EditModal({
      onSave: async (type, data, imageResources) => {
        if (type === 'p1') {
          await P1Widget.saveData(data, imageResources);
          await this.renderP1();
        } else if (type === 'p2') {
          await P2Widget.saveData(data, imageResources, 'p2');
          await this.renderP2();
        } else if (type === 'p2_page2') {
          await P2Widget.saveData(data, imageResources, 'p2_page2');
          await this.renderP2Page2();
        } else if (type === 'p3') {
          await P3Widget.saveData(data, imageResources);
          await this.renderP3();
        } else if (type === 'p4') {
          await P4Widget.saveData(data, imageResources);
          await this.renderP4();
        }
      }
    });

    // 3. 渲染小组件与应用
    await this.renderP1();
    await this.renderP2();
    await this.renderP3();
    await this.renderP4();
    await this.renderP2Page2();
    this.renderApps();

    // 4. 注册 Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => {
          console.log('SW error:', err);
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
      const data = await P2Widget.getData('p2');
      this.modal.open(type, data);
    }, 'p2');
  }

  async renderP3() {
    const container = document.getElementById('slot-widget-p3');
    if (!container) return;
    await P3Widget.render(container, async (type) => {
      const data = await P3Widget.getData();
      this.modal.open(type, data);
    });
  }

  async renderP4() {
    const container = document.getElementById('slot-widget-p4');
    if (!container) return;
    await P4Widget.render(
      container,
      async (type) => {
        const data = await P4Widget.getData();
        this.modal.open(type, data);
      },
      async () => {
        await P4Widget.rerollQuote();
        await this.renderP4();
      }
    );
  }

  async renderP2Page2() {
    const container = document.getElementById('slot-widget-p2-page2');
    if (!container) return;
    await P2Widget.render(container, async (type) => {
      const data = await P2Widget.getData('p2_page2');
      this.modal.open('p2_page2', data);
    }, 'p2_page2');
  }

  renderApps() {
    const appsPage1 = document.getElementById('slot-apps-page1');
    if (appsPage1) AppsModule.renderPage1Apps(appsPage1);

    const appsPage2 = document.getElementById('slot-apps-page2');
    if (appsPage2) AppsModule.renderPage2Apps(appsPage2);

    const dock = document.getElementById('slot-dock-apps');
    if (dock) AppsModule.renderDock(dock);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
