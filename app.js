// Application Logic for Doshi Course Portal

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZtH3lXuu4IWzZg92u0m3HrNQ7pzcy1f4",
  authDomain: "khoa-hoc-11f6f.firebaseapp.com",
  projectId: "khoa-hoc-11f6f",
  storageBucket: "khoa-hoc-11f6f.firebasestorage.app",
  messagingSenderId: "899259078863",
  appId: "1:899259078863:web:dcbc7363c1627fba327fba"
};

let db = null;

function initFirebase() {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase Cloud Firestore initialized successfully!");
  } else {
    console.warn("Firebase SDK not loaded, falling back to LocalStorage.");
  }
}

// Dynamic state
let currentUser = null;
let currentLessonId = 1;
let completedLessons = [];
let commentsDb = {}; // Keyed by lessonId, stores array of comment objects
let offlineRegistrations = []; // Array of registration objects
let activeSidebarMode = 'online'; // 'online' (Technical), 'management' (Store Management), 'offline' (Offline courses)

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
  initFirebase();
  
  // Load data from Firebase Firestore if connected
  await loadModulesFromFirestore();
  await loadOfflineRegistrationsFromFirestore();
  await loadCommentsFromFirestore();
  await loadUsersFromFirestore();
  
  initModules();
  initUsers();
  checkAuth();
  initComments();
  initProgress();
  initOfflineRegistrations();
  
  // Event Listeners
  setupNavigation();
  setupAuthForm();
  setupCourseControls();
  setupOfflineLandingTabs();
  setupOfflineBookingModal();
  setupInstructorUserManagement();
  
  // Default Render
  renderLessonsList();
  selectLesson(currentLessonId);
  renderOfflineRegistrations();
});

// Load/Init mock users and register capability
function initUsers() {
  if (!localStorage.getItem('doshi_users')) {
    localStorage.setItem('doshi_users', JSON.stringify(window.DEFAULT_USERS));
  }
}

// Check current user session
function checkAuth() {
  const session = localStorage.getItem('doshi_current_user');
  const userNavInfo = document.getElementById('user-nav-info');
  const btnNavLogin = document.getElementById('btn-nav-login');
  
  if (session) {
    currentUser = JSON.parse(session);
    if (userNavInfo) {
      userNavInfo.querySelector('.user-display-name').textContent = currentUser.name;
      userNavInfo.querySelector('.user-avatar-circle').textContent = currentUser.avatar || currentUser.name.substring(0, 2).toUpperCase();
      userNavInfo.style.display = 'flex';
    }
    if (btnNavLogin) btnNavLogin.style.display = 'none';
    
    // Fill profile info in course view
    const courseUserAvatar = document.getElementById('course-user-avatar');
    const courseUserName = document.getElementById('course-user-name');
    const courseUserRole = document.getElementById('course-user-role');
    
    if (courseUserAvatar) courseUserAvatar.textContent = currentUser.avatar || currentUser.name.substring(0, 2).toUpperCase();
    if (courseUserName) courseUserName.textContent = currentUser.name;
    if (courseUserRole) {
      courseUserRole.textContent = currentUser.role === 'instructor' ? 'Giảng Viên' : currentUser.role === 'admin' ? 'Quản Trị Viên' : 'Học Viên';
    }

    // Auto-fill booking form fields
    const bookName = document.getElementById('book-name');
    const bookEmail = document.getElementById('book-email');
    if (bookName && !bookName.value) bookName.value = currentUser.name;
    if (bookEmail && !bookEmail.value) bookEmail.value = currentUser.email;

    // Toggle user management panel visibility
    const userPanel = document.getElementById('instructor-user-management-panel');
    const isTeacher = currentUser.role === 'instructor' || currentUser.role === 'admin';
    if (userPanel) {
      userPanel.style.display = isTeacher ? 'block' : 'none';
      if (isTeacher) {
        renderInstructorUsersList();
      }
    }

    // Show course dashboard
    showView('course');
  } else {
    currentUser = null;
    if (userNavInfo) userNavInfo.style.display = 'none';
    if (btnNavLogin) btnNavLogin.style.display = 'block';
    
    const userPanel = document.getElementById('instructor-user-management-panel');
    if (userPanel) userPanel.style.display = 'none';

    // Show landing page
    showView('landing');
  }
}

// Load comments from localStorage or defaults
function initComments() {
  const savedComments = localStorage.getItem('doshi_course_comments');
  if (savedComments) {
    commentsDb = JSON.parse(savedComments);
  } else {
    commentsDb = {};
    window.COURSE_MODULES.forEach(module => {
      commentsDb[module.id] = [...module.comments];
    });
    window.MANAGEMENT_MODULES.forEach(module => {
      commentsDb[module.id] = [...module.comments];
    });
    localStorage.setItem('doshi_course_comments', JSON.stringify(commentsDb));
  }
}

// Load progress tracker state
function initProgress() {
  const savedProgress = localStorage.getItem('doshi_completed_lessons');
  if (savedProgress) {
    completedLessons = JSON.parse(savedProgress);
  } else {
    completedLessons = [];
    localStorage.setItem('doshi_completed_lessons', JSON.stringify(completedLessons));
  }
  updateProgressBar();
}

// Load or Seed Offline Registrations
function initOfflineRegistrations() {
  const savedRegs = localStorage.getItem('doshi_offline_regs');
  if (savedRegs) {
    offlineRegistrations = JSON.parse(savedRegs);
  } else {
    // Default seed for testing
    offlineRegistrations = [
      {
        name: 'Nguyễn Văn Học Viên',
        phone: '0903427743',
        email: 'hocvien@doshi.vn',
        course: 'Thay đế & Khâu đế Giày thể thao',
        location: 'TP. Hồ Chí Minh',
        message: 'Tôi đăng ký tham gia lớp K12 khai giảng tháng 7.',
        status: 'Đang Chờ Xếp Lớp',
        date: '28/06/2026'
      }
    ];
    localStorage.setItem('doshi_offline_regs', JSON.stringify(offlineRegistrations));
  }
}

