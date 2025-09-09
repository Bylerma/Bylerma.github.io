// Authentication System for SRMCEM Portal

// Initialize authentication system
document.addEventListener('DOMContentLoaded', function() {
  initializeAuth();
});

function initializeAuth() {
  // Password toggle functionality
  const passwordToggle = document.getElementById('password-toggle');
  if (passwordToggle) {
    passwordToggle.addEventListener('click', togglePassword);
  }

  // Signup form handling
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  // Login form handling
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Forgot password modal
  const forgotPasswordLink = document.getElementById('forgot-password');
  const forgotPasswordModal = document.getElementById('forgot-password-modal');
  const modalClose = document.getElementById('modal-close');
  const forgotPasswordForm = document.getElementById('forgot-password-form');

  if (forgotPasswordLink && forgotPasswordModal) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      forgotPasswordModal.classList.add('active');
    });
  }

  if (modalClose && forgotPasswordModal) {
    modalClose.addEventListener('click', () => {
      forgotPasswordModal.classList.remove('active');
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', handleForgotPassword);
  }

  // Quick access links
  const quickLinks = document.querySelectorAll('.quick-link');
  quickLinks.forEach(link => {
    link.addEventListener('click', handleQuickAccess);
  });

  // Form validation
  addFormValidation();
}

// Password toggle functionality
function togglePassword() {
  const passwordInput = document.getElementById('loginPassword');
  const toggleIcon = document.querySelector('#password-toggle i');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
  }
}

