/* ═══════════════════════════════════════════════════════
   chat.js  聊天 APP · 个人主页 · User 身份
═══════════════════════════════════════════════════════ */
'use strict';

/* ════════════════════════════════
   存储
════════════════════════════════ */
const ChatStore = {
    PROFILE_KEY: 'xxj_chat_profile',
    USERS_KEY: 'xxj_chat_users',
    ACTIVE_KEY: 'xxj_chat_active_user',

    getProfile() {
        try {
            const v = localStorage.getItem(this.PROFILE_KEY);
            return v ? JSON.parse(v) : { banner: null, avatar: null, nickname: '', bio: '' };
        } catch { return { banner: null, avatar: null, nickname: '', bio: '' }; }
    },
    saveProfile(d) {
        try { localStorage.setItem(this.PROFILE_KEY, JSON.stringify(d)); } catch { }
    },
    getUsers() {
        try {
            const v = localStorage.getItem(this.USERS_KEY);
            return v ? JSON.parse(v) : [];
        } catch { return []; }
    },
    saveUsers(arr) {
        try { localStorage.setItem(this.USERS_KEY, JSON.stringify(arr)); } catch { }
    },
    getActiveId() {
        return localStorage.getItem(this.ACTIVE_KEY) || null;
    },
    setActiveId(id) {
        if (id) localStorage.setItem(this.ACTIVE_KEY, id);
        else localStorage.removeItem(this.ACTIVE_KEY);
    }
};

/* ════════════════════════════════
   APP 开关
════════════════════════════════ */
function openChatApp() {
    const el = document.getElementById('chatApp');
    el.classList.remove('hidden');
    el.style.animation = '';
    void el.offsetWidth;
    el.style.animation = 'chatSlideIn 0.3s cubic-bezier(0.34,1.1,0.64,1)';
    chatSwitchTab('profile');
}

function closeChatApp() {
    const el = document.getElementById('chatApp');
    el.style.animation = 'chatSlideOut 0.22s ease forwards';
    setTimeout(() => { el.classList.add('hidden'); el.style.animation = ''; }, 220);
}

/* ════════════════════════════════
   Tab 切换
════════════════════════════════ */
function chatSwitchTab(tab) {
    ['talk', 'feed', 'profile'].forEach(t => {
        document.getElementById(`chatPanel-${t}`).classList.toggle('hidden', t !== tab);
        document.getElementById(`chatDock-${t}`).classList.toggle('chat-dock-active', t === tab);
    });
    if (tab === 'profile') chatRenderProfile();
}

/* ════════════════════════════════
   个人主页渲染
════════════════════════════════ */
function chatRenderProfile() {
    const p = ChatStore.getProfile();

    /* Banner */
    const bannerImg = document.getElementById('cpBannerImg');
    const bannerPH = document.getElementById('cpBannerPH');
    if (p.banner) {
        bannerImg.src = p.banner;
        bannerImg.classList.remove('hidden');
        bannerPH.classList.add('hidden');
    } else {
        bannerImg.classList.add('hidden');
        bannerPH.classList.remove('hidden');
    }

    /* 头像 */
    const avatarImg = document.getElementById('cpAvatarImg');
    const avatarPH = document.getElementById('cpAvatarPH');
    if (p.avatar) {
        avatarImg.src = p.avatar;
        avatarImg.classList.remove('hidden');
        avatarPH.classList.add('hidden');
    } else {
        avatarImg.classList.add('hidden');
        avatarPH.classList.remove('hidden');
    }

    /* 昵称 / 简介 */
    const nn = document.getElementById('cpNickname');
    const bio = document.getElementById('cpBio');
    nn.textContent = p.nickname || '';
    bio.textContent = p.bio || '';
}