// Switch between views: landing, login, course
function showView(viewName) {
  const views = ['landing', 'login', 'course'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === viewName) {
        if (v === 'course') {
          el.style.display = 'grid';
        } else if (v === 'login') {
          el.style.display = 'flex';
        } else {
          el.style.display = 'block';
        }
        el.classList.add('view-active');
      } else {
        el.style.display = 'none';
        el.classList.remove('view-active');
      }
    }
  });

  // Toggle body overflow behavior for course viewer
  if (viewName === 'course') {
    document.body.classList.add('course-mode-active');
  } else {
    document.body.classList.remove('course-mode-active');
  }

  // Handle active navigation states
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.getAttribute('data-view') === viewName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update active state of online/offline navbar links
  const onlineNav = document.getElementById('nav-link-online');
  const managementNav = document.getElementById('nav-link-management');
  const offlineNav = document.getElementById('nav-link-offline');
  
  if (viewName === 'course') {
    if (activeSidebarMode === 'online') {
      if (onlineNav) onlineNav.classList.add('active');
      if (managementNav) managementNav.classList.remove('active');
      if (offlineNav) offlineNav.classList.remove('active');
    } else if (activeSidebarMode === 'management') {
      if (onlineNav) onlineNav.classList.remove('active');
      if (managementNav) managementNav.classList.add('active');
      if (offlineNav) offlineNav.classList.remove('active');
    } else {
      if (onlineNav) onlineNav.classList.remove('active');
      if (managementNav) managementNav.classList.remove('active');
      if (offlineNav) offlineNav.classList.add('active');
    }
  } else if (viewName === 'login') {
    const redirect = localStorage.getItem('doshi_login_redirect') || 'online';
    if (redirect === 'management') {
      if (onlineNav) onlineNav.classList.remove('active');
      if (managementNav) managementNav.classList.add('active');
      if (offlineNav) offlineNav.classList.remove('active');
    } else {
      if (onlineNav) onlineNav.classList.add('active');
      if (managementNav) managementNav.classList.remove('active');
      if (offlineNav) offlineNav.classList.remove('active');
    }
  } else {
    // Landing View handles active link styling natively
  }

  // Smooth scroll to top of view
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigate to Online Course Player (Technical)
function navigateToOnlineCourse() {
  if (!currentUser) {
    localStorage.setItem('doshi_login_redirect', 'online');
    showView('login');
  } else {
    showView('course');
    activeSidebarMode = 'online';
    
    // Select first lesson
    const firstLesson = window.COURSE_MODULES[0];
    if (firstLesson) {
      currentLessonId = firstLesson.id;
      renderLessonsList();
      selectLesson(currentLessonId);
    }
    
    const btnOnlineMode = document.getElementById('btn-sidebar-online');
    const btnMgtMode = document.getElementById('btn-sidebar-management');
    const btnOfflineMode = document.getElementById('btn-sidebar-offline');
    if (btnOnlineMode) btnOnlineMode.classList.add('active');
    if (btnMgtMode) btnMgtMode.classList.remove('active');
    if (btnOfflineMode) btnOfflineMode.classList.remove('active');

    const sidebarOnlineControls = document.getElementById('sidebar-online-controls');
    const sidebarOfflineControls = document.getElementById('sidebar-offline-controls');
    if (sidebarOnlineControls) sidebarOnlineControls.style.display = 'flex';
    if (sidebarOfflineControls) sidebarOfflineControls.style.display = 'none';

    const subviewOnlinePlayer = document.getElementById('subview-online-player');
    const subviewOfflineSchedule = document.getElementById('subview-offline-schedule');
    if (subviewOnlinePlayer) subviewOnlinePlayer.classList.add('active');
    if (subviewOfflineSchedule) subviewOfflineSchedule.classList.remove('active');
  }
}

// Navigate to Store Management Course Player
function navigateToManagementCourse() {
  if (!currentUser) {
    localStorage.setItem('doshi_login_redirect', 'management');
    showView('login');
  } else {
    showView('course');
    activeSidebarMode = 'management';
    
    // Select first lesson
    const firstLesson = window.MANAGEMENT_MODULES[0];
    if (firstLesson) {
      currentLessonId = firstLesson.id;
      renderLessonsList();
      selectLesson(currentLessonId);
    }
    
    const btnOnlineMode = document.getElementById('btn-sidebar-online');
    const btnMgtMode = document.getElementById('btn-sidebar-management');
    const btnOfflineMode = document.getElementById('btn-sidebar-offline');
    if (btnOnlineMode) btnOnlineMode.classList.remove('active');
    if (btnMgtMode) btnMgtMode.classList.add('active');
    if (btnOfflineMode) btnOfflineMode.classList.remove('active');

    const sidebarOnlineControls = document.getElementById('sidebar-online-controls');
    const sidebarOfflineControls = document.getElementById('sidebar-offline-controls');
    if (sidebarOnlineControls) sidebarOnlineControls.style.display = 'flex';
    if (sidebarOfflineControls) sidebarOfflineControls.style.display = 'none';

    const subviewOnlinePlayer = document.getElementById('subview-online-player');
    const subviewOfflineSchedule = document.getElementById('subview-offline-schedule');
    if (subviewOnlinePlayer) subviewOnlinePlayer.classList.add('active');
    if (subviewOfflineSchedule) subviewOfflineSchedule.classList.remove('active');
  }
}

// Navigate to Offline Landing Section
function navigateToOfflineLanding() {
  showView('landing');
  const tabOffline = document.getElementById('btn-tab-offline');
  if (tabOffline) {
    tabOffline.click();
    setTimeout(() => {
      const section = document.getElementById('section-curriculum');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}

// Event Listeners for Nav clicks
function setupNavigation() {
  // Mobile Hamburger Toggle
  const toggleBtn = document.getElementById('btn-nav-mobile-toggle');
  const navWrapper = document.querySelector('.nav-links-wrapper');
  
  if (toggleBtn && navWrapper) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navWrapper.classList.toggle('mobile-active');
    });
    
    // Close mobile dropdown menu when any action is clicked inside it
    navWrapper.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('.btn')) {
        navWrapper.classList.remove('mobile-active');
      }
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!navWrapper.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
        navWrapper.classList.remove('mobile-active');
      }
    });
  }

  // Navigation Links
  const navLinks = document.querySelectorAll('.nav-link[data-view]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.getAttribute('data-view');
      showView(view);
    });
  });

  // Split Navbar Online, Management & Offline links
  const onlineNav = document.getElementById('nav-link-online');
  if (onlineNav) {
    onlineNav.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToOnlineCourse();
    });
  }

  const managementNav = document.getElementById('nav-link-management');
  if (managementNav) {
    managementNav.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToManagementCourse();
    });
  }

  const offlineNav = document.getElementById('nav-link-offline');
  if (offlineNav) {
    offlineNav.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToOfflineLanding();
    });
  }

  // Header "Vào học ngay" button
  const btnNavLogin = document.getElementById('btn-nav-login');
  if (btnNavLogin) {
    btnNavLogin.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToOnlineCourse();
    });
  }

  // Logo Click -> Landing
  const logo = document.getElementById('nav-logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      showView('landing');
    });
  }

  // CTA Links - Online buttons
  const onlineCtaBtn = document.getElementById('btn-hero-online');
  if (onlineCtaBtn) {
    onlineCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToOnlineCourse();
    });
  }

  // Handle Landing Page Login triggers (both Technical and Management redirects)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-online-auth-trigger');
    if (trigger) {
      e.preventDefault();
      const target = trigger.getAttribute('data-redirect') || 'online';
      if (target === 'management') {
        navigateToManagementCourse();
      } else {
        navigateToOnlineCourse();
      }
    }
  });

  const promoOnlineBtn = document.getElementById('btn-promo-online');
  if (promoOnlineBtn) {
    promoOnlineBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToOnlineCourse();
    });
  }

  const footerOnlineBtn = document.getElementById('btn-footer-online');
  if (footerOnlineBtn) {
    footerOnlineBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToOnlineCourse();
    });
  }

  // Logout Trigger
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }

  const logoutBtnCourse = document.getElementById('course-btn-logout');
  if (logoutBtnCourse) {
    logoutBtnCourse.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
}

