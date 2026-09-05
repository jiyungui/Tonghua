// 统一悬浮编辑弹窗模块 (修复头像/背景/照片实时预览与持久化保存)

export class EditModal {
  constructor(options) {
    this.options = options;
    this.currentWidget = null;
    this.currentData = null;
    this.imageResources = {}; // 存放选中的 file 或 url 字符串
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

  async open(widgetType, currentData) {
    this.currentWidget = widgetType;
    this.currentData = currentData;
    this.imageResources = {};
    await this.renderForm(widgetType, currentData);
    this.overlay.classList.add('active');
  }

  close() {
    this.overlay.classList.remove('active');
  }

  async renderForm(type, data) {
    let tag = 'CUSTOMIZE';
    let title = '小组件设置';
    let formFields = '';

    if (type === 'p1') {
      tag = 'WIDGET P1';
      title = '编辑顶部卡片';
      formFields = `
        <div class="ins-form-item">
          <label class="ins-label">标题名称 <span class="ins-label-sub">Title</span></label>
          <input type="text" class="ins-input" id="edit-p1-title" value="${data.title || ''}">
        </div>
        <div class="ins-form-item">
          <label class="ins-label">标签组 <span class="ins-label-sub">用逗号隔开</span></label>
          <input type="text" class="ins-input" id="edit-p1-tags" value="${data.tags || ''}">
        </div>
        <div class="ins-form-item">
          <label class="ins-label">气泡文案 <span class="ins-label-sub">Bubble</span></label>
          <input type="text" class="ins-input" id="edit-p1-bubble" value="${data.bubbleText || ''}">
        </div>
        <div class="ins-form-item">
          <label class="ins-label">简介文案 / 语录 <span class="ins-label-sub">Bio</span></label>
          <textarea class="ins-textarea" id="edit-p1-bio">${data.bio || ''}</textarea>
        </div>
        ${this.buildImageField('p1_bg', '主背景大图', '可上传原画质照片或输入外链')}
        ${this.buildImageField('p1_avatar', '气泡小头像', '点击上传头像或输入外链')}
      `;
    } else if (type === 'p2' || type === 'p2_page2') {
      tag = type === 'p2_page2' ? 'PAGE 2 · WIDGET P2' : 'PAGE 1 · WIDGET P2';
      title = '编辑搜索与图文组件';
      const imgFieldKey = type === 'p2_page2' ? 'p2_page2_img' : 'p2_img';
      formFields = `
        <div class="ins-form-item">
          <label class="ins-label">搜索框提示词</label>
          <input type="text" class="ins-input" id="edit-p2-search" value="${data.searchPlaceholder || ''}">
        </div>
        <div class="ins-form-item">
          <label class="ins-label">主要文字 (如 yummy)</label>
          <input type="text" class="ins-input" id="edit-p2-line1" value="${data.line1Text || ''}">
        </div>
        <div class="ins-form-item">
          <label class="ins-label">二级说明文案 / 语录</label>
          <input type="text" class="ins-input" id="edit-p2-line2" value="${data.line2Text || ''}">
        </div>
        <div class="ins-form-item">
          <label class="ins-label">底部标语</label>
          <input type="text" class="ins-input" id="edit-p2-line3" value="${data.line3Text || ''}">
        </div>
        ${this.buildImageField(imgFieldKey, '组件插图', '支持原图上传或图片URL')}
      `;
    } else if (type === 'p3') {
      tag = 'WIDGET P3';
      title = '编辑生活记录组件';
      formFields = `
        <div class="ins-form-item">
          <label class="ins-label">月份英文字</label>
          <input type="text" class="ins-input" id="edit-p3-month" value="${data.monthText || ''}">
        </div>
        <div class="ins-form-item">
          <label class="ins-label">标语文字</label>
          <input type="text" class="ins-input" id="edit-p3-title" value="${data.titleText || ''}">
        </div>
        <div class="ins-form-item">
          <label class="ins-label">胶囊日期 (DD/MM/YYYY)</label>
          <input type="text" class="ins-input" id="edit-p3-date" value="${data.dateText || ''}">
        </div>
        <div class="ins-form-item">
          <label class="ins-label">心情文案 / 符号</label>
          <input type="text" class="ins-input" id="edit-p3-kaomoji" value="${data.kaomojiText || ''}">
        </div>
        ${this.buildImageField('p3_top', '顶部日常照片', '支持相册原图或网络URL')}
        ${this.buildImageField('p3_avatar', '胶囊小头像', '支持相册原图或网络URL')}
      `;
    } else if (type === 'p4') {
      tag = 'STORY MODE';
      title = '编辑故事小组件';
      formFields = `
        <div class="ins-form-item">
          <label class="ins-label">用户名</label>
          <input type="text" class="ins-input" id="edit-p4-name" value="${data.userName || ''}">
        </div>
        <div class="ins-form-item">
          <label class="ins-label">个性签名</label>
          <input type="text" class="ins-input" id="edit-p4-motto" value="${data.userMotto || ''}">
        </div>
        <div class="ins-form-item">
          <label class="ins-label">语录文案 (Quote)</label>
          <textarea class="ins-textarea" id="edit-p4-quote">${data.quoteText || ''}</textarea>
        </div>
        ${this.buildImageField('p4_avatar', '用户头像', '支持相册原图/网络URL')}
        ${this.buildImageField('p4_photo_1', '相框照片 1', '相册或URL')}
        ${this.buildImageField('p4_photo_2', '相框照片 2', '相册或URL')}
        ${this.buildImageField('p4_photo_3', '相框照片 3', '相册或URL')}
        ${this.buildImageField('p4_photo_4', '相框照片 4 (或添加槽)', '相册或URL')}
      `;
    }

    this.overlay.innerHTML = `
      <div class="floating-modal-card" onclick="event.stopPropagation()">
        <div class="modal-header-ins">
          <div class="modal-header-left">
            <span class="modal-tag">${tag}</span>
            <h3 class="modal-title-text">${title}</h3>
          </div>
          <button class="modal-close-ins" id="ins-modal-close" title="关闭">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="modal-body-scroll">
          ${formFields}
        </div>

        <div class="modal-footer-ins">
          <button class="ins-btn-cancel" id="ins-modal-cancel">取消</button>
          <button class="ins-btn-save" id="ins-modal-save">保存更改</button>
        </div>
      </div>
    `;

    this.bindImagePickerEvents();
    this.bindActionEvents();
  }

  buildImageField(fieldKey, labelText, subText) {
    return `
      <div class="ins-image-picker-group" data-key="${fieldKey}">
        <div class="ins-img-picker-header">
          <label class="ins-label">${labelText} <span class="ins-label-sub">${subText}</span></label>
          <div class="ins-mode-switch">
            <span class="ins-mode-tab active" data-mode="file" data-for="${fieldKey}">相册</span>
            <span class="ins-mode-tab" data-mode="url" data-for="${fieldKey}">URL</span>
          </div>
        </div>

        <!-- 相册上传面板 -->
        <div class="ins-panel-file" id="panel-file-${fieldKey}">
          <div class="ins-upload-dropzone" id="dropzone-${fieldKey}">
            <div class="ins-upload-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" stroke-width="1.8">
                <rect x="3" y="3" width="18" height="18" rx="4"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div class="ins-upload-hint">选择手机相册照片 (原画质直存)</div>
            <div class="ins-upload-subhint">不压缩画质 · 存储于本地数据库</div>
            <input type="file" id="input-file-${fieldKey}" accept="image/*" style="display: none;">
          </div>
        </div>

        <!-- 网络 URL 面板 -->
        <div class="ins-panel-url" id="panel-url-${fieldKey}" style="display: none;">
          <input type="url" class="ins-input" id="input-url-${fieldKey}" placeholder="https://... 输入图片直链地址">
        </div>

        <!-- 即时预览区域 -->
        <div class="ins-preview-box" id="preview-box-${fieldKey}" style="display: none;">
          <img src="" alt="Preview" class="ins-preview-img" id="preview-img-${fieldKey}">
          <button class="ins-preview-remove" id="preview-remove-${fieldKey}" title="清除">×</button>
        </div>
      </div>
    `;
  }

  bindImagePickerEvents() {
    const groups = this.overlay.querySelectorAll('.ins-image-picker-group');
    groups.forEach(group => {
      const fieldKey = group.getAttribute('data-key');
      const tabs = group.querySelectorAll('.ins-mode-tab');
      const panelFile = group.querySelector(`#panel-file-${fieldKey}`);
      const panelUrl = group.querySelector(`#panel-url-${fieldKey}`);
      const fileInput = group.querySelector(`#input-file-${fieldKey}`);
      const dropzone = group.querySelector(`#dropzone-${fieldKey}`);
      const urlInput = group.querySelector(`#input-url-${fieldKey}`);
      const previewBox = group.querySelector(`#preview-box-${fieldKey}`);
      const previewImg = group.querySelector(`#preview-img-${fieldKey}`);
      const removeBtn = group.querySelector(`#preview-remove-${fieldKey}`);

      // 切换模式
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.stopPropagation();
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const mode = tab.getAttribute('data-mode');
          if (mode === 'file') {
            panelFile.style.display = 'block';
            panelUrl.style.display = 'none';
          } else {
            panelFile.style.display = 'none';
            panelUrl.style.display = 'block';
          }
        });
      });

      // 相册选图
      dropzone.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          this.imageResources[fieldKey] = file;
          previewImg.src = URL.createObjectURL(file);
          previewBox.style.display = 'block';
        }
      });

      // 输入 URL
      urlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url) {
          this.imageResources[fieldKey] = url;
          previewImg.src = url;
          previewBox.style.display = 'block';
        } else {
          delete this.imageResources[fieldKey];
          previewBox.style.display = 'none';
        }
      });

      // 清除预览
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        delete this.imageResources[fieldKey];
        fileInput.value = '';
        urlInput.value = '';
        previewBox.style.display = 'none';
      });
    });
  }

  bindActionEvents() {
    const closeBtn = this.overlay.querySelector('#ins-modal-close');
    const cancelBtn = this.overlay.querySelector('#ins-modal-cancel');
    const saveBtn = this.overlay.querySelector('#ins-modal-save');

    const handleClose = () => this.close();
    closeBtn.addEventListener('click', handleClose);
    cancelBtn.addEventListener('click', handleClose);
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

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
        await this.options.onSave(this.currentWidget, resultData, this.imageResources);
      }
      this.close();
    });
  }
}
