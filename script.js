const modal = document.querySelector('.auth-modal');
const loginBtn = document.querySelector('.login-btn-modal');
const signupBtn = document.querySelector('.signup-btn-modal');
const closeBtn = document.querySelector('.close-btn-modal');
const switchToRegister = document.querySelector('.switch-to-register');
const switchToLogin = document.querySelector('.switch-to-login');
const switchToForgot = document.querySelector('.switch-to-forgot');
const loginForm = document.querySelector('.form-box.login');
const registerForm = document.querySelector('.form-box.register');
const forgotForm = document.querySelector('.form-box.forgot');
const otpForm = document.querySelector('.form-box.otp');
const ctaBtn = document.querySelector('.cta-btn');
const resendOtpBtn = document.getElementById('resendOtp');
const otpCodeInput = document.getElementById('otpCode');

const loginSecurityIndicator = document.getElementById('loginSecurityIndicator');
const registerSecurityIndicator = document.getElementById('registerSecurityIndicator');
const loginPassword = document.getElementById('loginPassword');
const registerPassword = document.getElementById('registerPassword');
const registerConfirmPassword = document.getElementById('registerConfirmPassword');

let generatedOtp = '';
let userEmail = '';

// Show modal with register form first
signupBtn.addEventListener('click', () => {
  modal.classList.add('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
  forgotForm.classList.remove('active');
  otpForm.classList.remove('active');
});

// CTA button opens signup modal
ctaBtn.addEventListener('click', () => {
  modal.classList.add('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
  forgotForm.classList.remove('active');
  otpForm.classList.remove('active');
});

loginBtn.addEventListener('click', () => {
  modal.classList.add('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
  forgotForm.classList.remove('active');
  otpForm.classList.remove('active');
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});

switchToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.remove('active');
  forgotForm.classList.remove('active');
  otpForm.classList.remove('active');
  registerForm.classList.add('active');
});

switchToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.classList.remove('active');
  forgotForm.classList.remove('active');
  otpForm.classList.remove('active');
  loginForm.classList.add('active');
});

switchToForgot.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.remove('active');
  registerForm.classList.remove('active');
  otpForm.classList.remove('active');
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
  userEmail = document.getElementById('loginEmail').value;
  
  // Generate and "send" OTP
  generatedOtp = generateOtp();
  console.log(`OTP for ${userEmail}: ${generatedOtp}`); // For testing
  
  // Show OTP form
  loginForm.classList.remove('active');
  otpForm.classList.add('active');
});

document.getElementById('otpForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const enteredOtp = otpCodeInput.value;
  
  if (enteredOtp === generatedOtp) {
    alert('OTP verified! Logging in...');
    modal.classList.remove('active');
    otpForm.classList.remove('active');
    loginForm.classList.add('active');
    otpCodeInput.value = '';
  } else {
    alert('Invalid OTP. Please try again.');
    otpCodeInput.value = '';
    otpCodeInput.focus();
  }
});

resendOtpBtn.addEventListener('click', (e) => {
  e.preventDefault();
  generatedOtp = generateOtp();
  console.log(`New OTP for ${userEmail}: ${generatedOtp}`); // For testing
  otpCodeInput.value = '';
  alert('New OTP has been sent!');
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

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create additional particles for the background
document.addEventListener('DOMContentLoaded', () => {
  const background = document.querySelector('.moving-background');
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.width = `${Math.random() * 100 + 50}px`;
    particle.style.height = particle.style.width;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    background.appendChild(particle);
  }
});