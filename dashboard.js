// Dashboard functionality for SRMCEM Portal

document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
});

function initializeDashboard() {
  // Check if user is logged in
  const currentUser = sessionStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  // Parse user data
  const user = JSON.parse(currentUser);
  
  // Update user interface
  updateUserInterface(user);
  
  // Initialize user menu
  initializeUserMenu();
  
  // Initialize dashboard interactions
  initializeDashboardInteractions();
  
  // Load dashboard data (simulate API calls)
  loadDashboardData();
}

function updateUserInterface(user) {
  // Update user name in welcome section
  const studentNameEl = document.getElementById('student-name');
  if (studentNameEl) {
    studentNameEl.textContent = user.firstName;
  }

  // Update user name in navigation
  const userNameEl = document.getElementById('user-name');
  if (userNameEl) {
    userNameEl.textContent = `${user.firstName} ${user.lastName}`;
  }

  // Update student ID
  const studentIdEl = document.getElementById('student-id');
  if (studentIdEl) {
    studentIdEl.textContent = user.studentId;
  }

  // Update semester
  const semesterEl = document.getElementById('student-semester');
  if (semesterEl) {
    const semesterText = getSemesterText(user.semester);
    semesterEl.textContent = semesterText;
  }

  // Update user avatar with initials
  const userAvatar = document.querySelector('.user-avatar');
  if (userAvatar) {
    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    userAvatar.innerHTML = initials;
  }
}

function getSemesterText(semester) {
  const ordinals = {
    '1': '1st',
    '2': '2nd', 
    '3': '3rd',
    '4': '4th',
    '5': '5th',
    '6': '6th',
    '7': '7th',
    '8': '8th'
  };
  return `${ordinals[semester] || semester} Semester`;
}

function initializeUserMenu() {
  const userButton = document.getElementById('user-button');
  const userDropdown = document.getElementById('user-dropdown');
  const logoutBtn = document.getElementById('logout-btn');

  if (userButton && userDropdown) {
    userButton.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      userDropdown.classList.remove('active');
    });

    userDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
}

function handleLogout() {
  // Clear session data
  sessionStorage.removeItem('currentUser');
  
  // Show logout message
  const message = document.createElement('div');
  message.className = 'message success';
  message.innerHTML = `
    <i class="fa-solid fa-check-circle"></i>
    <span>Logged out successfully!</span>
  `;
  
  document.body.appendChild(message);
  
  // Redirect to login page
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1500);
}

function initializeDashboardInteractions() {
  // Add click handlers for action buttons
  const actionButtons = document.querySelectorAll('.action-button');
  actionButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const actionText = button.querySelector('span').textContent;
      showToast(`${actionText} feature coming soon!`, 'info');
    });
  });

  // Add click handlers for card actions
  const cardActions = document.querySelectorAll('.card-action');
  cardActions.forEach(action => {
    action.addEventListener('click', (e) => {
      e.preventDefault();
      const actionText = action.textContent;
      showToast(`${actionText} feature coming soon!`, 'info');
    });
  });

  // Add click handlers for course cards
  const courseCards = document.querySelectorAll('.course-card');
  courseCards.forEach(card => {
    card.addEventListener('click', () => {
      const courseName = card.querySelector('h4').textContent;
      showToast(`Opening ${courseName}...`, 'info');
    });
  });

  // Add click handlers for schedule items
  const scheduleItems = document.querySelectorAll('.schedule-item');
  scheduleItems.forEach(item => {
    item.addEventListener('click', () => {
      const className = item.querySelector('h4').textContent;
      showToast(`Opening ${className} details...`, 'info');
    });
  });
}

function loadDashboardData() {
  // Simulate loading dashboard data
  setTimeout(() => {
    animateStats();
    updateCurrentTime();
  }, 500);

  // Update time every minute
  setInterval(updateCurrentTime, 60000);
}

function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const text = stat.textContent;
    const isNumber = /^\d+$/.test(text);
    
    if (isNumber) {
      const finalValue = parseInt(text);
      let currentValue = 0;
      const increment = finalValue / 50;
      
      const animation = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
          stat.textContent = finalValue;
          clearInterval(animation);
        } else {
          stat.textContent = Math.floor(currentValue);
        }
      }, 20);
    }
  });
}

function updateCurrentTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Update any time displays if they exist
  const timeElements = document.querySelectorAll('.current-time');
  timeElements.forEach(el => {
    el.textContent = timeString;
  });
}

function showToast(message, type = 'info') {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(toast => toast.remove());

  // Create new toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };

  toast.innerHTML = `
    <i class="fa-solid ${icons[type]}"></i>
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-times"></i>
    </button>
  `;

  // Add toast styles if not already added
  if (!document.querySelector('#toast-styles')) {
    const toastStyles = document.createElement('style');
    toastStyles.id = 'toast-styles';
    toastStyles.textContent = `
      .toast {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--card);
        border: 1px solid var(--stroke);
        border-radius: 8px;
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
      }
      
      .toast-success {
        border-left: 4px solid #22c55e;
      }
      
      .toast-error {
        border-left: 4px solid #ef4444;
      }
      
      .toast-info {
        border-left: 4px solid #3b82f6;
      }
      
      .toast-warning {
        border-left: 4px solid #f59e0b;
      }
      
      .toast i:first-child {
        color: var(--accent);
      }
      
      .toast-close {
        background: none;
        border: none;
        color: var(--muted);
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
      }
      
      .toast-close:hover {
        color: var(--text);
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(toastStyles);
  }

  document.body.appendChild(toast);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

// Add slideOutRight animation
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  @keyframes slideOutRight {
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
document.head.appendChild(additionalStyles);

// Simulate real-time updates
function simulateRealTimeUpdates() {
  setInterval(() => {
    // Update attendance randomly (simulation)
    const attendanceEl = document.querySelector('.stat-card:nth-child(2) .stat-number');
    if (attendanceEl) {
      const currentAttendance = parseInt(attendanceEl.textContent);
      const change = Math.random() > 0.5 ? 1 : -1;
      const newAttendance = Math.max(85, Math.min(100, currentAttendance + change));
      attendanceEl.textContent = `${newAttendance}%`;
    }
  }, 30000); // Update every 30 seconds
}

// Initialize real-time updates
setTimeout(simulateRealTimeUpdates, 5000);

// Handle window resize for responsive adjustments
function handleResize() {
  const dashboardGrid = document.querySelector('.dashboard-grid');
  const cards = document.querySelectorAll('.dashboard-card');
  
  if (window.innerWidth <= 768) {
    // Mobile adjustments
    cards.forEach(card => {
      card.classList.remove('wide');
    });
  } else {
    // Desktop adjustments
    const courseCard = document.querySelector('.dashboard-card:has(.courses-grid)');
    if (courseCard) {
      courseCard.classList.add('wide');
    }
  }
}

window.addEventListener('resize', handleResize);
handleResize(); // Call once on load

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Alt + D for Dashboard
  if (e.altKey && e.key === 'd') {
    e.preventDefault();
    window.location.href = 'dashboard.html';
  }
  
  // Alt + L for Logout
  if (e.altKey && e.key === 'l') {
    e.preventDefault();
    handleLogout();
  }
});

// Service worker registration for offline functionality (if needed)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Service worker registration would go here
    // For now, just log that the feature is available
    console.log('Service Worker support detected');
  });
}