// Authentication Logic
function setupAuthForm() {
  const loginForm = document.getElementById('login-form');
  const loginErrorMsg = document.getElementById('login-error-msg');

  // Handle Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      const users = JSON.parse(localStorage.getItem('doshi_users')) || window.DEFAULT_USERS;
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      if (user) {
        // Save session
        localStorage.setItem('doshi_current_user', JSON.stringify(user));
        checkAuth();
        
        // Redirect check
        const redirect = localStorage.getItem('doshi_login_redirect') || 'online';
        localStorage.removeItem('doshi_login_redirect');
        
        if (redirect === 'management') {
          navigateToManagementCourse();
        } else {
          navigateToOnlineCourse();
        }
        
        // Reset form
        loginForm.reset();
        if (loginErrorMsg) loginErrorMsg.style.display = 'none';
        
        // Sync registration list inside workspace
        renderOfflineRegistrations();
      } else {
        if (loginErrorMsg) {
          loginErrorMsg.textContent = 'Email hoặc mật khẩu không chính xác!';
          loginErrorMsg.style.display = 'block';
        }
      }
    });
  }

}

// Log out user
function handleLogout() {
  localStorage.removeItem('doshi_current_user');
  checkAuth();
  showView('landing');
  
  // Hide user panel on logout
  const userPanel = document.getElementById('instructor-user-management-panel');
  if (userPanel) userPanel.style.display = 'none';
}

// Render the 8 modules in the sidebar list
// Render modules in the sidebar list (Dynamic between Technical and Store Management)
function renderLessonsList() {
  const listContainer = document.getElementById('course-playlist');
  if (!listContainer) return;

  listContainer.innerHTML = '';
  
  // Select array based on the active sidebar mode
  const modules = activeSidebarMode === 'management' ? window.MANAGEMENT_MODULES : window.COURSE_MODULES;

  modules.forEach((module, index) => {
    const isCompleted = completedLessons.includes(String(module.id));
    const isActive = String(module.id) === String(currentLessonId);
    const displayIndex = index + 1;
    
    const item = document.createElement('div');
    item.className = `playlist-item ${isActive ? 'active' : ''}`;
    item.setAttribute('data-id', module.id);
    
    item.innerHTML = `
      <div class="playlist-checkbox-wrapper">
        <input type="checkbox" class="lesson-check-box" data-id="${module.id}" ${isCompleted ? 'checked' : ''}>
      </div>
      <div class="playlist-info">
        <span class="playlist-index">Bài ${displayIndex}</span>
        <h4 class="playlist-title">${module.shortTitle}</h4>
        <span class="playlist-duration">⏱️ ${module.duration}</span>
      </div>
    `;
    
    // Select lesson when clicking info
    item.querySelector('.playlist-info').addEventListener('click', () => {
      selectLesson(module.id);
    });

    // Checkbox toggling
    item.querySelector('.lesson-check-box').addEventListener('change', (e) => {
      e.stopPropagation();
      toggleLessonCompleted(module.id, e.target.checked);
    });

    listContainer.appendChild(item);
  });
}

