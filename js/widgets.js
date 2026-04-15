/**
 * widgets.js
 * 小组件逻辑：读取数据、渲染、编辑、图片上传
 * 正方形小组件：点击整体直接换图，无角标按钮
 * 顶部组件：保留角标编辑
 */

const Widgets = (() => {

    /* ======== 工具：File -> DataURL ======== */
    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /* ======== 工具：压缩图片 ======== */
    function compressImage(dataUrl, maxWidth = 600, quality = 0.82) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width, h = img.height;
                if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
                canvas.width = w;
                canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = dataUrl;
        });
    }

    /* ======== 工具：应用图片到 img 元素 ======== */
    function applyImage(imgEl, dataUrl) {
        if (!dataUrl || !imgEl) return;
        imgEl.onload = () => imgEl.classList.add('loaded');
        imgEl.src = dataUrl;
        if (imgEl.complete && imgEl.naturalWidth > 0) {
            imgEl.classList.add('loaded');
        }
    }

    /* ======== 顶部组件 ======== */
    function initTopWidget() {
        const data = Storage.getTopWidget();

        const avatarEl = document.getElementById('twAvatar');
        const avatarInput = document.getElementById('twAvatarInput');
        const avatarWrap = avatarEl.parentElement;
        const titleEl = document.getElementById('twTitle');
        const babyEl = document.getElementById('twBaby');
        const contactEl = document.getElementById('twContact');
        const editCorner = document.querySelector('[data-widget="top"]');
        const babyEditBtn = document.querySelector('[data-target="twBaby"]');

        function render(d) {
            titleEl.textContent = d.title;
            babyEl.textContent = d.baby;
            contactEl.textContent = d.contact;
            if (d.avatarDataUrl) applyImage(avatarEl, d.avatarDataUrl);
        }
        render(data);

        // 点击头像换图
        avatarWrap.addEventListener('click', () => avatarInput.click());
        avatarInput.addEventListener('change', async e => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const raw = await fileToDataUrl(file);
                const compressed = await compressImage(raw, 200, 0.9);
                applyImage(avatarEl, compressed);
                const d = Storage.getTopWidget();
                d.avatarDataUrl = compressed;
                Storage.saveTopWidget(d);
            } catch (err) { console.error('[TopWidget] 头像上传失败', err); }
            avatarInput.value = '';
        });

        // Baby 快捷修改按钮
        babyEditBtn && babyEditBtn.addEventListener('click', () => {
            openEditModal('top', Storage.getTopWidget());
        });

        // 顶部组件角标编辑（顶部组件保留）
        editCorner && editCorner.addEventListener('click', e => {
            e.stopPropagation();
            openEditModal('top', Storage.getTopWidget());
        });
    }

    /* ======== 拍立得组件：点击整体换图 ======== */
    function initPolaroid() {
        const data = Storage.getPolaroid();

        const imgEl = document.getElementById('polaroidImg');
        const imgInput = document.getElementById('polaroidImgInput');
        const captionEl = document.getElementById('polaroidCaption');
        const widget = document.getElementById('polaroidWidget');

        function render(d) {
            captionEl.textContent = d.caption || 'First Choice';
            if (d.imgDataUrl) applyImage(imgEl, d.imgDataUrl);
        }
        render(data);

        // 点击整个组件换图（无角标，直接触发）
        widget.addEventListener('click', () => imgInput.click());

        imgInput.addEventListener('change', async e => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const raw = await fileToDataUrl(file);
                const compressed = await compressImage(raw, 400, 0.85);
                applyImage(imgEl, compressed);
                const d = Storage.getPolaroid();
                d.imgDataUrl = compressed;
                Storage.savePolaroid(d);
                console.log('[Polaroid] 已保存，长度:', compressed.length);
            } catch (err) { console.error('[Polaroid] 上传失败', err); }
            imgInput.value = '';
        });
    }

    /* ======== 右侧图片组件：点击整体换图 ======== */
    function initPhotoWidget() {
        const data = Storage.getPhotoWidget();

        const imgEl = document.getElementById('photoImg');
        const imgInput = document.getElementById('photoImgInput');
        const widget = document.getElementById('photoWidget');

        function render(d) {
            if (d.imgDataUrl) {
                applyImage(imgEl, d.imgDataUrl);
                widget.classList.add('has-image');
            }
        }
        render(data);

        // 点击整个组件换图（无角标，直接触发）
        widget.addEventListener('click', () => imgInput.click());

        imgInput.addEventListener('change', async e => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const raw = await fileToDataUrl(file);
                const compressed = await compressImage(raw, 500, 0.85);
                applyImage(imgEl, compressed);
                widget.classList.add('has-image');
                const d = Storage.getPhotoWidget();
                d.imgDataUrl = compressed;
                Storage.savePhotoWidget(d);
                // 验证
                const v = Storage.getPhotoWidget();
                console.log('[PhotoWidget] 已保存，长度:', v.imgDataUrl ? v.imgDataUrl.length : 0);
            } catch (err) { console.error('[PhotoWidget] 上传失败', err); }
            imgInput.value = '';
        });
    }

    /* ======== 顶部组件编辑弹窗 ======== */
    let _currentEditType = null;
    let _editImgDataUrl = null;

    function openEditModal(type, data) {
        _currentEditType = type;
        _editImgDataUrl = null;

        const modal = document.getElementById('editModal');
        const titleEl = document.getElementById('editModalTitle');
        const bodyEl = document.getElementById('editModalBody');

        bodyEl.innerHTML = '';

        if (type === 'top') {
            titleEl.textContent = '编辑顶部组件';
            bodyEl.innerHTML = `
        <div class="edit-field">
          <label>头像图片</label>
          <div class="edit-field-img">
            <img class="edit-img-preview" id="editAvatarPreview"
                 src="${escapeAttr(data.avatarDataUrl || '')}" alt="" />
            <button class="edit-img-btn" id="editAvatarBtn">点击更换头像</button>
            <input type="file" accept="image/*" id="editAvatarFileInput" class="hidden-input" />
          </div>
        </div>
        <div class="edit-field">
          <label>标题语句</label>
          <input type="text" id="editTitle" value="${escapeAttr(data.title)}" placeholder="输入一句话..." />
        </div>
        <div class="edit-field">
          <label>Baby 称呼</label>
          <input type="text" id="editBaby" value="${escapeAttr(data.baby)}" placeholder="称呼..." />
        </div>
        <div class="edit-field">
          <label>Contact 链接</label>
          <input type="text" id="editContact" value="${escapeAttr(data.contact)}" placeholder="链接或文字..." />
        </div>
      `;
            setTimeout(() => bindImgUpload('editAvatarBtn', 'editAvatarFileInput', 'editAvatarPreview', 200), 0);
        }

        modal.classList.add('open');
    }

    function bindImgUpload(btnId, inputId, previewId, maxW) {
        const btn = document.getElementById(btnId);
        const inp = document.getElementById(inputId);
        const prev = document.getElementById(previewId);
        if (!btn || !inp || !prev) return;

        btn.addEventListener('click', () => inp.click());
        inp.addEventListener('change', async e => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const raw = await fileToDataUrl(file);
                const compressed = await compressImage(raw, maxW, 0.88);
                prev.src = compressed;
                _editImgDataUrl = compressed;
            } catch (err) { console.error('[EditModal] 图片处理失败', err); }
            inp.value = '';
        });
    }

    function saveEditModal() {
        if (_currentEditType === 'top') {
            const d = Storage.getTopWidget();
            const titleVal = document.getElementById('editTitle')?.value.trim();
            const babyVal = document.getElementById('editBaby')?.value.trim();
            const contactVal = document.getElementById('editContact')?.value.trim();
            if (titleVal) d.title = titleVal;
            if (babyVal) d.baby = babyVal;
            if (contactVal) d.contact = contactVal;
            if (_editImgDataUrl) d.avatarDataUrl = _editImgDataUrl;
            Storage.saveTopWidget(d);
            document.getElementById('twTitle').textContent = d.title;
            document.getElementById('twBaby').textContent = d.baby;
            document.getElementById('twContact').textContent = d.contact;
            if (d.avatarDataUrl) applyImage(document.getElementById('twAvatar'), d.avatarDataUrl);
        }
        closeEditModal();
    }

    function closeEditModal() {
        document.getElementById('editModal').classList.remove('open');
        _currentEditType = null;
        _editImgDataUrl = null;
    }

    function escapeAttr(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;');
    }

    /* ======== 初始化 ======== */
    function init() {
        initTopWidget();
        initPolaroid();
        initPhotoWidget();

        document.getElementById('editSave').addEventListener('click', saveEditModal);
        document.getElementById('editCancel').addEventListener('click', closeEditModal);
        document.getElementById('editModal').addEventListener('click', e => {
            if (e.target === document.getElementById('editModal')) closeEditModal();
        });
    }

    return { init };
})();
