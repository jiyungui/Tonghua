// 统一编辑弹窗组件：支持文本修改、原画质图片上传、即时预览与存储到 IndexedDB

export class EditModal {
  constructor(options) {
    this.options = options;
    this.currentWidget = null;
    this.tempFiles = {};
    this.init();
  }

  init() {
    let overlay = document.getElementById('global-edit-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'global-edit-modal';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }
    this.overlay = overlay;
  }

  open(widgetType, currentData) {
    this.currentWidget = widgetType;
    this.tempFiles = {};
    this.renderForm(widgetType, currentData);
    this.overlay.classList.add('active');
  }

  close() {
    this.overlay.classList.remove('active');
  }

  renderForm(type, data) {
    let title = '编辑小组件';
    let formHtml = '';

    if (type === 'p1') {
      title = '编辑 P1 顶部卡片';
      formHtml = `
        <div class="form-group">
          <label class="form-label">标题名称 (Name)</label>
          <input type="text" class="form-input" id="edit-p1-title" value="${data.title || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">标签组 (用英文逗号隔开)</label>
          <input type="text" class="form-input" id="edit-p1-tags" value="${data.tags || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">气泡提示语 (Bubble Text)</label>
          <input type="text" class="form-input" id="edit-p1-bubble" value="${data.bubbleText || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">简介说明 (Bio)</label>
          <textarea class="form-textarea" id="edit-p1-bio">${data.bio || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">更换主背景图片 (高清原图储存)</label>
          <div class="upload-box" id="p1-bg-upload-btn">
            <span>点击上传高清大图</span>
            <input type="file" id="edit-p1-bg-file" accept="image/*">
            <img class="upload-preview" id="p1-bg-preview">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">更换小头像</label>
          <div class="upload-box" id="p1-avatar-upload-btn">
            <span>点击上传头像图片</span>
            <input type="file" id="edit-p1-avatar-file" accept="image/*">
            <img class="upload-preview" id="p1-avatar-preview">
          </div>
        </div>
      `;
    } else if (type === 'p2') {
      title = '编辑 P2 搜索与图文组件';
      formHtml = `
        <div class="form-group">
          <label class="form-label">搜索框提示文字</label>
          <input type="text" class="form-input" id="edit-p2-search" value="${data.searchPlaceholder || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">主要文字 (如: yummy)</label>
          <input type="text" class="form-input" id="edit-p2-line1" value="${data.line1Text || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">二级说明文案</label>
          <input type="text" class="form-input" id="edit-p2-line2" value="${data.line2Text || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">底部标语 (Plog)</label>
          <input type="text" class="form-input" id="edit-p2-line3" value="${data.line3Text || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">更换咖啡插图 (高清原图储存)</label>
          <div class="upload-box" id="p2-img-upload-btn">
            <span>点击上传原图</span>
            <input type="file" id="edit-p2-file" accept="image/*">
            <img class="upload-preview" id="p2-preview">
          </div>
        </div>
      `;
    } else if (type === 'p3') {
      title = '编辑 P3 生活记录组件';
      formHtml = `
        <div class="form-group">
          <label class="form-label">月份 / 顶部英文字</label>
          <input type="text" class="form-input" id="edit-p3-month" value="${data.monthText || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">照片标题 (My little life.)</label>
          <input type="text" class="form-input" id="edit-p3-title" value="${data.titleText || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">胶囊日期 (DD/MM/YYYY)</label>
          <input type="text" class="form-input" id="edit-p3-date" value="${data.dateText || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">胶囊心情字符 / 符号</label>
          <input type="text" class="form-input" id="edit-p3-kaomoji" value="${data.kaomojiText || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">更换顶部日常图片 (高清原图储存)</label>
          <div class="upload-box" id="p3-top-upload-btn">
            <span>点击上传日常原图</span>
            <input type="file" id="edit-p3-top-file" accept="image/*">
            <img class="upload-preview" id="p3-top-preview">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">更换胶囊小头像</label>
          <div class="upload-box" id="p3-avatar-upload-btn">
            <span>点击上传头像</span>
            <input type="file" id="edit-p3-avatar-file" accept="image/*">
            <img class="upload-preview" id="p3-avatar-preview">
          </div>
        </div>
      `;
    }

    this.overlay.innerHTML = `
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">${title}</div>
          <button class="modal-close" id="modal-close-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        ${formHtml}
        <button class="modal-save-btn" id="modal-save-action">保存更新</button>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.overlay.querySelector('#modal-close-btn').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    const bindUploader = (btnId, inputId, previewId, fileKey) => {
      const btn = this.overlay.querySelector(`#${btnId}`);
      const input = this.overlay.querySelector(`#${inputId}`);
      const preview = this.overlay.querySelector(`#${previewId}`);
      if (!btn || !input) return;

      btn.addEventListener('click', () => input.click());
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.tempFiles[fileKey] = file;
          if (preview) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = 'block';
          }
        }
      });
    };

    if (this.currentWidget === 'p1') {
      bindUploader('p1-bg-upload-btn', 'edit-p1-bg-file', 'p1-bg-preview', 'p1_bg');
      bindUploader('p1-avatar-upload-btn', 'edit-p1-avatar-file', 'p1-avatar-preview', 'p1_avatar');
    } else if (this.currentWidget === 'p2') {
      bindUploader('p2-img-upload-btn', 'edit-p2-file', 'p2-preview', 'p2_img');
    } else if (this.currentWidget === 'p3') {
      bindUploader('p3-top-upload-btn', 'edit-p3-top-file', 'p3-top-preview', 'p3_top');
      bindUploader('p3-avatar-upload-btn', 'edit-p3-avatar-file', 'p3-avatar-preview', 'p3_avatar');
    }

    const saveBtn = this.overlay.querySelector('#modal-save-action');
    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      saveBtn.textContent = '保存中...';

      let resultData = {};
      if (this.currentWidget === 'p1') {
        resultData = {
          title: this.overlay.querySelector('#edit-p1-title').value,
          tags: this.overlay.querySelector('#edit-p1-tags').value,
          bubbleText: this.overlay.querySelector('#edit-p1-bubble').value,
          bio: this.overlay.querySelector('#edit-p1-bio').value
        };
      } else if (this.currentWidget === 'p2') {
        resultData = {
          searchPlaceholder: this.overlay.querySelector('#edit-p2-search').value,
          line1Text: this.overlay.querySelector('#edit-p2-line1').value,
          line2Text: this.overlay.querySelector('#edit-p2-line2').value,
          line3Text: this.overlay.querySelector('#edit-p2-line3').value
        };
      } else if (this.currentWidget === 'p3') {
        resultData = {
          monthText: this.overlay.querySelector('#edit-p3-month').value,
          titleText: this.overlay.querySelector('#edit-p3-title').value,
          dateText: this.overlay.querySelector('#edit-p3-date').value,
          kaomojiText: this.overlay.querySelector('#edit-p3-kaomoji').value
        };
      }

      if (this.options.onSave) {
        await this.options.onSave(this.currentWidget, resultData, this.tempFiles);
      }
      this.close();
    });
  }
}