// Select a lesson to view
function selectLesson(id) {
  currentLessonId = id;
  const idStr = String(id);
  
  // Find the lesson in either Technical or Management array
  let lesson = window.COURSE_MODULES.find(m => String(m.id) === idStr);
  if (!lesson) {
    lesson = window.MANAGEMENT_MODULES.find(m => String(m.id) === idStr);
  }
  if (!lesson) return;

  // Update sidebar active state style
  const playlistItems = document.querySelectorAll('.playlist-item');
  playlistItems.forEach(item => {
    if (String(item.getAttribute('data-id')) === idStr) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update Dynamic Player View elements
  const videoPlayerWrapper = document.getElementById('course-video-player-wrapper');
  const videoPlayer = document.getElementById('course-video-player');
  const textOnlyPlaceholder = document.getElementById('course-text-only-placeholder');
  const textOnlyContent = document.getElementById('course-text-only-content');
  const lessonTitle = document.getElementById('course-lesson-title');
  const lessonDuration = document.getElementById('course-lesson-duration');
  const lessonDescription = document.getElementById('course-lesson-description');
  const lessonBullets = document.getElementById('course-lesson-bullets');
  const attachmentsList = document.getElementById('course-attachments-list');
  const checkCompletedBtn = document.getElementById('check-current-completed');

  const btnExternalYoutube = document.getElementById('btn-open-external-youtube');
  if (lesson.videoUrl) {
    if (videoPlayerWrapper) videoPlayerWrapper.style.display = 'block';
    if (textOnlyPlaceholder) textOnlyPlaceholder.style.display = 'none';
    if (videoPlayer) videoPlayer.src = lesson.videoUrl;
    
    // Set up external YouTube link fallback
    if (btnExternalYoutube) {
      btnExternalYoutube.style.display = 'inline-flex';
      let watchUrl = lesson.videoUrl;
      if (lesson.videoUrl.includes('/embed/')) {
        const parts = lesson.videoUrl.split('/embed/');
        if (parts.length > 1) {
          const videoId = parts[1].split('?')[0].split('/')[0];
          watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }
      }
      btnExternalYoutube.href = watchUrl;
    }
  } else {
    if (videoPlayerWrapper) videoPlayerWrapper.style.display = 'none';
    if (textOnlyPlaceholder) {
      textOnlyPlaceholder.style.display = 'block';
      if (textOnlyContent) textOnlyContent.innerHTML = lesson.richTextContent || '<p>Bài viết đang cập nhật.</p>';
    }
    if (videoPlayer) videoPlayer.src = '';
    if (btnExternalYoutube) btnExternalYoutube.style.display = 'none';
  }
  
  // Determine index in current array list
  const modules = idStr.startsWith('mgt-') ? window.MANAGEMENT_MODULES : window.COURSE_MODULES;
  const displayIndex = modules.indexOf(lesson) + 1;
  
  if (lessonTitle) lessonTitle.textContent = `Bài ${displayIndex}: ${lesson.title}`;
  if (lessonDuration) lessonDuration.textContent = `Thời gian: ${lesson.duration}`;
  if (lessonDescription) lessonDescription.textContent = lesson.description;

  // Render bullets
  if (lessonBullets) {
    lessonBullets.innerHTML = '';
    lesson.bullets.forEach(bullet => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="bullet-check">✓</span> ${bullet}`;
      lessonBullets.appendChild(li);
    });
  }

  // Render files
  if (attachmentsList) {
    attachmentsList.innerHTML = '';
    if (lesson.attachments && lesson.attachments.length > 0) {
      lesson.attachments.forEach(file => {
        const item = document.createElement('a');
        if (file.url && file.url !== '#') {
          item.href = file.url;
          item.target = '_blank';
          if (file.url.startsWith('data:')) {
            item.download = file.name;
          }
        } else {
          item.href = '#';
          item.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`Đang chuẩn bị tải xuống tài liệu mẫu: ${file.name}`);
          });
        }
        item.className = 'attachment-item';
        item.innerHTML = `
          <svg class="file-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <div class="attachment-info">
            <span class="attachment-name">${file.name}</span>
            <span class="attachment-size">${file.size}</span>
          </div>
          <span class="attachment-download-btn">Tải xuống</span>
        `;
        attachmentsList.appendChild(item);
      });
    } else {
      attachmentsList.innerHTML = '<p class="text-muted" style="font-style: italic;">Không có tài liệu đính kèm cho bài này.</p>';
    }
  }

  // Sync the big "Mark as completed" button status
  if (checkCompletedBtn) {
    const isCompleted = completedLessons.includes(idStr);
    checkCompletedBtn.checked = isCompleted;
  }

  // Render Q&A section
  renderCommentsList(currentLessonId);

  // Instructor video link editor visibility and value pre-fill
  const instructorEditPanel = document.getElementById('instructor-edit-video-panel');
  const instructorVideoInput = document.getElementById('instructor-video-url-input');
  
  if (currentUser && currentUser.role === 'instructor' && lesson.videoUrl !== undefined && lesson.videoUrl !== null) {
    if (instructorEditPanel) instructorEditPanel.style.display = 'block';
    if (instructorVideoInput) instructorVideoInput.value = lesson.videoUrl || '';
    renderInstructorAttachmentsList(lesson);
  } else {
    if (instructorEditPanel) instructorEditPanel.style.display = 'none';
  }
}

// Toggle lesson completed status
function toggleLessonCompleted(id, isChecked) {
  const idStr = String(id);
  const index = completedLessons.indexOf(idStr);

  if (isChecked && index === -1) {
    completedLessons.push(idStr);
  } else if (!isChecked && index !== -1) {
    completedLessons.splice(index, 1);
  }

  localStorage.setItem('doshi_completed_lessons', JSON.stringify(completedLessons));

  // Sync checkboxes in sidebar and player view
  const sidebarCheck = document.querySelector(`.lesson-check-box[data-id="${idStr}"]`);
  if (sidebarCheck) sidebarCheck.checked = isChecked;

  if (idStr === String(currentLessonId)) {
    const mainCheck = document.getElementById('check-current-completed');
    if (mainCheck) mainCheck.checked = isChecked;
  }

  // Reload progress bar
  updateProgressBar();
}

// Update the progress tracker display bar
function updateProgressBar() {
  let total = 0;
  let completed = 0;

  if (activeSidebarMode === 'online') {
    total = window.COURSE_MODULES.length;
    completed = completedLessons.filter(id => !String(id).startsWith('mgt-')).length;
  } else if (activeSidebarMode === 'management') {
    total = window.MANAGEMENT_MODULES.length;
    completed = completedLessons.filter(id => String(id).startsWith('mgt-')).length;
  } else {
    return;
  }

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const progressBar = document.getElementById('course-progress-fill');
  const progressText = document.getElementById('course-progress-text');

  if (progressBar) progressBar.style.width = `${percentage}%`;
  if (progressText) progressText.textContent = `Hoàn thành: ${completed}/${total} bài học (${percentage}%)`;
}

// Setup listeners for learning area
function setupCourseControls() {
  const checkCompletedBtn = document.getElementById('check-current-completed');
  if (checkCompletedBtn) {
    checkCompletedBtn.addEventListener('change', (e) => {
      toggleLessonCompleted(currentLessonId, e.target.checked);
    });
  }

  // Tab switching inside Course view
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active classes
      tabBtns.forEach(b => b.classList.remove('active'));
      const contents = document.querySelectorAll('.tab-pane');
      contents.forEach(c => c.classList.remove('active'));

      // Add active to clicked
      btn.classList.add('active');
      const paneId = btn.getAttribute('data-tab');
      const pane = document.getElementById(`tab-pane-${paneId}`);
      if (pane) pane.classList.add('active');
    });
  });

  // Handle Posting Comment Q&A
  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const textarea = document.getElementById('comment-input');
      const text = textarea.value.trim();
      
      if (!text) return;
      if (!currentUser) {
        alert('Vui lòng đăng nhập để gửi thảo luận.');
        showView('login');
        return;
      }

      // Add comment to Db
      if (!commentsDb[currentLessonId]) {
        commentsDb[currentLessonId] = [];
      }

      const newComment = {
        author: currentUser.name,
        avatar: currentUser.avatar || currentUser.name.substring(0,2).toUpperCase(),
        role: currentUser.role,
        date: 'Vừa xong',
        content: text
      };

      commentsDb[currentLessonId].push(newComment);
      localStorage.setItem('doshi_course_comments', JSON.stringify(commentsDb));

      // Sync to Firebase Cloud Firestore
      if (db) {
        db.collection('comments').doc(String(currentLessonId)).set({
          list: commentsDb[currentLessonId]
        }).catch(err => console.error("Error saving comment to Firebase: ", err));
      }

      // Reset text
      textarea.value = '';

      // Re-render
      renderCommentsList(currentLessonId);
    });
  }

  // Sidebar Modes Selector (Technical, Management, Offline)
  const btnOnlineMode = document.getElementById('btn-sidebar-online');
  const btnMgtMode = document.getElementById('btn-sidebar-management');
  const btnOfflineMode = document.getElementById('btn-sidebar-offline');
  
  const sidebarOnlineControls = document.getElementById('sidebar-online-controls');
  const sidebarOfflineControls = document.getElementById('sidebar-offline-controls');
  const subviewOnlinePlayer = document.getElementById('subview-online-player');
  const subviewOfflineSchedule = document.getElementById('subview-offline-schedule');

  function updateActiveSidebarLayout(mode) {
    activeSidebarMode = mode;
    
    // Manage active buttons style
    [btnOnlineMode, btnMgtMode, btnOfflineMode].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    
    if (mode === 'online' && btnOnlineMode) btnOnlineMode.classList.add('active');
    if (mode === 'management' && btnMgtMode) btnMgtMode.classList.add('active');
    if (mode === 'offline' && btnOfflineMode) btnOfflineMode.classList.add('active');

    // Manage active sidebar controls & player displays
    if (mode === 'online' || mode === 'management') {
      if (sidebarOnlineControls) sidebarOnlineControls.style.display = 'flex';
      if (sidebarOfflineControls) sidebarOfflineControls.style.display = 'none';
      if (subviewOnlinePlayer) subviewOnlinePlayer.classList.add('active');
      if (subviewOfflineSchedule) subviewOfflineSchedule.classList.remove('active');
      
      // Load first lesson of array list
      const modules = mode === 'online' ? window.COURSE_MODULES : window.MANAGEMENT_MODULES;
      currentLessonId = modules[0].id;
      renderLessonsList();
      selectLesson(currentLessonId);
    } else {
      if (sidebarOnlineControls) sidebarOnlineControls.style.display = 'none';
      if (sidebarOfflineControls) sidebarOfflineControls.style.display = 'block';
      if (subviewOnlinePlayer) subviewOnlinePlayer.classList.remove('active');
      if (subviewOfflineSchedule) subviewOfflineSchedule.classList.add('active');
      
      renderOfflineRegistrations();
    }

    // Sync navbar link highlights
    const onlineNav = document.getElementById('nav-link-online');
    const managementNav = document.getElementById('nav-link-management');
    const offlineNav = document.getElementById('nav-link-offline');
    if (onlineNav) onlineNav.classList.toggle('active', mode === 'online');
    if (managementNav) managementNav.classList.toggle('active', mode === 'management');
    if (offlineNav) offlineNav.classList.toggle('active', mode === 'offline');
  }

  if (btnOnlineMode) btnOnlineMode.addEventListener('click', () => updateActiveSidebarLayout('online'));
  if (btnMgtMode) btnMgtMode.addEventListener('click', () => updateActiveSidebarLayout('management'));
  if (btnOfflineMode) btnOfflineMode.addEventListener('click', () => updateActiveSidebarLayout('offline'));

  // Save Video Link Listener for Instructors
  const btnSaveVideoUrl = document.getElementById('btn-save-video-url');
  if (btnSaveVideoUrl) {
    btnSaveVideoUrl.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let inputVal = document.getElementById('instructor-video-url-input').value.trim();
      if (!inputVal) {
        alert('Vui lòng nhập link video!');
        return;
      }
      
      // Auto convert standard watch/share URLs to embed URLs
      inputVal = convertToEmbedUrl(inputVal);
      
      if (!inputVal.startsWith('http://') && !inputVal.startsWith('https://')) {
        alert('Đường dẫn video không hợp lệ! Vui lòng nhập link bắt đầu bằng http:// hoặc https://');
        return;
      }
      
      const idStr = String(currentLessonId);
      let isMgt = false;
      let lessonIndex = window.COURSE_MODULES.findIndex(m => String(m.id) === idStr);
      if (lessonIndex === -1) {
        lessonIndex = window.MANAGEMENT_MODULES.findIndex(m => String(m.id) === idStr);
        isMgt = true;
      }
      
      if (lessonIndex !== -1) {
        if (isMgt) {
          window.MANAGEMENT_MODULES[lessonIndex].videoUrl = inputVal;
          localStorage.setItem('doshi_mgt_modules', JSON.stringify(window.MANAGEMENT_MODULES));
          // Sync to Firebase Cloud Firestore
          if (db) {
            db.collection('mgt_modules').doc(idStr).set(window.MANAGEMENT_MODULES[lessonIndex]).catch(err => console.error("Error saving video url to Firebase: ", err));
          }
        } else {
          window.COURSE_MODULES[lessonIndex].videoUrl = inputVal;
          localStorage.setItem('doshi_course_modules', JSON.stringify(window.COURSE_MODULES));
          // Sync to Firebase Cloud Firestore
          if (db) {
            db.collection('course_modules').doc(idStr).set(window.COURSE_MODULES[lessonIndex]).catch(err => console.error("Error saving video url to Firebase: ", err));
          }
        }
        
        alert('Đã cập nhật liên kết video thành công!');
        selectLesson(currentLessonId);
      }
    });
  }
}

// Render the comments for a specific lesson
function renderCommentsList(lessonId) {
  const container = document.getElementById('comments-list');
  if (!container) return;

  container.innerHTML = '';
  const list = commentsDb[lessonId] || [];

  if (list.length === 0) {
    container.innerHTML = '<p class="text-muted" style="text-align: center; padding: 20px; font-style: italic;">Chưa có câu hỏi nào. Hãy là người đầu tiên thảo luận!</p>';
    return;
  }

  list.forEach(c => {
    const item = document.createElement('div');
    item.className = `comment-item ${c.role === 'instructor' || c.role === 'admin' ? 'instructor-reply' : ''}`;
    
    item.innerHTML = `
      <div class="comment-avatar">${c.avatar}</div>
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-author">${c.author}</span>
          ${c.role === 'instructor' ? '<span class="badge badge-red">Giảng Viên</span>' : ''}
          ${c.role === 'admin' ? '<span class="badge badge-dark">Quản Trị Viên</span>' : ''}
          <span class="comment-date">${c.date}</span>
        </div>
        <div class="comment-content">${c.content}</div>
      </div>
    `;
    container.appendChild(item);
  });

  // Scroll to bottom of comment area if new comments
  container.scrollTop = container.scrollHeight;
}

// Landing Page: Switch tabs between Technical Online, Store Management, and Offline
function setupOfflineLandingTabs() {
  const tabBtns = document.querySelectorAll('.landing-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const type = btn.getAttribute('data-type');
      const panes = ['online', 'management', 'offline'];
      panes.forEach(p => {
        const el = document.getElementById(`pane-${p}`);
        if (el) {
          if (p === type) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        }
      });
    });
  });

  // Hero button "Xem khóa học offline" helper
  const heroOfflineBtn = document.getElementById('btn-hero-offline');
  if (heroOfflineBtn) {
    heroOfflineBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToOfflineLanding();
    });
  }
}

// Consultation Modal controls
function setupOfflineBookingModal() {
  const modal = document.getElementById('consultation-modal');
  const closeBtn = document.getElementById('btn-close-modal');
  const bookingForm = document.getElementById('offline-booking-form');
  const courseSelect = document.getElementById('book-course-select');

  // Find all booking triggers on landing and dashboard
  // Use Event delegation since these can be clicked anywhere
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-book-offline');
    if (btn) {
      e.preventDefault();
      const courseName = btn.getAttribute('data-course') || '';
      
      // Pre-select dropdown if course match
      if (courseSelect && courseName) {
        // Try exact match or subset
        for (let i = 0; i < courseSelect.options.length; i++) {
          if (courseName.includes(courseSelect.options[i].value) || courseSelect.options[i].value.includes(courseName)) {
            courseSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Pre-fill user data if logged in
      if (currentUser) {
        const bookName = document.getElementById('book-name');
        const bookPhone = document.getElementById('book-phone');
        const bookEmail = document.getElementById('book-email');
        if (bookName) bookName.value = currentUser.name;
        if (bookEmail) bookEmail.value = currentUser.email;
      }

      // Show modal
      if (modal) modal.classList.add('active');
    }
  });

  // Close modal click handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Handle Form Submit Consultation Booking
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('book-name').value.trim();
      const phone = document.getElementById('book-phone').value.trim();
      const email = document.getElementById('book-email').value.trim();
      const course = document.getElementById('book-course-select').value;
      const location = document.getElementById('book-location').value;
      const msg = document.getElementById('book-msg').value.trim();

      const regId = 'reg-' + Date.now();
      const newReg = {
        id: regId,
        name: name,
        phone: phone,
        email: email,
        course: course,
        location: location,
        message: msg,
        status: 'Đã Đăng Ký Tư Vấn',
        date: new Date().toLocaleDateString('vi-VN')
      };

      offlineRegistrations.unshift(newReg);
      localStorage.setItem('doshi_offline_regs', JSON.stringify(offlineRegistrations));

      // Sync to Firebase Cloud Firestore
      if (db) {
        db.collection('offline_bookings').doc(regId).set(newReg).catch(err => console.error("Error saving booking to Firebase: ", err));
      }

      alert(`Đăng ký tư vấn khóa học "${course}" thành công!\nChuyên gia Doshi sẽ liên hệ với bạn qua số điện thoại ${phone} sớm nhất.`);
      
      // Reset form
      bookingForm.reset();
      
      // Close modal
      if (modal) modal.classList.remove('active');

      // Update UI in workspace
      renderOfflineRegistrations();
    });
  }
  
  // Setup Instructor attachment actions
  setupInstructorAttachments();
}

// Render Offline registrations list inside Dashboard Workspace
function renderOfflineRegistrations() {
  const container = document.getElementById('offline-registered-list');
  if (!container) return;

  container.innerHTML = '';
  
  // Filter registrations that belong to current logged-in user
  let myRegs = [];
  if (currentUser) {
    myRegs = offlineRegistrations.filter(r => r.email.toLowerCase() === currentUser.email.toLowerCase());
  } else {
    myRegs = [...offlineRegistrations];
  }

  if (myRegs.length === 0) {
    container.innerHTML = '<p class="text-muted" style="font-style: italic; text-align: center; padding: 20px;">Bạn chưa đăng ký lớp học thực hành offline nào. Hãy đăng ký bên dưới!</p>';
    return;
  }

  myRegs.forEach(reg => {
    const row = document.createElement('div');
    row.className = 'registered-class-row';
    
    // Customize status badges color classes if any
    let statusClass = 'reg-class-status';
    
    row.innerHTML = `
      <div class="reg-class-info">
        <h4>Khóa học: ${reg.course}</h4>
        <span>Đăng ký ngày: ${reg.date} | Cơ sở: ${reg.location}</span>
      </div>
      <span class="${statusClass}">${reg.status}</span>
    `;
    container.appendChild(row);
  });
}

// Handler function for sidebar offline course clicks
function selectOfflineDetail(courseId) {
  // Find class row or details depending on clicked item
  const subview = document.getElementById('subview-offline-schedule');
  if (!subview) return;

  // Visual cues: highlights
  const listItems = document.querySelectorAll('#sidebar-offline-controls li');
  listItems.forEach(item => {
    item.style.borderLeft = 'none';
    item.style.backgroundColor = 'rgba(255,255,255,0.02)';
  });

  // Find clicked item and add left border
  const event = window.event;
  if (event && event.currentTarget) {
    event.currentTarget.style.borderLeft = '2px solid var(--color-gold)';
    event.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
  }

  // Focus schedule title
  if (courseId === 'off-all') {
    renderOfflineRegistrations();
  } else {
    const course = window.OFFLINE_COURSES.find(c => c.id === courseId);
    if (!course) return;
    
    // We can render the course curriculum inside the list area or show an alert,
    // let's show detail information dynamically:
    const listContainer = document.getElementById('offline-registered-list');
    if (listContainer) {
      listContainer.innerHTML = `
        <div class="registered-class-row" style="flex-direction: column; align-items: flex-start; gap: 10px; border-left-color: var(--color-gold);">
          <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
            <h4 style="font-size: 1.1rem; color: var(--color-gold);">${course.title} ${course.icon}</h4>
            <span class="badge badge-gold" style="font-size: 0.8rem;">${course.duration}</span>
          </div>
          <p style="font-size: 0.9rem; color: #CBD5E1;">${course.description}</p>
          <div style="margin-top: 10px; width: 100%;">
            <strong style="font-size: 0.85rem; color: #FFFFFF; display: block; margin-bottom: 8px;">Nội dung thực hành chi tiết:</strong>
            <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 6px;">
              ${course.skills.map(skill => `<li style="font-size: 0.82rem; color: #94A3B8; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: var(--color-gold);">✓</span> ${skill}</li>`).join('')}
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 15px; border-top: 1px solid var(--color-dark-border); padding-top: 15px;">
            <span style="font-size: 0.8rem; color: #94A3B8;">Thời gian đào tạo: ${course.hours}</span>
            <button class="btn btn-primary btn-sm btn-book-offline" data-course="${course.title}" style="box-shadow: none;">Đăng ký lớp này</button>
          </div>
        </div>
      `;
    }
  }
}

// Load/Init custom modules database (allows teachers to edit links)
function initModules() {
  const savedCourseModules = localStorage.getItem('doshi_course_modules');
  if (savedCourseModules) {
    const list = JSON.parse(savedCourseModules);
    const hasDuplicateTitles = list.some(m => String(m.title).startsWith('Bài 6:') || String(m.title).startsWith('Bài 7:'));
    if (list.length === 7 && !hasDuplicateTitles) {
      window.COURSE_MODULES = list;
    } else {
      localStorage.setItem('doshi_course_modules', JSON.stringify(window.COURSE_MODULES));
    }
  } else {
    localStorage.setItem('doshi_course_modules', JSON.stringify(window.COURSE_MODULES));
  }
  const savedMgtModules = localStorage.getItem('doshi_mgt_modules');
  if (savedMgtModules) {
    window.MANAGEMENT_MODULES = JSON.parse(savedMgtModules);
  }
}

// Helper to convert standard youtube urls to embed links
function convertToEmbedUrl(url) {
  url = url.trim();
  if (url.includes('/embed/')) {
    return url;
  }
  if (url.includes('youtube.com/watch')) {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {}
  }
  if (url.includes('youtu.be/')) {
    const parts = url.split('youtu.be/');
    if (parts.length > 1) {
      const videoId = parts[1].split('?')[0].split('/')[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  }
  return url;
}

// Handler function for sidebar offline course clicks
if (typeof window !== 'undefined') {
  window.selectOfflineDetail = selectOfflineDetail;
}

// ==========================================================================
// FIREBASE DATA LOAD & MERGE HELPERS
// ==========================================================================

async function loadModulesFromFirestore() {
  if (!db) return;
  try {
    // 1. Technical Course Modules
    const courseSnapshot = await db.collection('course_modules').get();
    let hasDuplicateTitles = false;
    if (!courseSnapshot.empty) {
      courseSnapshot.forEach(doc => {
        const title = doc.data().title || '';
        if (title.startsWith('Bài 6:') || title.startsWith('Bài 7:')) {
          hasDuplicateTitles = true;
        }
      });
    }

    if (!courseSnapshot.empty && courseSnapshot.size === 7 && !hasDuplicateTitles) {
      const list = [];
      courseSnapshot.forEach(doc => list.push(doc.data()));
      list.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      window.COURSE_MODULES = list;
      localStorage.setItem('doshi_course_modules', JSON.stringify(window.COURSE_MODULES));
    } else {
      // Overwrite/Seed Firestore if collection is empty or has old curriculum size or duplicate titles
      if (!courseSnapshot.empty) {
        const batch = db.batch();
        courseSnapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
      }
      for (const m of window.COURSE_MODULES) {
        await db.collection('course_modules').doc(String(m.id)).set(m);
      }
    }

    // 2. Management Course Modules
    const mgtSnapshot = await db.collection('mgt_modules').get();
    if (!mgtSnapshot.empty) {
      const list = [];
      mgtSnapshot.forEach(doc => list.push(doc.data()));
      list.sort((a, b) => {
        const idA = parseInt(String(a.id).replace('mgt-', ''));
        const idB = parseInt(String(b.id).replace('mgt-', ''));
        return idA - idB;
      });
      window.MANAGEMENT_MODULES = list;
      localStorage.setItem('doshi_mgt_modules', JSON.stringify(window.MANAGEMENT_MODULES));
    } else {
      // Seed Firestore if collection is empty
      for (const m of window.MANAGEMENT_MODULES) {
        await db.collection('mgt_modules').doc(String(m.id)).set(m);
      }
    }
  } catch (e) {
    console.error("Error synchronizing modules with Firestore: ", e);
  }
}

async function loadOfflineRegistrationsFromFirestore() {
  if (!db) return;
  try {
    const snapshot = await db.collection('offline_bookings').get();
    if (!snapshot.empty) {
      const list = [];
      snapshot.forEach(doc => list.push(doc.data()));
      list.sort((a, b) => String(b.id).localeCompare(String(a.id)));
      offlineRegistrations = list;
      localStorage.setItem('doshi_offline_regs', JSON.stringify(offlineRegistrations));
    }
  } catch (e) {
    console.error("Error loading offline bookings from Firestore: ", e);
  }
}

async function loadCommentsFromFirestore() {
  if (!db) return;
  try {
    const snapshot = await db.collection('comments').get();
    if (!snapshot.empty) {
      const dbObj = {};
      snapshot.forEach(doc => {
        dbObj[doc.id] = doc.data().list || [];
      });
      commentsDb = dbObj;
      localStorage.setItem('doshi_course_comments', JSON.stringify(commentsDb));
    } else {
      // Seed Firestore with commentsDb
      const keys = Object.keys(commentsDb);
      for (const key of keys) {
        await db.collection('comments').doc(String(key)).set({ list: commentsDb[key] });
      }
    }
  } catch (e) {
    console.error("Error loading comments from Firestore: ", e);
  }
}

async function loadUsersFromFirestore() {
  if (!db) return;
  try {
    const snapshot = await db.collection('users').get();
    if (!snapshot.empty) {
      const list = [];
      snapshot.forEach(doc => list.push(doc.data()));
      window.DEFAULT_USERS = list;
      localStorage.setItem('doshi_users', JSON.stringify(window.DEFAULT_USERS));
    } else {
      // Seed Firestore with DEFAULT_USERS
      for (const u of window.DEFAULT_USERS) {
        await db.collection('users').doc(u.email.toLowerCase()).set(u);
      }
    }
  } catch (e) {
    console.error("Error loading users from Firestore: ", e);
  }
}

// ==========================================================================
// INSTRUCTOR USER MANAGEMENT FUNCTIONS
// ==========================================================================

function renderInstructorUsersList() {
  const container = document.getElementById('instructor-users-list');
  if (!container) return;

  container.innerHTML = '';
  const users = window.DEFAULT_USERS || [];

  if (users.length === 0) {
    container.innerHTML = '<div style="text-align: center; color: #64748B; font-size: 0.8rem; padding: 10px 0;">Chưa có tài khoản học viên nào.</div>';
    return;
  }

  users.forEach(u => {
    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '1.2fr 1.5fr 1fr auto';
    row.style.gap = '10px';
    row.style.fontSize = '0.8rem';
    row.style.color = '#CBD5E1';
    row.style.padding = '6px 0';
    row.style.alignItems = 'center';
    row.style.borderBottom = '1px solid rgba(255,255,255,0.02)';

    const isSystemAccount = u.email === 'admin@doshi.vn' || u.email === 'giangvien@doshi.vn' || u.email === 'hocvien@doshi.vn';
    const roleText = u.role === 'instructor' ? 'Giảng Viên' : u.role === 'admin' ? 'Quản Trị Viên' : 'Học Viên';
    const roleBadgeClass = u.role === 'instructor' ? 'badge-red' : u.role === 'admin' ? 'badge-dark' : 'badge-gold';
    
    const actionHtml = isSystemAccount 
      ? '<span style="color: #64748B; font-size: 0.7rem; width: 45px; text-align: center; display: inline-block;">Hệ thống</span>'
      : `<button type="button" class="btn-delete-user" data-email="${u.email}" style="background: none; border: none; color: #EF4444; cursor: pointer; padding: 4px; display: inline-flex; align-items: center; justify-content: center; width: 45px;" title="Xóa tài khoản này">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>`;

    row.innerHTML = `
      <span style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${u.name}</span>
      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${u.email}</span>
      <span><span class="badge ${roleBadgeClass}" style="font-size: 0.7rem; padding: 2px 6px;">${roleText}</span></span>
      ${actionHtml}
    `;

    container.appendChild(row);
  });

  const deleteBtns = container.querySelectorAll('.btn-delete-user');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-email');
      if (!email) return;

      if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${email}" không?`)) {
        await deleteUserAccount(email);
      }
    });
  });
}