// Handle signup form submission
function handleSignup(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const userData = Object.fromEntries(formData.entries());
  
  // Validate passwords match
  if (userData.password !== userData.confirmPassword) {
    showMessage('Passwords do not match!', 'error');
    return;
  }

  // Validate password strength
  if (userData.password.length < 8) {
    showMessage('Password must be at least 8 characters long!', 'error');
    return;
  }

  // Check if email already exists (in a real app, this would be server-side)
  const existingUsers = getStoredUsers();
  if (existingUsers.find(user => user.email === userData.email)) {
    showMessage('An account with this email already exists!', 'error');
    return;
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    try {
      // Generate student ID
      userData.studentId = generateStudentId(userData.course, userData.admissionYear);
      userData.registrationDate = new Date().toISOString();
      userData.id = Date.now().toString();

      // Remove password confirmation from stored data
      delete userData.confirmPassword;

      // Store user data (in a real app, this would be sent to server)
      storeUser(userData);

      showMessage('Account created successfully! You can now log in.', 'success');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);

    } catch (error) {
      showMessage('An error occurred while creating your account. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }, 2000);
}

// Handle login form submission
function handleLogin(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const loginData = Object.fromEntries(formData.entries());
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    try {
      const existingUsers = getStoredUsers();
      const user = existingUsers.find(u => 
        (u.email === loginData.loginEmail || u.studentId === loginData.loginEmail) && 
        u.password === loginData.loginPassword
      );

      if (user) {
        // Store session data
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        if (loginData.remember) {
          localStorage.setItem('rememberedUser', user.email);
        }

        showMessage('Login successful! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        showMessage('Invalid email/student ID or password!', 'error');
      }
    } catch (error) {
      showMessage('An error occurred during login. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }, 1500);
}

// Handle forgot password
function handleForgotPassword(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const email = formData.get('resetEmail');
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    const existingUsers = getStoredUsers();
    const user = existingUsers.find(u => u.email === email);

    if (user) {
      showMessage('Password reset link sent to your email!', 'success');
      document.getElementById('forgot-password-modal').classList.remove('active');
    } else {
      showMessage('No account found with this email address!', 'error');
    }

    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 2000);
}

// Handle quick access links
function handleQuickAccess(e) {
  e.preventDefault();
  
  const action = e.currentTarget.dataset.action;
  
  // Check if user is logged in
  const currentUser = sessionStorage.getItem('currentUser');
  if (!currentUser) {
    showMessage('Please log in to access this feature.', 'info');
    return;
  }

  // Simulate navigation to different modules
  switch (action) {
    case 'student-portal':
      showMessage('Redirecting to Student Portal...', 'info');
      setTimeout(() => window.location.href = 'dashboard.html', 1000);
      break;
    case 'library':
      showMessage('Redirecting to Digital Library...', 'info');
      break;
    case 'fee-payment':
      showMessage('Redirecting to Fee Payment Portal...', 'info');
      break;
    default:
      showMessage('Feature coming soon!', 'info');
  }
}

// Utility functions
function generateStudentId(course, year) {
  const courseCode = {
    'btech-cse': 'CSE',
    'btech-ece': 'ECE',
    'btech-mech': 'MECH',
    'btech-civil': 'CIVIL',
    'btech-eee': 'EEE',
    'mtech-cse': 'MCSE',
    'mba': 'MBA',
    'bca': 'BCA',
    'mca': 'MCA'
  };

  const code = courseCode[course] || 'GEN';
  const yearSuffix = year.toString().slice(-2);
  const randomNum = Math.floor(Math.random() * 900) + 100;
  
  return `${yearSuffix}${code}${randomNum}`;
}

function storeUser(userData) {
  const existingUsers = getStoredUsers();
  existingUsers.push(userData);
  localStorage.setItem('srmcemUsers', JSON.stringify(existingUsers));
}

function getStoredUsers() {
  const stored = localStorage.getItem('srmcemUsers');
  return stored ? JSON.parse(stored) : [];
}

function showMessage(text, type = 'info') {
  // Remove existing messages
  const existing = document.querySelector('.message');
  if (existing) {
    existing.remove();
  }

  // Create new message
  const message = document.createElement('div');
  message.className = `message ${type}`;
  
  const icon = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  };

  message.innerHTML = `
    <i class="fa-solid ${icon[type]}"></i>
    <span>${text}</span>
  `;

  // Insert at the top of the form
  const form = document.querySelector('.auth-form');
  if (form) {
    form.insertBefore(message, form.firstChild);
  }

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 5000);
}

function addFormValidation() {
  // Real-time password confirmation validation
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  
  if (password && confirmPassword) {
    confirmPassword.addEventListener('input', function() {
      if (this.value !== password.value) {
        this.setCustomValidity('Passwords do not match');
      } else {
        this.setCustomValidity('');
      }
    });
  }

  // Email validation
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    input.addEventListener('input', function() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.value && !emailRegex.test(this.value)) {
        this.setCustomValidity('Please enter a valid email address');
      } else {
        this.setCustomValidity('');
      }
    });
  });

  // Phone number validation
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', function() {
      const phoneRegex = /^[\+]?[0-9][\s]?[(]?[\s]?[\+]?[0-9]{2,3}[\s]?[)]?[-\s\.]?[0-9]{4,6}[-\s\.]?[0-9]{4,8}$/;
      if (this.value && !phoneRegex.test(this.value.replace(/\s/g, ''))) {
        this.setCustomValidity('Please enter a valid phone number');
      } else {
        this.setCustomValidity('');
      }
    });
  });
}

// Auto-fill remembered user
document.addEventListener('DOMContentLoaded', function() {
  const rememberedUser = localStorage.getItem('rememberedUser');
  const loginEmailInput = document.getElementById('loginEmail');
  
  if (rememberedUser && loginEmailInput) {
    loginEmailInput.value = rememberedUser;
    document.getElementById('remember').checked = true;
  }
});

// Demo data for testing
function createDemoUser() {
  const demoUser = {
    id: 'demo001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+91-9876543210',
    dateOfBirth: '2000-01-15',
    address: '123 Demo Street, Demo City, Demo State - 123456',
    course: 'btech-cse',
    semester: '3',
    rollNumber: '21CSE001',
    admissionYear: '2021',
    password: 'demo123',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+91-9876543211',
    previousEducation: 'Demo High School, 95%, 2019',
    studentId: '21CSE001',
    registrationDate: new Date().toISOString()
  };

  const existingUsers = getStoredUsers();
  if (!existingUsers.find(user => user.email === demoUser.email)) {
    storeUser(demoUser);
    console.log('Demo user created - Email: john.doe@example.com, Password: demo123');
  }
}

// Create demo user for testing
createDemoUser();