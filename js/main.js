// الملف الرئيسي للتطبيق

// متغيرات عامة
let selectedDirectiveId = null;
let currentAssignmentCount = 1;

// بيانات الكيانات للمواقع والقنوات
let websiteEntities = {
    'الجزيرة نت': 'الإعلام المستقل',
    'العربية نت': 'السعودية',
    'بي بي سي عربي': 'الإعلام الدولي',
    'سكاي نيوز عربية': 'الإمارات',
    'فرانس 24': 'الإعلام الدولي',
    'الشرق الأوسط': 'السعودية',
    'سبأ نت': 'الحكومة',
    'وكالة سبأ للأنباء': 'الحكومة',
    'المسيرة نت': 'الحوثي',
    'الثورة نت': 'الحوثي',
    'المسيرة': 'الحوثي',
    'عدن تايم': 'الانتقالي',
    'عدن الغد': 'الانتقالي',
    'الأيام نت': 'الإعلام المستقل اليمني',
    'نشوان نيوز': 'الإعلام المستقل اليمني'
};

let tvEntities = {
    'الجزيرة': 'الإعلام المستقل',
    'العربية': 'السعودية',
    'بي بي سي عربي': 'الإعلام الدولي',
    'سكاي نيوز عربية': 'الإمارات',
    'فرانس 24': 'الإعلام الدولي',
    'الحدث': 'السعودية',
    'اليمن اليوم': 'الحكومة',
    'قناة اليمن': 'الحكومة',
    'سهيل': 'الحكومة',
    'المسيرة': 'الحوثي',
    'الحوثي': 'الحوثي',
    'يمن شباب': 'الحوثي',
    'عدن': 'الانتقالي',
    'الغد المشرق': 'الانتقالي',
    'بلقيس': 'الإعلام المستقل اليمني'
};

// دوال إدارة النوافذ المنبثقة
let currentOpenModal = null;

