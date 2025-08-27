// نظام المصادقة وإدارة المستخدمين

// بيانات المستخدمين والصلاحيات
const users = {
    'director': {
        password: '123',
        role: 'director',
        name: 'قيادة الدائرة',
        dashboard: 'directorDashboard',
        modules: ['social', 'web', 'tv', 'analysis', 'production', 'publishing', 'political', 'directives', 'consultations']
    },
    'social': {
        password: '123',
        role: 'social_monitor',
        name: 'راصد الشبكات الاجتماعية',
        dashboard: 'socialDashboard',
        modules: ['social']
    },
    'web': {
        password: '123',
        role: 'web_monitor',
        name: 'راصد المواقع الإلكترونية',
        dashboard: 'webDashboard',
        modules: ['web']
    },
    'tv': {
        password: '123',
        role: 'tv_monitor',
        name: 'راصد القنوات التلفزيونية',
        dashboard: 'tvDashboard',
        modules: ['tv']
    },
    'analyst': {
        password: '123',
        role: 'analyst',
        name: 'المحلل',
        dashboard: 'analystDashboard',
        modules: ['analysis']
    },
    // مسؤولو المسارات الخمسة
    'political_path': {
        password: '123',
        role: 'path_manager',
        name: 'مسؤول المسار السياسي',
        dashboard: 'pathManagerDashboard',
        path: 'السياسي',
        modules: ['path_management']
    },
    'cultural_path': {
        password: '123',
        role: 'path_manager',
        name: 'مسؤول المسار الثقافي',
        dashboard: 'pathManagerDashboard',
        path: 'الثقافي',
        modules: ['path_management']
    },
    'social_path': {
        password: '123',
        role: 'path_manager',
        name: 'مسؤول المسار الاجتماعي',
        dashboard: 'pathManagerDashboard',
        path: 'الاجتماعي',
        modules: ['path_management']
    },
    'propaganda_path': {
        password: '123',
        role: 'path_manager',
        name: 'مسؤول المسار الدعائي',
        dashboard: 'pathManagerDashboard',
        path: 'الدعائي',
        modules: ['path_management']
    },
    'international_path': {
        password: '123',
        role: 'path_manager',
        name: 'مسؤول المسار الدولي',
        dashboard: 'pathManagerDashboard',
        path: 'الدولي',
        modules: ['path_management']
    }
};

// متغير المستخدم الحالي
let currentUser = null;

// إعدادات الإشعارات
let notificationSettings = {
    showWelcomeMessage: localStorage.getItem('showWelcomeMessage') !== 'false',
    welcomeDuration: 2000
};

// دالة تسجيل الدخول
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        currentUser = users[username];
        
        // إخفاء نموذج تسجيل الدخول
        document.getElementById('loginContainer').style.display = 'none';
        
        // إظهار لوحة التحكم المناسبة
        document.getElementById(users[username].dashboard).style.display = 'block';
        
        // تحديث عنوان لوحة التحكم لمسؤولي المسارات
        if (users[username].role === 'path_manager') {
            const titleElement = document.getElementById('pathManagerTitle');
            if (titleElement) {
                titleElement.textContent = users[username].name;
            }
        }
        
        // تحميل البيانات المناسبة حسب نوع المستخدم
        loadUserData(username);
        
        // عرض إشعار الترحيب إذا كان مفعلاً
        if (notificationSettings.showWelcomeMessage) {
            showNotification(`مرحباً ${users[username].name}`, 'success', notificationSettings.welcomeDuration);
        }
    } else {
        showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
    }
}

// دالة تحميل بيانات المستخدم
function loadUserData(username) {
    const user = users[username];
    
    switch(user.role) {
        case 'director':
            loadNotifications();
            updateStats();
            break;
        case 'analyst':
            loadMonitoringData();
            break;
        case 'path_manager':
            loadPathDirectives(user.path);
            updateAssignmentPublishLevelOptions();
            break;
        case 'social_monitor':
        case 'web_monitor':
        case 'tv_monitor':
            updatePublishLevelOptions();
            updateFileOptions();
            updateIssueOptions();
            break;
    }
}

// دالة تسجيل الخروج
function logout() {
    currentUser = null;
    
    // إخفاء جميع لوحات التحكم
    const dashboards = document.querySelectorAll('.dashboard');
    dashboards.forEach(dashboard => {
        dashboard.style.display = 'none';
    });
    
    // إظهار نموذج تسجيل الدخول
    document.getElementById('loginContainer').style.display = 'block';
    
    // مسح النماذج
    document.getElementById('loginForm').reset();
    
    showNotification('تم تسجيل الخروج بنجاح');
}

// دالة التحقق من الصلاحيات
function hasPermission(module) {
    if (!currentUser) return false;
    return currentUser.modules.includes(module);
}

// دالة عرض الإشعارات
function showNotification(message, type = 'success', duration = 2000) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : '#28a745'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    `;
    
    // إضافة نص الإشعار
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    notification.appendChild(messageSpan);
    
    // إضافة زر الإغلاق
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        padding: 0;
        margin: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
    `;
    
    // إضافة تأثير hover لزر الإغلاق
    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.backgroundColor = 'rgba(255,255,255,0.2)';
    });
    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.backgroundColor = 'transparent';
    });
    
    // وظيفة إغلاق الإشعار
    const closeNotification = () => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    };
    
    closeButton.addEventListener('click', closeNotification);
    notification.appendChild(closeButton);
    
    // إضافة الإشعار للصفحة
    document.body.appendChild(notification);
    
    // إزالة الإشعار تلقائياً بعد المدة المحددة
    setTimeout(closeNotification, duration);
}

// دالة تبديل إعدادات الإشعارات
function toggleWelcomeNotifications() {
    notificationSettings.showWelcomeMessage = !notificationSettings.showWelcomeMessage;
    localStorage.setItem('showWelcomeMessage', notificationSettings.showWelcomeMessage.toString());
    
    const message = notificationSettings.showWelcomeMessage 
        ? 'تم تفعيل إشعارات الترحيب' 
        : 'تم إلغاء إشعارات الترحيب';
    showNotification(message, 'success', 1500);
}

// إضافة أنماط CSS للإشعارات
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ربط دالة تسجيل الدخول بالنموذج
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
});