/* ── Banner 上传 ── */
function cpTriggerBanner() {
    document.getElementById('cpBannerInput').click();
}
function cpHandleBanner(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        const p = ChatStore.getProfile();
        p.banner = ev.target.result;
        ChatStore.saveProfile(p);
        chatRenderProfile();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

/* ── 头像上传 ── */
function cpTriggerAvatar() {
    document.getElementById('cpAvatarInput').click();
}
function cpHandleAvatar(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        const p = ChatStore.getProfile();
        p.avatar = ev.target.result;
        ChatStore.saveProfile(p);
        chatRenderProfile();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

/* ── 昵称 / 简介 实时保存 ── */
function cpBlurNickname() {
    const p = ChatStore.getProfile();
    p.nickname = document.getElementById('cpNickname').textContent.trim();
    ChatStore.saveProfile(p);
}
function cpBlurBio() {
    const p = ChatStore.getProfile();
    p.bio = document.getElementById('cpBio').textContent.trim();
    ChatStore.saveProfile(p);
}

/* ════════════════════════════════
   User 身份 浮层
════════════════════════════════ */
let cuEditingId = null;   // null = 新建
let cuAvatarData = null;   // base64
let cuGender = '';

function openUserIdentity() {
    cuEditingId = null;
    cuAvatarData = null;
    cuGender = '';
    _cuResetForm();
    const sheet = document.getElementById('cuSheet');
    sheet.classList.remove('hidden');
    sheet.style.animation = '';
    void sheet.offsetWidth;
    sheet.style.animation = 'cuSlideIn 0.28s cubic-bezier(0.34,1.1,0.64,1)';
    cuRenderUserList();
}

function closeUserIdentity() {
    const sheet = document.getElementById('cuSheet');
    sheet.style.animation = 'cuSlideOut 0.22s ease forwards';
    setTimeout(() => { sheet.classList.add('hidden'); sheet.style.animation = ''; }, 220);
}

function _cuResetForm() {
    cuAvatarData = null; cuGender = '';
    const img = document.getElementById('cuAvatarImg');
    const ph = document.getElementById('cuAvatarPH');
    img.classList.add('hidden'); ph.classList.remove('hidden');
    document.getElementById('cuAge').value = '';
    document.getElementById('cuOriginCountry').value = '';
    document.getElementById('cuOriginCity').value = '';
    document.getElementById('cuBio').value = '';
    document.querySelectorAll('.cu-gender-btn').forEach(b => b.classList.remove('cu-gender-active'));
    cuUpdateCityOptions();
}

/* ── 头像 ── */
function cuTriggerAvatar() {
    document.getElementById('cuAvatarInput').click();
}
function cuHandleAvatar(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        cuAvatarData = ev.target.result;
        const img = document.getElementById('cuAvatarImg');
        const ph = document.getElementById('cuAvatarPH');
        img.src = cuAvatarData;
        img.classList.remove('hidden');
        ph.classList.add('hidden');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
}

/* ── 性别 ── */
function cuSetGender(g, btn) {
    cuGender = g;
    document.querySelectorAll('.cu-gender-btn').forEach(b => b.classList.remove('cu-gender-active'));
    btn.classList.add('cu-gender-active');
}

/* ── 出生地城市联动 ── */
const CU_CITIES = {
    '中国': ['北京', '上海', '广州', '深圳', '成都', '重庆', '杭州', '武汉', '南京', '西安', '天津', '苏州', '长沙', '郑州', '青岛', '厦门', '沈阳', '哈尔滨', '昆明', '大连', '宁波', '合肥', '济南', '福州', '兰州', '太原', '南宁', '贵阳', '乌鲁木齐', '拉萨', '呼和浩特', '海口', '三亚', '其他'],
    '日本': ['东京', '大阪', '京都', '横滨', '名古屋', '神户', '福冈', '札幌', '仙台', '广岛', '奈良', '长崎', '冲绳', '其他'],
    '韩国': ['首尔', '釜山', '仁川', '大邱', '大田', '光州', '济州岛', '水原', '其他'],
    '美国': ['纽约', '洛杉矶', '芝加哥', '旧金山', '西雅图', '波士顿', '迈阿密', '拉斯维加斯', '华盛顿特区', '休斯顿', '其他'],
    '英国': ['伦敦', '曼彻斯特', '伯明翰', '爱丁堡', '利物浦', '布里斯托', '其他'],
    '法国': ['巴黎', '里昂', '马赛', '波尔多', '尼斯', '图卢兹', '其他'],
    '德国': ['柏林', '慕尼黑', '汉堡', '法兰克福', '科隆', '杜塞尔多夫', '其他'],
    '意大利': ['罗马', '米兰', '威尼斯', '佛罗伦萨', '那不勒斯', '都灵', '其他'],
    '西班牙': ['马德里', '巴塞罗那', '塞维利亚', '瓦伦西亚', '毕尔巴鄂', '其他'],
    '澳大利亚': ['悉尼', '墨尔本', '布里斯班', '珀斯', '阿德莱德', '堪培拉', '其他'],
    '加拿大': ['多伦多', '温哥华', '蒙特利尔', '卡尔加里', '渥太华', '其他'],
    '新加坡': ['新加坡'],
    '泰国': ['曼谷', '清迈', '普吉', '芭提雅', '其他'],
    '越南': ['河内', '胡志明市', '岘港', '其他'],
    '马来西亚': ['吉隆坡', '槟城', '新山', '其他'],
    '印度': ['孟买', '新德里', '班加罗尔', '钦奈', '加尔各答', '其他'],
    '巴西': ['圣保罗', '里约热内卢', '巴西利亚', '其他'],
    '阿根廷': ['布宜诺斯艾利斯', '科尔多瓦', '其他'],
    '俄罗斯': ['莫斯科', '圣彼得堡', '叶卡捷琳堡', '其他'],
    '土耳其': ['伊斯坦布尔', '安卡拉', '伊兹密尔', '其他'],
    '埃及': ['开罗', '亚历山大', '其他'],
    '南非': ['约翰内斯堡', '开普敦', '德班', '其他'],
    '墨西哥': ['墨西哥城', '瓜达拉哈拉', '蒙特雷', '其他'],
    '其他国家/地区': ['其他']
};

function cuUpdateCityOptions() {
    const country = document.getElementById('cuOriginCountry').value;
    const cityEl = document.getElementById('cuOriginCity');
    const cities = CU_CITIES[country] || [];
    cityEl.innerHTML = '<option value="">— 请选择城市 —</option>' +
        cities.map(c => `<option value="${c}">${c}</option>`).join('');
}

/* ── 保存 ── */
function cuSaveUser() {
    const name = document.getElementById('cuNickname').value.trim() ||
        document.getElementById('cpNickname').textContent.trim() ||
        '未命名';
    const age = document.getElementById('cuAge').value.trim();
    const country = document.getElementById('cuOriginCountry').value;
    const city = document.getElementById('cuOriginCity').value;
    const bio = document.getElementById('cuBio').value.trim();

    const users = ChatStore.getUsers();

    if (cuEditingId) {
        const u = users.find(x => x.id === cuEditingId);
        if (u) {
            u.name = name; u.gender = cuGender;
            u.age = age; u.country = country; u.city = city;
            u.bio = bio;
            if (cuAvatarData) u.avatar = cuAvatarData;
        }
    } else {
        const u = {
            id: 'u_' + Date.now(),
            name, gender: cuGender,
            age, country, city, bio,
            avatar: cuAvatarData || null,
            createdAt: Date.now()
        };
        users.push(u);
        /* 如果是第一个，自动激活 */
        if (users.length === 1) ChatStore.setActiveId(u.id);
    }

    ChatStore.saveUsers(users);
    _cuResetForm();
    cuEditingId = null;
    cuRenderUserList();
    _cuShowToast('保存成功');
}

function _cuShowToast(msg) {
    const t = document.getElementById('cuToast');
    t.textContent = msg;
    t.classList.add('cu-toast-show');
    setTimeout(() => t.classList.remove('cu-toast-show'), 2000);
}

/* ── 渲染用户列表 ── */
function cuRenderUserList() {
    const users = ChatStore.getUsers();
    const activeId = ChatStore.getActiveId();
    const wrap = document.getElementById('cuUserList');
    const emptyEl = document.getElementById('cuUserListEmpty');
    const card = document.getElementById('cuListCard');

    if (users.length === 0) {
        card.classList.add('hidden');
        return;
    }
    card.classList.remove('hidden');
    emptyEl.classList.add('hidden');

    Array.from(wrap.children).forEach(c => {
        if (c.id !== 'cuUserListEmpty') c.remove();
    });

    users.forEach(u => {
        const isActive = u.id === activeId;
        const div = document.createElement('div');
        div.className = 'cu-user-item' + (isActive ? ' cu-user-active' : '');
        div.dataset.uid = u.id;

        const avatarHTML = u.avatar
            ? `<img src="${u.avatar}" alt="" />`
            : `<div class="cu-user-avatar-default"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#e4e4e2"/><circle cx="20" cy="15" r="7" fill="#c8c8c5"/><ellipse cx="20" cy="33" rx="12" ry="8" fill="#c8c8c5"/></svg></div>`;

        const sub = [u.gender, u.age ? u.age + '岁' : '', [u.country, u.city].filter(Boolean).join(' · ')].filter(Boolean).join(' · ');

        div.innerHTML = `
            <div class="cu-user-avatar">${avatarHTML}</div>
            <div class="cu-user-info">
                <div class="cu-user-name">${_cuEsc(u.name)}</div>
                <div class="cu-user-sub">${_cuEsc(sub) || '暂无信息'}</div>
            </div>
            ${isActive ? '<span class="cu-active-badge">当前</span>' : ''}
            <div class="cu-user-actions">
                <button class="cu-user-switch" onclick="event.stopPropagation();cuSwitchUser('${u.id}')">${isActive ? '已启用' : '切换'}</button>
                <button class="cu-user-del" onclick="event.stopPropagation();cuDeleteUser('${u.id}')" title="删除">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                    </svg>
                </button>
            </div>
        `;
        div.addEventListener('click', () => cuEditUser(u.id));
        wrap.appendChild(div);
    });
}

/* ── 切换激活用户 ── */
function cuSwitchUser(uid) {
    ChatStore.setActiveId(uid);
    cuRenderUserList();
    _cuShowToast('已切换身份');
}

/* ── 删除用户 ── */
function cuDeleteUser(uid) {
    if (!confirm('确定删除该身份？')) return;
    let users = ChatStore.getUsers();
    users = users.filter(u => u.id !== uid);
    ChatStore.saveUsers(users);
    if (ChatStore.getActiveId() === uid) {
        ChatStore.setActiveId(users.length ? users[0].id : null);
    }
    cuRenderUserList();
}

/* ── 编辑用户 ── */
function cuEditUser(uid) {
    const users = ChatStore.getUsers();
    const u = users.find(x => x.id === uid);
    if (!u) return;
    cuEditingId = uid;
    cuAvatarData = u.avatar || null;
    cuGender = u.gender || '';

    /* 填充头像 */
    const img = document.getElementById('cuAvatarImg');
    const ph = document.getElementById('cuAvatarPH');
    if (u.avatar) { img.src = u.avatar; img.classList.remove('hidden'); ph.classList.add('hidden'); }
    else { img.classList.add('hidden'); ph.classList.remove('hidden'); }

    /* 填充字段 */
    document.getElementById('cuNickname').value = u.name || '';
    document.getElementById('cuAge').value = u.age || '';
    document.getElementById('cuBio').value = u.bio || '';

    /* 性别 */
    document.querySelectorAll('.cu-gender-btn').forEach(b => {
        b.classList.toggle('cu-gender-active', b.dataset.gender === cuGender);
    });

    /* 国家 → 城市联动 */
    document.getElementById('cuOriginCountry').value = u.country || '';
    cuUpdateCityOptions();
    document.getElementById('cuOriginCity').value = u.city || '';

    /* 滚动到表单顶部 */
    document.getElementById('cuScroll').scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── 工具 ── */
function _cuEsc(str) {
    return String(str || '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── 姓名输入框（复用个人主页昵称或独立） ── */
/* 保存时优先取 cuNickname 输入 */
