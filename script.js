const modal = document.querySelector('.auth-modal');
const loginBtn = document.querySelector('.login-btn-modal');
const closeBtn = document.querySelector('.close-btn-modal');
const switchToRegister = document.querySelector('.switch-to-register');
const switchToLogin = document.querySelector('.switch-to-login');
const switchToForgot = document.querySelector('.switch-to-forgot');
const loginForm = document.querySelector('.form-box.login');
const registerForm = document.querySelector('.form-box.register');
const forgotForm = document.querySelector('.form-box.forgot');


const loginSecurityIndicator = document.getElementById('loginSecurityIndicator');
const registerSecurityIndicator = document.getElementById('registerSecurityIndicator');
const loginPassword = document.getElementById('loginPassword');
const registerPassword = document.getElementById('registerPassword');
const registerConfirmPassword = document.getElementById('registerConfirmPassword');


loginBtn.addEventListener('click', () => {
  modal.classList.add('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
  forgotForm.classList.remove('active');
});


closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});


switchToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.remove('active');
  forgotForm.classList.remove('active');
  registerForm.classList.add('active');
});


switchToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.classList.remove('active');
  forgotForm.classList.remove('active');
  loginForm.classList.add('active');
});


switchToForgot.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.remove('active');
  registerForm.classList.remove('active');
  forgotForm.classList.add('active');
});


modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});


function checkPasswordStrength(password) {
  let strength = 0;
  

  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  

  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return strength;
}

function updateSecurityIndicator(password, indicator) {
  const strength = checkPasswordStrength(password);
  const bar = indicator.querySelector('.security-bar');
  const text = indicator.querySelector('.security-text');
  
  if (password.length === 0) {
    bar.style.width = '0%';
    text.textContent = 'Password strength';
    return;
  }
  
  if (strength <= 2) {
    bar.className = 'security-bar weak';
    text.textContent = 'Weak password';
  } else if (strength <= 4) {
    bar.className = 'security-bar moderate';
    text.textContent = 'Moderate password';
  } else if (strength <= 6) {
    bar.className = 'security-bar strong';
    text.textContent = 'Strong password';
  } else {
    bar.className = 'security-bar very-strong';
    text.textContent = 'Very strong password';
  }
}


loginPassword.addEventListener('input', () => {
  updateSecurityIndicator(loginPassword.value, loginSecurityIndicator);
});

registerPassword.addEventListener('input', () => {
  updateSecurityIndicator(registerPassword.value, registerSecurityIndicator);
});


document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
 
  alert('Login form submitted (frontend only)');
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
 
  if (registerPassword.value !== registerConfirmPassword.value) {
    alert('Passwords do not match!');
    return;
  }
  

  alert('Registration form submitted (frontend only)');
});

document.getElementById('forgotForm').addEventListener('submit', (e) => {
  e.preventDefault();

  alert('Password reset link would be sent to your email');
});