async function deleteUserAccount(email) {
  try {
    window.DEFAULT_USERS = window.DEFAULT_USERS.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem('doshi_users', JSON.stringify(window.DEFAULT_USERS));

    if (db) {
      await db.collection('users').doc(email.toLowerCase()).delete();
    }
    
    alert(`Đã xóa tài khoản "${email}" thành công!`);
    renderInstructorUsersList();
  } catch (e) {
    console.error("Error deleting user: ", e);
    alert('Đã xảy ra lỗi khi xóa tài khoản.');
  }
}

function setupInstructorUserManagement() {
  const form = document.getElementById('instructor-create-user-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('new-user-name').value.trim();
      const email = document.getElementById('new-user-email').value.trim().toLowerCase();
      const password = document.getElementById('new-user-password').value.trim();

      if (!name || !email || !password) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
      }

      const exists = window.DEFAULT_USERS.some(u => u.email.toLowerCase() === email);
      if (exists) {
        alert(`Tài khoản email "${email}" đã tồn tại trên hệ thống!`);
        return;
      }

      const newUser = {
        name,
        email,
        password,
        role: 'student'
      };

      try {
        window.DEFAULT_USERS.push(newUser);
        localStorage.setItem('doshi_users', JSON.stringify(window.DEFAULT_USERS));

        if (db) {
          await db.collection('users').doc(email).set(newUser);
        }

        alert(`Đã tạo thành công tài khoản học viên "${name}" (${email})!`);
        form.reset();
        renderInstructorUsersList();
      } catch (err) {
        console.error("Error creating user: ", err);
        alert('Đã xảy ra lỗi khi tạo tài khoản học viên.');
      }
    });
  }
}

