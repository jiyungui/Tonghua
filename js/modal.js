// 统一编辑弹窗组件：支持所有小组件的高清图片无损上传与文本编辑

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
          <label class="form-label">简介文案 / 语录 (Bio)</label>
          <textarea class="form-textarea" id="edit-p1-bio">${data.bio || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">更换主背景图片 (原画质直存)</label>
          <div class="upload-box" id="p1-bg-upload-btn">
            <span>点击上传卡片大图</span>
            <input type="file" id="edit-p1-bg-file" accept="image/*">
            <img class="upload-preview" id="p1-bg-preview">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">更换小头像</label>
          <div class="upload-box" id="p1-avatar-upload-btn">
            <span>点击上传头像</span>
            <input type="file" id="edit-p1-avatar-file" accept="image/*">
            <img class="upload-preview" id="p1-avatar-preview">
          </div>
        </div>
      `;
    } else if (type === 'p2' || type === 'p2_page2') {
      title = type === 'p2_page2' ? '编辑第二页 P2 组件' : '编辑 P2 搜索与图文组件';
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
          <label class="form-label">二级说明文案 / 语录</label>
          <input type="text" class="form-input" id="edit-p2-line2" value="${data.line2Text || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">底部标语</label>
          <input type="text" class="form-input" id="edit-p2-line3" value="${data.line3Text || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">更换插图 (原画质直存)</label>
          <div class="upload-box" id="p2-img-upload-btn">
            <span>点击上传插图</span>
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
          <label class="form-label">胶囊心情文案 / 符号</label>
          <input type="text" class="form-input" id="edit-p3-kaomoji" value="${data.kaomojiText || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">更换顶部日常图片 (原画质直存)</label>
          <div class="upload-box" id="p3-top-upload-btn">
            <span>点击上传日常图</span>
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
    } else if (type === 'p4') {
      title = '编辑第二页 Story 小组件';
      formHtml = `
        <div class="form-group">
          <label class="form-label">用户名</label>
          <input type="text" class="form-input" id="edit-p4-name" value="${data.userName || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">个性签名 (Motto)</label>
          <input type="text" class="form-input" id="edit-p4-motto" value="${data.userMotto || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">语录文本 (Quote)</label>
          <textarea class="form-textarea" id="edit-p4-quote">${data.quoteText || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">更换头像</label>
          <div class="upload-box" id="p4-avatar-upload-btn">
            <span>点击上传用户头像</span>
            <input type="file" id="edit-p4-avatar-file" accept="image/*">
            <img class="upload-preview" id="p4-avatar-preview">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">更换相册照片 1</label>
          <div class="upload-box" id="p4-photo1-upload-btn">
            <span>点击上传照片 1</span>
            <input type="file" id="edit-p4-photo1-file" accept="image/*">
            <img class="upload-preview" id="p4-photo1-preview">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">更换相册照片 2</label>
          <div class="upload-box" id="p4-photo2-upload-btn">
            <span>点击上传照片 2</span>
            <input type="file" id="edit-p4-photo2-file" accept="image/*">
            <img class="upload-preview" id="p4-photo2-preview">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">更换相册照片 3</label>
          <div class="upload-box" id="p4-photo3-upload-btn">
            <span>点击上传照片 3</span>
            <input type="file" id="edit-p4-photo3-file" accept="image/*">
            <img class="upload-preview" id="p4-photo3-preview">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">更换相册照片 4</label>
          <div class="upload-box" id="p4-photo4-upload-btn">
            <span>点击上传照片 4</span>
            <input type="file" id="edit-p4-photo4-file" accept="image/*">
            <img class="upload-preview" id="p4-photo4-preview">
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
    } else if (this.currentWidget === 'p2' || this.currentWidget === 'p2_page2') {
      bindUploader('p2-img-upload-btn', 'edit-p2-file', 'p2-preview', 'p2_img');
    } else if (this.currentWidget === 'p3') {
      bindUploader('p3-top-upload-btn', 'edit-p3-top-file', 'p3-top-preview', 'p3_top');
      bindUploader('p3-avatar-upload-btn', 'edit-p3-avatar-file', 'p3-avatar-preview', 'p3_avatar');
    } else if (this.currentWidget === 'p4') {
      bindUploader('p4-avatar-upload-btn', 'edit-p4-avatar-file', 'p4-avatar-preview', 'p4_avatar');
      bindUploader('p4-photo1-upload-btn', 'edit-p4-photo1-file', 'p4-photo1-preview', 'p4_photo_1');
      bindUploader('p4-photo2-upload-btn', 'edit-p4-photo2-file', 'p4-photo2-preview', 'p4_photo_2');
      bindUploader('p4-photo3-upload-btn', 'edit-p4-photo3-file', 'p4-photo3-preview', 'p4_photo_3');
      bindUploader('p4-photo4-upload-btn', 'edit-p4-photo4-file', 'p4-photo4-preview', 'p4_photo_4');
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
      } else if (this.currentWidget === 'p2' || this.currentWidget === 'p2_page2') {
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
      } else if (this.currentWidget === 'p4') {
        resultData = {
          userName: this.overlay.querySelector('#edit-p4-name').value,
          userMotto: this.overlay.querySelector('#edit-p4-motto').value,
          quoteText: this.overlay.querySelector('#edit-p4-quote').value
        };
      }

      if (this.options.onSave) {
        await this.options.onSave(this.currentWidget, resultData, this.tempFiles);
      }
      this.close();
    });
  }
}
