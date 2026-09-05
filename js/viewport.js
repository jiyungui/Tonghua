// 视口与 2 页滑动控制器
export class ViewportController {
  constructor(options) {
    this.track = options.track;
    this.dots = options.dots;
    this.currentPage = 0;
    this.totalPages = 2;
    this.startX = 0;
    this.isDragging = false;
    this.init();
  }

  init() {
    this.setupTouchEvents();
    this.setupKeyboardNavigation();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.setupResizeHandler();
  }

  updateClock() {
    const timeEl = document.getElementById('status-time-display');
    if (!timeEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}`;
  }

  setupResizeHandler() {
    const setAppHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);
    setAppHeight();
  }

  setupTouchEvents() {
    const wrapper = this.track.parentElement;

    const touchStart = (e) => {
      this.isDragging = true;
      this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
      this.track.style.transition = 'none';
    };

    const touchMove = (e) => {
      if (!this.isDragging) return;
      const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
      const diffX = currentX - this.startX;
      
      let movePercent = (diffX / wrapper.offsetWidth) * 50;
      if ((this.currentPage === 0 && diffX > 0) || (this.currentPage === this.totalPages - 1 && diffX < 0)) {
        movePercent = movePercent * 0.25;
      }

      const translate = -this.currentPage * 50 + movePercent;
      this.track.style.transform = `translateX(${translate}%)`;
    };

    const touchEnd = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      const endX = e.type.includes('mouse') ? e.pageX : (e.changedTouches ? e.changedTouches[0].clientX : this.startX);
      const diffX = endX - this.startX;
      const threshold = wrapper.offsetWidth * 0.18;

      this.track.style.transition = 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)';

      if (diffX < -threshold && this.currentPage < this.totalPages - 1) {
        this.goToPage(this.currentPage + 1);
      } else if (diffX > threshold && this.currentPage > 0) {
        this.goToPage(this.currentPage - 1);
      } else {
        this.goToPage(this.currentPage);
      }
    };

    wrapper.addEventListener('touchstart', touchStart, { passive: true });
    wrapper.addEventListener('touchmove', touchMove, { passive: true });
    wrapper.addEventListener('touchend', touchEnd);

    wrapper.addEventListener('mousedown', touchStart);
    window.addEventListener('mousemove', touchMove);
    window.addEventListener('mouseup', touchEnd);
  }

  setupKeyboardNavigation() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && this.currentPage > 0) {
        this.goToPage(this.currentPage - 1);
      } else if (e.key === 'ArrowRight' && this.currentPage < this.totalPages - 1) {
        this.goToPage(this.currentPage + 1);
      }
    });
  }

  goToPage(pageIndex) {
    this.currentPage = Math.max(0, Math.min(pageIndex, this.totalPages - 1));
    this.track.style.transform = `translateX(-${this.currentPage * 50}%)`;
    this.updateDots();
  }

  updateDots() {
    this.dots.forEach((dot, idx) => {
      if (idx === this.currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}