// ==========================================================================
// INSTRUCTOR ATTACHMENTS MANAGEMENT LOGIC
// ==========================================================================

function renderInstructorAttachmentsList(lesson) {
  const container = document.getElementById('instructor-attachments-list');
  if (!container) return;

  container.innerHTML = '';
  const attachments = lesson.attachments || [];

  if (attachments.length === 0) {
    container.innerHTML = '<p style="color: #94A3B8; font-size: 0.8rem; text-align: center; margin: 10px 0; font-style: italic;">Chưa có tài liệu nào.</p>';
    return;
  }

  attachments.forEach((att, idx) => {
    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.justifyContent = 'space-between';
    item.style.padding = '6px 8px';
    item.style.marginBottom = '6px';
    item.style.backgroundColor = 'rgba(255,255,255,0.03)';
    item.style.borderRadius = '4px';
    item.style.border = '1px solid rgba(255,255,255,0.05)';
    item.style.fontSize = '0.78rem';

    const displayName = att.name.length > 30 ? att.name.substring(0, 27) + '...' : att.name;

    item.innerHTML = `
      <span style="color: #CBD5E1; font-weight: 500;">${displayName} <span style="color: #64748B; font-size: 0.7rem;">(${att.size})</span></span>
      <button type="button" class="btn-delete-att" data-index="${idx}" style="background: none; border: none; color: #EF4444; cursor: pointer; font-size: 0.85rem; padding: 2px 6px; font-weight: bold;" title="Xóa tài liệu">✕</button>
    `;

    item.querySelector('.btn-delete-att').addEventListener('click', async (e) => {
      e.preventDefault();
      if (confirm(`Bạn có chắc muốn xóa tài liệu "${att.name}" không?`)) {
        lesson.attachments.splice(idx, 1);
        await saveLessonAttachmentsToFirebase(lesson);
      }
    });

    container.appendChild(item);
  });
}

