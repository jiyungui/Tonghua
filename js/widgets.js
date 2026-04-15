/**
 * widgets.js — 小组件编辑交互
 * 图片上传、文字编辑、头像更换、壁纸更换
 */

/**
 * 读取文件为 DataURL（base64），适合小图片存 localStorage
 * 大图片建议改用 IndexedDB（见注释）
 */
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * 将 dataURL 设置为某容器的背景图片，并隐藏 placeholder
 */
function applyImageToWidget(imgWrap, placeholderId, dataUrl) {
    // 移除旧预览
    const oldImg = imgWrap.querySelector('.widget-preview-img');
    if (oldImg) oldImg.remove();

    // 创建新预览
    const img = document.createElement('img');
    img.className = 'widget-preview-img';
    img.src = dataUrl;
    imgWrap.appendChild(img);

    // 隐藏 placeholder
    const ph = document.getElementById(placeholderId);
    if (ph) ph.style.opacity = '0';
}

function initWidgets() {
    /* ---- 左侧图片组件 ---- */
    const leftFile = document.getElementById('widgetLeftFile');
    const leftWrap = document.getElementById('widgetLeftImgWrap');

    leftFile.addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const url = await readFileAsDataURL(file);
            applyImageToWidget(leftWrap, 'widgetLeftPlaceholder', url);
            Storage.save('widgetLeftImg', url);
        } catch { /* 文件读取失败静默 */ }
        leftFile.value = '';
    });

    /* ---- 右侧图片组件 ---- */
    const rightFile = document.getElementById('widgetRightFile');
    const rightWrap = document.getElementById('widgetRightImgWrap');

    rightFile.addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const url = await readFileAsDataURL(file);
            applyImageToWidget(rightWrap, 'widgetRightPlaceholder', url);
            Storage.save('widgetRightImg', url);
        } catch { }
        rightFile.value = '';
    });

    /* ---- 头像 ---- */
    const avatar = document.getElementById('infoAvatar');
    const avatarInput = document.createElement('input');
    avatarInput.type = 'file';
    avatarInput.accept = 'image/*';
    avatarInput.style.display = 'none';
    document.body.appendChild(avatarInput);

    avatar.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const url = await readFileAsDataURL(file);
            applyAvatarImg(url);
            Storage.save('avatarUrl', url);
        } catch { }
        avatarInput.value = '';
    });

    /* ---- 壁纸更换 ---- */
    const wallpaperBtn = document.getElementById('wallpaperBtn');
    const wallpaperFile = document.getElementById('wallpaperFile');

    wallpaperBtn.addEventListener('click', () => wallpaperFile.click());
    wallpaperFile.addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const url = await readFileAsDataURL(file);
            applyWallpaper(url);
            Storage.save('wallpaper', url);
            Storage.save('wallpaperType', 'image');
        } catch { }
        wallpaperFile.value = '';
    });

    /* ---- 文字输入实时保存 ---- */
    const textFields = [
        { id: 'infoMotto', key: 'motto' },
        { id: 'infoBaby', key: 'baby' },
        { id: 'infoContact', key: 'contact' },
        { id: 'widgetLeftCaption', key: 'widgetLeftCaption' }
    ];
    textFields.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => Storage.save(key, el.value));
    });
}

function applyAvatarImg(url) {
    const avatar = document.getElementById('infoAvatar');
    avatar.innerHTML = `<img src="${url}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
}

function applyWallpaper(url) {
    const shell = document.getElementById('phoneShell');
    shell.style.backgroundImage = `url(${url})`;
    shell.style.backgroundSize = 'cover';
    shell.style.backgroundPosition = 'center';
}

/**
 * 从 Storage 恢复所有小组件状态
 */
function restoreWidgets() {
    const s = Storage.load();

    if (s.motto) document.getElementById('infoMotto').value = s.motto;
    if (s.baby) document.getElementById('infoBaby').value = s.baby;
    if (s.contact) document.getElementById('infoContact').value = s.contact;
    if (s.widgetLeftCaption) document.getElementById('widgetLeftCaption').value = s.widgetLeftCaption;

    if (s.avatarUrl) applyAvatarImg(s.avatarUrl);

    if (s.widgetLeftImg) {
        applyImageToWidget(
            document.getElementById('widgetLeftImgWrap'),
            'widgetLeftPlaceholder',
            s.widgetLeftImg
        );
    }

    if (s.widgetRightImg) {
        applyImageToWidget(
            document.getElementById('widgetRightImgWrap'),
            'widgetRightPlaceholder',
            s.widgetRightImg
        );
    }

    if (s.wallpaper && s.wallpaperType === 'image') {
        applyWallpaper(s.wallpaper);
    }
}
