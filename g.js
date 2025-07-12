const modal = document.querySelector('.auth-modal');
const loginBtn = document.querySelector('.login-btn-modal');
const registerBtn = document.querySelector('.signup-btn-modal');
const ctaBtn = document.querySelector('.cta-btn');
const closeModal = document.querySelector('.close-btn-modal');
const formBoxes = document.querySelectorAll('.form-box');

const switchToRegister = document.querySelectorAll('.switch-to-register');
const switchToLogin = document.querySelectorAll('.switch-to-login');

function showForm(formName) {
  modal.style.display = 'block';
  formBoxes.forEach(fb => fb.style.display = 'none');
  document.querySelector('.form-box.' + formName).style.display = 'block';
}

loginBtn.onclick = () => showForm('login');
registerBtn.onclick = () => showForm('register');
ctaBtn.onclick = () => showForm('register');
closeModal.onclick = () => modal.style.display = 'none';
switchToRegister.forEach(el => el.onclick = () => showForm('register'));
switchToLogin.forEach(el => el.onclick = () => showForm('login'));

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirm = document.getElementById('registerConfirmPassword').value;

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const response = await fetch('register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const result = await response.json();
  alert(result.message);
  if (result.success && result.redirect_to_otp) {
    document.getElementById('otpEmail').value = email;
    showForm('otp');
  }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const response = await fetch('login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const result = await response.json();
  alert(result.message);
  if (result.success && result.redirect_to_otp) {
    document.getElementById('otpEmail').value = email;
    showForm('otp');
  }
});

document.getElementById('otpForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const otp = document.getElementById('otpCode').value.trim();
  const email = document.getElementById('otpEmail').value;

  const response = await fetch('verify-otp.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp, email })
  });

  const result = await response.json();
  alert(result.message);
  if (result.success && result.redirect_to_dashboard) {
    window.location.href = 'dashboard.php';
  }
});

document.getElementById('resendOtp').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('otpEmail').value;

  const response = await fetch('resend_otp.php?email=' + encodeURIComponent(email));
  const result = await response.json();
  alert(result.message);
});