async function saveLessonAttachmentsToFirebase(lesson) {
  // Update local COURSE_MODULES or MANAGEMENT_MODULES
  const isMgt = String(lesson.id).startsWith('mgt-');
  if (isMgt) {
    const targetIdx = window.MANAGEMENT_MODULES.findIndex(m => String(m.id) === String(lesson.id));
    if (targetIdx !== -1) window.MANAGEMENT_MODULES[targetIdx] = lesson;
    localStorage.setItem('doshi_mgt_modules', JSON.stringify(window.MANAGEMENT_MODULES));
  } else {
    const targetIdx = window.COURSE_MODULES.findIndex(m => String(m.id) === String(lesson.id));
    if (targetIdx !== -1) window.COURSE_MODULES[targetIdx] = lesson;
    localStorage.setItem('doshi_course_modules', JSON.stringify(window.COURSE_MODULES));
  }

  // Render main student view attachments
  const attachmentsList = document.getElementById('course-attachments-list');
  if (attachmentsList) {
    attachmentsList.innerHTML = '';
    if (lesson.attachments && lesson.attachments.length > 0) {
      lesson.attachments.forEach(file => {
        const item = document.createElement('a');
        if (file.url && file.url !== '#') {
          item.href = file.url;
          item.target = '_blank';
          if (file.url.startsWith('data:')) {
            item.download = file.name;
          }
        } else {
          item.href = '#';
          item.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`Đang chuẩn bị tải xuống tài liệu mẫu: ${file.name}`);
          });
        }
        item.className = 'attachment-item';
        item.innerHTML = `
          <svg class="file-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <div class="attachment-info">
            <span class="attachment-name">${file.name}</span>
            <span class="attachment-size">${file.size}</span>
          </div>
          <span class="attachment-download-btn">Tải xuống</span>
        `;
        attachmentsList.appendChild(item);
      });
    } else {
      attachmentsList.innerHTML = '<p class="text-muted" style="font-style: italic;">Không có tài liệu đính kèm cho bài này.</p>';
    }
  }

  // Render editor view attachments
  renderInstructorAttachmentsList(lesson);

  // Save to Firestore
  if (db) {
    try {
      const collName = isMgt ? 'mgt_modules' : 'course_modules';
      await db.collection(collName).doc(String(lesson.id)).set(lesson);
    } catch (e) {
      console.error("Error saving attachments to Firestore: ", e);
    }
  }
}

