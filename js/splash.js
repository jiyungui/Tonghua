// 祁祁phone 开屏进场动画控制器 (人机男女圆头火柴人 + 果冻QQ字母)

export class SplashScreen {
  constructor(options = {}) {
    this.duration = options.duration || 2600; // 默认展示时间 2.6秒
    this.onFinish = options.onFinish || null;
    this.container = null;
    this.timer = null;
    this.isClosed = false;
  }

  init() {
    this.container = document.getElementById('splash-screen');
    if (!this.container) {
      this.render();
    }
    this.bindEvents();
    this.startTimer();
  }

  render() {
    this.container = document.createElement('div');
    this.container.id = 'splash-screen';
    this.container.className = 'splash-screen';

    this.container.innerHTML = `
      <!-- 右上角跳过 -->
      <button class="splash-skip-btn" id="splash-skip">SKIP</button>

      <div class="splash-content">
        <!-- 动态新颖男女火柴人 SVG (人机恋) -->
        <div class="splash-stickman-box">
          <svg class="splash-stickman-svg" viewBox="0 0 260 210" fill="none" xmlns="http://www.w3.org/2000/svg">
            
            <!-- 1. 正中央心动扑通共鸣符号 (扑通心跳动画) -->
            <g class="anim-heart-beat">
              <path d="M130 80 c-4.5 -8 -13 -10 -18 -4.5 c-6.5 6.5 -1 15 18 27 c19 -12 24.5 -20.5 18 -27 c-5 -5.5 -13.5 -3.5 -18 4.5 z" fill="#2C2C2E"/>
            </g>

            <!-- 2. 男生人类火柴人 (左侧 · 圆头短发呆毛) -->
            <g class="anim-human-body">
              <!-- 帅气呆毛 (俏皮晃动) -->
              <path class="anim-human-hair" d="M88 92 Q82 78 74 81" stroke="#2C2C2E" stroke-width="4.5" stroke-linecap="round"/>
              <!-- 圆脑袋 -->
              <circle cx="88" cy="116" r="24" fill="#FFFFFF" stroke="#2C2C2E" stroke-width="4.8"/>
              <!-- 豆豆眼与微笑 -->
              <circle cx="80" cy="115" r="2.8" fill="#2C2C2E"/>
              <circle cx="96" cy="115" r="2.8" fill="#2C2C2E"/>
              <path d="M85 122 Q88 126 91 122" stroke="#2C2C2E" stroke-width="2.8" stroke-linecap="round"/>

              <!-- 躯干 -->
              <path d="M88 140 L92 180" stroke="#2C2C2E" stroke-width="5" stroke-linecap="round"/>
              <!-- 裤装双腿 -->
              <path d="M92 180 L76 205" stroke="#2C2C2E" stroke-width="4.5" stroke-linecap="round"/>
              <path d="M92 180 L102 205" stroke="#2C2C2E" stroke-width="4.5" stroke-linecap="round"/>
              <!-- 外侧手臂 -->
              <path d="M89 152 L70 174" stroke="#2C2C2E" stroke-width="4.2" stroke-linecap="round"/>
            </g>

            <!-- 3. 女生AI火柴人 (右侧 · 圆头双马尾 + 小天线 + 甜美裙摆) -->
            <g class="anim-robot-body">
              <!-- 头顶小天线与脉冲光波球 -->
              <path d="M172 92 L172 78" stroke="#2C2C2E" stroke-width="3.5" stroke-linecap="round"/>
              <circle class="anim-robot-signal" cx="172" cy="74" r="4.2" fill="#2C2C2E"/>

              <!-- 飘逸双马尾 (灵动飘动) -->
              <path class="anim-girl-hair-left" d="M150 112 Q136 122 140 134" stroke="#2C2C2E" stroke-width="3.6" stroke-linecap="round"/>
              <path class="anim-girl-hair-right" d="M194 112 Q208 122 204 134" stroke="#2C2C2E" stroke-width="3.6" stroke-linecap="round"/>

              <!-- 女孩圆脑袋 (与男生同为大圆头) -->
              <circle cx="172" cy="116" r="24" fill="#FFFFFF" stroke="#2C2C2E" stroke-width="4.8"/>
              <!-- 甜美眼眸与小嘴 -->
              <circle cx="164" cy="115" r="2.8" fill="#2C2C2E"/>
              <circle cx="180" cy="115" r="2.8" fill="#2C2C2E"/>
              <path d="M169 122 Q172 125 175 122" stroke="#2C2C2E" stroke-width="2.6" stroke-linecap="round"/>

              <!-- 甜美 A 字小短裙 -->
              <path d="M172 140 L162 170 L182 170 Z" fill="#2C2C2E" stroke="#2C2C2E" stroke-width="3" stroke-linejoin="round"/>

              <!-- 纤细机械腿 -->
              <path d="M167 170 L160 205" stroke="#2C2C2E" stroke-width="4.2" stroke-linecap="round"/>
              <path d="M177 170 L184 205" stroke="#2C2C2E" stroke-width="4.2" stroke-linecap="round"/>
              <!-- 外侧手臂 -->
              <path d="M174 152 L192 174" stroke="#2C2C2E" stroke-width="4.2" stroke-linecap="round"/>
            </g>

            <!-- 4. 人机两心相悦 · 牵手相连 (微晃动) -->
            <g class="anim-hand-shake">
              <path d="M89 152 Q130 168 171 152" fill="none" stroke="#2C2C2E" stroke-width="4.8" stroke-linecap="round"/>
              <!-- 牵手相扣小圆球 -->
              <circle cx="130" cy="160" r="4.5" fill="#FFFFFF" stroke="#2C2C2E" stroke-width="3.6"/>
            </g>
          </svg>
        </div>

        <!-- 下方两个 Q版 果冻 Q 弹字母 QQ -->
        <div class="splash-qq-container">
          <!-- 第一个 Q -->
          <div class="jelly-q-wrapper">
            <div class="jelly-q-letter jelly-q-1">
              <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <!-- 拟态圆润 Q 圈 -->
                <circle cx="40" cy="40" r="30" fill="#FFFFFF" stroke="#2C2C2E" stroke-width="8"/>
                <!-- Q 内部高光软糖点 -->
                <circle cx="30" cy="28" r="5" fill="#E8EAE8"/>
                <!-- Q 的可爱俏皮小尾巴 -->
                <path d="M46 48 C54 56, 66 68, 70 70 C72 71, 74 67, 72 63 C67 56, 56 46, 52 42" fill="#2C2C2E"/>
              </svg>
            </div>
            <div class="jelly-shadow jelly-shadow-1"></div>
          </div>

          <!-- 第二个 Q -->
          <div class="jelly-q-wrapper">
            <div class="jelly-q-letter jelly-q-2">
              <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <!-- 拟态圆润 Q 圈 -->
                <circle cx="40" cy="40" r="30" fill="#2C2C2E" stroke="#2C2C2E" stroke-width="8"/>
                <!-- 内部白色空心 (反白设计，形成黑白灰节奏) -->
                <circle cx="40" cy="40" r="16" fill="#F1F2F1"/>
                <!-- Q 的可爱俏皮小尾巴 -->
                <path d="M48 48 C56 56, 66 68, 70 70 C72 71, 74 67, 72 63 C67 56, 56 46, 52 42" fill="#2C2C2E"/>
                <!-- 尾巴末端白色微萌圆点 -->
                <circle cx="69" cy="67" r="2.5" fill="#FFFFFF"/>
              </svg>
            </div>
            <div class="jelly-shadow jelly-shadow-2"></div>
          </div>
        </div>

        <!-- 底部极简副标语 -->
        <div class="splash-footer-text">
          <div class="splash-title-en">QIQI PHONE</div>
          <div class="splash-subtitle">HUMAN · AI COMPANION</div>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);
  }

  bindEvents() {
    const skipBtn = this.container.querySelector('#splash-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.finish();
      });
    }

    // 点击屏幕任意处也可提前进入
    this.container.addEventListener('click', () => {
      this.finish();
    });
  }

  startTimer() {
    this.timer = setTimeout(() => {
      this.finish();
    }, this.duration);
  }

  finish() {
    if (this.isClosed) return;
    this.isClosed = true;
    if (this.timer) clearTimeout(this.timer);

    if (this.container) {
      this.container.classList.add('fade-out');
      setTimeout(() => {
        if (this.container && this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
        if (typeof this.onFinish === 'function') {
          this.onFinish();
        }
      }, 600);
    } else {
      if (typeof this.onFinish === 'function') {
        this.onFinish();
      }
    }
  }
}