function showModal(modalId) {
    // إغلاق أي نافذة مفتوحة حالياً
    if (currentOpenModal) {
        closeModal(currentOpenModal);
    }
    
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    
    if (modal && overlay) {
        overlay.style.display = 'block';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        currentOpenModal = modalId;
        
        // إضافة مستمع للنقر خارج النافذة لإغلاقها
        overlay.onclick = function(event) {
            if (event.target === overlay) {
                closeModal(modalId);
            }
        };
        
        // إضافة مستمع لمفتاح Escape لإغلاق النافذة
        document.addEventListener('keydown', function escapeHandler(event) {
            if (event.key === 'Escape') {
                closeModal(modalId);
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentOpenModal = null;
        
        // إزالة مستمع النقر خارج النافذة
        overlay.onclick = null;
    }
}

// دالة إغلاق جميع النوافذ المنبثقة
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    const overlay = document.getElementById('overlay');
    
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    document.body.style.overflow = 'auto';
    currentOpenModal = null;
}

// دالة إظهار نموذج الموجه
function showDirectiveForm() {
    showModal('directiveModal');
}

// دالة إظهار صندوق الوارد
function showInbox() {
    showModal('inboxModal');
    loadInboxContent();
}

// دالة تحميل محتوى صندوق الوارد
function loadInboxContent() {
    const inboxContent = document.getElementById('inboxContent');
    if (!inboxContent) return;
    
    // قراءة التكاليف من localStorage
    const directorInbox = JSON.parse(localStorage.getItem('directorInbox') || '[]');
    
    if (directorInbox.length === 0) {
        inboxContent.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h3>لا توجد تكاليف في صندوق الوارد</h3>
                <p>سيتم عرض التكاليف المرسلة من مسؤولي المسارات هنا</p>
            </div>
        `;
        return;
    }
    
    // ترتيب التكاليف حسب التاريخ (الأحدث أولاً)
    directorInbox.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    inboxContent.innerHTML = directorInbox.map(assignment => `
        <div class="notification-item">
            <div class="notification-header">
                <span class="notification-source">${assignment.title}</span>
                <span class="notification-time">${new Date(assignment.timestamp).toLocaleString('ar-SA')}</span>
                <span class="assignment-badge" style="background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 12px; font-size: 12px;">تكليف</span>
            </div>
            <div class="notification-content">${assignment.content}</div>
            <div class="assignment-details" style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <div style="margin-bottom: 8px;"><strong>الجهة المنفذة:</strong> ${assignment.details.executingEntity}</div>
                <div style="margin-bottom: 8px;"><strong>زمن التنفيذ:</strong> ${new Date(assignment.details.executionTime).toLocaleString('ar-SA')}</div>
                <div style="margin-bottom: 8px;"><strong>مستوى النشر:</strong> ${assignment.details.publishLevel}</div>
                <div style="margin-bottom: 8px;"><strong>نوع الوسيلة:</strong> ${assignment.details.mediaType}</div>
                <div style="margin-bottom: 8px;"><strong>الوسيلة:</strong> ${assignment.details.specificMedia}</div>
                <div><strong>المسار:</strong> ${assignment.details.path}</div>
            </div>
            <div class="notification-actions">
                <button class="notification-btn approve-btn" onclick="approveAssignment('${assignment.id}', this)">إقرار التكليف ✅</button>
                <button class="notification-btn reject-btn" onclick="rejectAssignment('${assignment.id}', this)">رفض التكليف ❌</button>
                <button class="notification-btn consult-btn" onclick="requestAssignmentModification('${assignment.id}', this)">طلب تعديل ⚠️</button>
            </div>
        </div>
    `).join('');
}

// دالة إقرار التكليف
function approveAssignment(assignmentId, buttonElement) {
    // إزالة التكليف من صندوق الوارد
    let directorInbox = JSON.parse(localStorage.getItem('directorInbox') || '[]');
    directorInbox = directorInbox.filter(assignment => assignment.id !== assignmentId);
    localStorage.setItem('directorInbox', JSON.stringify(directorInbox));
    
    // إضافة إلى التكاليف المعتمدة
    const approvedAssignments = JSON.parse(localStorage.getItem('approvedAssignments') || '[]');
    const assignment = JSON.parse(localStorage.getItem('directorInbox') || '[]').find(a => a.id === assignmentId);
    if (assignment) {
        assignment.status = 'approved';
        assignment.approvedAt = new Date().toISOString();
        approvedAssignments.push(assignment);
        localStorage.setItem('approvedAssignments', JSON.stringify(approvedAssignments));
    }
    
    // تحديث الواجهة
    buttonElement.parentElement.innerHTML = '<span style="color: #28a745; font-weight: bold;">✅ تم إقرار التكليف</span>';
    showNotification('تم إقرار التكليف بنجاح');
    
    // تحديث الإحصائيات
    updateStats();
}

// دالة رفض التكليف
function rejectAssignment(assignmentId, buttonElement) {
    // إزالة التكليف من صندوق الوارد
    let directorInbox = JSON.parse(localStorage.getItem('directorInbox') || '[]');
    directorInbox = directorInbox.filter(assignment => assignment.id !== assignmentId);
    localStorage.setItem('directorInbox', JSON.stringify(directorInbox));
    
    // تحديث الواجهة
    buttonElement.parentElement.innerHTML = '<span style="color: #dc3545; font-weight: bold;">❌ تم رفض التكليف</span>';
    showNotification('تم رفض التكليف');
    
    // تحديث الإحصائيات
    updateStats();
}

// دالة طلب تعديل التكليف
function requestAssignmentModification(assignmentId, buttonElement) {
    const reason = prompt('أدخل سبب طلب التعديل:');
    if (reason) {
        // إزالة التكليف من صندوق الوارد
        let directorInbox = JSON.parse(localStorage.getItem('directorInbox') || '[]');
        directorInbox = directorInbox.filter(assignment => assignment.id !== assignmentId);
        localStorage.setItem('directorInbox', JSON.stringify(directorInbox));
        
        // تحديث الواجهة
        buttonElement.parentElement.innerHTML = `<span style="color: #ffc107; font-weight: bold;">⚠️ تم طلب التعديل: ${reason}</span>`;
        showNotification('تم إرسال طلب التعديل');
        
        // تحديث الإحصائيات
        updateStats();
    }
}

// دالة تحديث الإحصائيات
function updateStats() {
    const directorInbox = JSON.parse(localStorage.getItem('directorInbox') || '[]');
    const approvedAssignments = JSON.parse(localStorage.getItem('approvedAssignments') || '[]');
    const monitoringData = JSON.parse(localStorage.getItem('monitoringData') || '[]');
    
    // تحديث عدد الموجهات المعلقة
    const pendingElement = document.getElementById('pendingDirectives');
    if (pendingElement) {
        pendingElement.textContent = directorInbox.length;
    }
    
    // تحديث عدد الموجهات المعتمدة
    const approvedElement = document.getElementById('approvedDirectives');
    if (approvedElement) {
        approvedElement.textContent = approvedAssignments.length;
    }
    
    // تحديث عدد التقارير الجديدة
    const reportsElement = document.getElementById('newReports');
    if (reportsElement) {
        reportsElement.textContent = monitoringData.length;
    }
}

// دالة إظهار التقارير
function showReports() {
    alert('ميزة عرض التقارير قيد التطوير');
}

// دالة إدارة التبويبات
function showTab(tabName) {
    // إخفاء جميع محتويات التبويبات
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // إزالة الفئة النشطة من جميع أزرار التبويبات
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // إظهار التبويب المحدد
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // تفعيل زر التبويب المحدد
    const selectedButton = event.target;
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// دالة إنشاء معرف فريد
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// دالة تنسيق التاريخ
function formatDate(date) {
    return new Date(date).toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// إعداد مستمعي الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إغلاق النوافذ المنبثقة عند النقر على الخلفية
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                }
            });
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // منع إغلاق النافذة عند النقر على المحتوى
    const modalContents = document.querySelectorAll('.modal-content');
    modalContents.forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // تحديث الإحصائيات عند تحميل الصفحة
    updateStats();
});


// دوال المحلل الجديدة

// متغيرات المحلل
let filteredMonitoringData = [];
let allEntities = [];

// دالة تحميل بيانات الرصد للمحلل
function loadMonitoringData() {
    const monitoringData = JSON.parse(localStorage.getItem("monitoringData") || "[]");
    if (monitoringData.length === 0) {
        // إضافة بيانات وهمية لأغراض الاختبار إذا كانت البيانات فارغة
        const dummyData = [
            {
                id: "1",
                type: "social",
                priority: "عالي",
                date: "2025-08-26",
                entity: "فيسبوك",
                path: "الاجتماعي",
                publishLevel: "عام",
                content: "منشور حول ارتفاع أسعار السلع الأساسية.",
                sourceLink: "#"
            },
            {
                id: "2",
                type: "web",
                priority: "متوسط",
                date: "2025-08-25",
                entity: "الجزيرة نت",
                path: "السياسي",
                publishLevel: "خاص",
                content: "تحليل سياسي حول التطورات الإقليمية.",
                sourceLink: "#"
            },
            {
                id: "3",
                type: "tv",
                priority: "منخفض",
                date: "2025-08-24",
                entity: "قناة اليمن",
                path: "الثقافي",
                publishLevel: "عام",
                content: "برنامج وثائقي عن التراث اليمني.",
                sourceLink: "#"
            }
        ];
        localStorage.setItem("monitoringData", JSON.stringify(dummyData));
        filteredMonitoringData = [...dummyData];
    } else {
        filteredMonitoringData = [...monitoringData];
    }
    
    // استخراج جميع الكيانات الفريدة
    allEntities = [...new Set(monitoringData.map(item => item.entity).filter(entity => entity))];
    
    // تحديث قائمة الكيانات في الفلتر
    updateEntityFilterOptions();
    
    // عرض البيانات
    displayMonitoringData(filteredMonitoringData);
}

// دالة تحديث خيارات فلتر الكيانات
function updateEntityFilterOptions() {
    const entityFilter = document.getElementById('analystEntityFilter');
    if (!entityFilter) return;
    
    // الاحتفاظ بالقيمة المحددة حالياً
    const currentValue = entityFilter.value;
    
    // مسح الخيارات الحالية (عدا الخيار الأول)
    entityFilter.innerHTML = '<option value="">جميع الكيانات</option>';
    
    // إضافة الكيانات الفريدة
    allEntities.forEach(entity => {
        const option = document.createElement('option');
        option.value = entity;
        option.textContent = entity;
        entityFilter.appendChild(option);
    });
    
    // استعادة القيمة المحددة
    if (currentValue) {
        entityFilter.value = currentValue;
    }
}

// دالة فلترة بيانات الرصد
function filterMonitoringData() {
    const dateFilter = document.getElementById('analystDateFilter').value;
    const entityFilter = document.getElementById('analystEntityFilter').value;
    const typeFilter = document.getElementById('analystTypeFilter').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    // إظهار/إخفاء حقول التاريخ المخصص
    const customDateRange = document.getElementById('customDateRange');
    if (dateFilter === 'custom') {
        customDateRange.style.display = 'block';
    } else {
        customDateRange.style.display = 'none';
    }
    
    const monitoringData = JSON.parse(localStorage.getItem('monitoringData') || '[]');
    let filtered = [...monitoringData];
    
    // فلترة حسب التاريخ
    if (dateFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(item => item.date === today);
    } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(item => new Date(item.date) >= weekAgo);
    } else if (dateFilter === 'custom' && dateFrom && dateTo) {
        filtered = filtered.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= new Date(dateFrom) && itemDate <= new Date(dateTo);
        });
    }
    
    // فلترة حسب الكيان
    if (entityFilter) {
        filtered = filtered.filter(item => item.entity === entityFilter);
    }
    
    // فلترة حسب نوع الرصد
    if (typeFilter) {
        filtered = filtered.filter(item => item.type === typeFilter);
    }
    
    filteredMonitoringData = filtered;
    displayMonitoringData(filteredMonitoringData);
}

// دالة عرض بيانات الرصد
function displayMonitoringData(data) {
    const dataList = document.getElementById('monitoringDataList');
    if (!dataList) return;
    
    if (data.length === 0) {
        dataList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h4>لا توجد بيانات مرصودة</h4>
                <p>لا توجد بيانات تطابق معايير البحث المحددة</p>
            </div>
        `;
        return;
    }
    
    dataList.innerHTML = data.map(item => createMonitoringItemHTML(item)).join('');
}

// دالة إنشاء HTML لعنصر الرصد
function createMonitoringItemHTML(item) {
    const typeLabels = {
        'social': 'شبكات اجتماعية',
        'web': 'مواقع إلكترونية',
        'tv': 'قنوات تلفزيونية'
    };
    
    const priorityColors = {
        'عالي': '#dc3545',
        'متوسط': '#ffc107',
        'منخفض': '#28a745'
    };
    
    return `
        <div class="monitoring-item" style="background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div>
                    <span class="monitoring-type" style="background: #667eea; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; margin-left: 10px;">
                        ${typeLabels[item.type] || item.type}
                    </span>
                    <span class="monitoring-priority" style="background: ${priorityColors[item.priority] || '#6c757d'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
                        ${item.priority || 'غير محدد'}
                    </span>
                </div>
                <span class="monitoring-date" style="color: #6c757d; font-size: 12px;">
                    ${formatDate(item.date)}
                </span>
            </div>
            
            <div class="monitoring-details">
                <h5 style="margin: 0 0 8px 0; color: #333;">
                    ${item.title || item.account || item.site || item.channel || 'بدون عنوان'}
                </h5>
                ${item.entity ? `<p style="margin: 0 0 5px 0; color: #666; font-size: 14px;"><strong>الكيان:</strong> ${item.entity}</p>` : ''}
                ${item.path ? `<p style="margin: 0 0 5px 0; color: #666; font-size: 14px;"><strong>المسار:</strong> ${item.path}</p>` : ''}
                ${item.publishLevel ? `<p style="margin: 0 0 5px 0; color: #666; font-size: 14px;"><strong>مستوى النشر:</strong> ${item.publishLevel}</p>` : ''}
                <p style="margin: 8px 0 0 0; color: #495057; line-height: 1.5;">
                    ${item.content ? item.content.substring(0, 200) + (item.content.length > 200 ? '...' : '') : 'لا يوجد محتوى'}
                </p>
            </div>
            
            <div style="margin-top: 10px; display: flex; gap: 10px;">
                <button onclick="viewFullContent('${item.id}')" class="view-btn" style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    عرض كامل
                </button>
                ${item.link ? `<a href="${item.link}" target="_blank" style="background: #28a745; color: white; text-decoration: none; padding: 6px 12px; border-radius: 4px; font-size: 12px;">رابط المصدر</a>` : ''}
            </div>
        </div>
    `;
}

// دالة عرض المحتوى الكامل
function viewFullContent(itemId) {
    const monitoringData = JSON.parse(localStorage.getItem('monitoringData') || '[]');
    const item = monitoringData.find(data => data.id === itemId);
    
    if (!item) {
        showNotification('لم يتم العثور على البيانات', 'error');
        return;
    }
    
    // إنشاء نافذة منبثقة لعرض المحتوى الكامل
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>المحتوى الكامل</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 15px;">
                    <strong>النوع:</strong> ${item.type === 'social' ? 'شبكات اجتماعية' : item.type === 'web' ? 'مواقع إلكترونية' : 'قنوات تلفزيونية'}
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>التاريخ:</strong> ${formatDate(item.date)}
                </div>
                ${item.entity ? `<div style="margin-bottom: 15px;"><strong>الكيان:</strong> ${item.entity}</div>` : ''}
                ${item.title ? `<div style="margin-bottom: 15px;"><strong>العنوان:</strong> ${item.title}</div>` : ''}
                <div style="margin-bottom: 15px;">
                    <strong>المحتوى:</strong>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 8px; line-height: 1.6;">
                        ${item.content || 'لا يوجد محتوى'}
                    </div>
                </div>
                ${item.link ? `<div style="margin-bottom: 15px;"><strong>الرابط:</strong> <a href="${item.link}" target="_blank">${item.link}</a></div>` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إضافة مستمع لإغلاق النافذة عند النقر خارجها
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// دالة حفظ التحليل
function saveAnalysis() {
    const analysisText = document.getElementById('analysisText').value.trim();
    const recommendationsText = document.getElementById('recommendationsText').value.trim();
    
    if (!analysisText && !recommendationsText) {
        showNotification('يرجى إدخال التحليل أو التوصيات على الأقل', 'error');
        return;
    }
    
    const analysis = {
        id: generateId(),
        analysisText: analysisText,
        recommendations: recommendationsText,
        timestamp: new Date().toISOString(),
        analyst: currentUser ? currentUser.name : 'المحلل',
        dataCount: filteredMonitoringData.length
    };
    
    // حفظ التحليل
    const analyses = JSON.parse(localStorage.getItem('analyses') || '[]');
    analyses.push(analysis);
    localStorage.setItem('analyses', JSON.stringify(analyses));
    
    showNotification('تم حفظ التحليل بنجاح');
    
    // مسح الحقول
    clearAnalysis();
}

// دالة مسح حقول التحليل
function clearAnalysis() {
    document.getElementById('analysisText').value = '';
    document.getElementById('recommendationsText').value = '';
}

// دالة عرض التحليلات المحفوظة
function showMyAnalyses() {
    const analyses = JSON.parse(localStorage.getItem('analyses') || '[]');
    
    if (analyses.length === 0) {
        showNotification('لا توجد تحليلات محفوظة');
        return;
    }
    
    // إنشاء نافذة منبثقة لعرض التحليلات
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h3>التحليلات المحفوظة</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                ${analyses.map(analysis => `
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <strong>تحليل ${formatDate(analysis.timestamp)}</strong>
                            <span style="color: #666; font-size: 12px;">عدد البيانات المحللة: ${analysis.dataCount}</span>
                        </div>
                        ${analysis.analysisText ? `
                            <div style="margin-bottom: 10px;">
                                <strong>التحليل:</strong>
                                <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 5px;">
                                    ${analysis.analysisText}
                                </div>
                            </div>
                        ` : ''}
                        ${analysis.recommendations ? `
                            <div>
                                <strong>التوصيات:</strong>
                                <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 5px;">
                                    ${analysis.recommendations}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إضافة مستمع لإغلاق النافذة عند النقر خارجها
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// دالة عرض الموجهات (تحديث الدالة الموجودة)
function showDirectives() {
    if (!currentUser || currentUser.role !== 'analyst') {
        showNotification('غير مصرح لك بهذا الإجراء', 'error');
        return;
    }
    
    // يمكن تطوير هذه الدالة لاحقاً لعرض الموجهات المرسلة للمحلل
    showNotification('ميزة عرض الموجهات قيد التطوير');
}