function setupInstructorAttachments() {
  const btnAdd = document.getElementById('btn-add-attachment');
  const fileInput = document.getElementById('instructor-attachment-file-input');

  if (btnAdd) {
    btnAdd.addEventListener('click', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('instructor-attachment-name-input');
      const urlInput = document.getElementById('instructor-attachment-url-input');

      if (!nameInput || !urlInput) return;

      const name = nameInput.value.trim();
      const url = urlInput.value.trim();

      if (!name) {
        alert("Vui lòng nhập tên tài liệu.");
        return;
      }

      let lesson = window.COURSE_MODULES.find(m => String(m.id) === String(currentLessonId));
      if (!lesson) {
        lesson = window.MANAGEMENT_MODULES.find(m => String(m.id) === String(currentLessonId));
      }

      if (!lesson) {
        alert("Không tìm thấy bài học đang chọn.");
        return;
      }

      if (!lesson.attachments) lesson.attachments = [];
      
      const newAtt = {
        name: name,
        size: url ? 'Liên kết' : 'Tài liệu mẫu',
        url: url || '#'
      };

      lesson.attachments.push(newAtt);
      await saveLessonAttachmentsToFirebase(lesson);

      nameInput.value = '';
      urlInput.value = '';
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 800 * 1024) {
        alert("Tệp tải lên trực tiếp giới hạn dưới 800KB do đồng bộ Cloud. Với các tài liệu lớn hơn, xin vui lòng tải lên Google Drive rồi dán liên kết Drive của bạn vào ô bên trên để chia sẻ!");
        fileInput.value = '';
        return;
      }

      let lesson = window.COURSE_MODULES.find(m => String(m.id) === String(currentLessonId));
      if (!lesson) {
        lesson = window.MANAGEMENT_MODULES.find(m => String(m.id) === String(currentLessonId));
      }

      if (!lesson) {
        alert("Không tìm thấy bài học đang chọn.");
        fileInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        if (!lesson.attachments) lesson.attachments = [];

        let sizeStr = '';
        if (file.size < 1024) sizeStr = `${file.size} B`;
        else if (file.size < 1024 * 1024) sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
        else sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

        const newAtt = {
          name: file.name,
          size: sizeStr,
          url: reader.result
        };

        lesson.attachments.push(newAtt);
        await saveLessonAttachmentsToFirebase(lesson);

        fileInput.value = '';
      };
      reader.readAsDataURL(file);
    });
  }
}
