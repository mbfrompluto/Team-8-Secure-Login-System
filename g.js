const modal = document.querySelector('.auth-modal');
const loginBtn = document.querySelector('.login-btn-modal');
const registerBtn = document.querySelector('.signup-btn-modal');
const ctaBtn = document.querySelector('.cta-btn');
const closeModal = document.querySelector('.close-btn-modal');
const formBoxes = document.querySelectorAll('.form-box');
const switchToRegister = document.querySelectorAll('.switch-to-register');
const switchToLogin = document.querySelectorAll('.switch-to-login');
const bgGrid = document.querySelector('.bg-grid');


const gridSize = 40; 

function createGridHighlight() {
  document.querySelectorAll('.bg-grid-cell').forEach(el => el.remove());
  
  const cols = Math.ceil(window.innerWidth / gridSize);
  const rows = Math.ceil(window.innerHeight / gridSize);
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = document.createElement('div');
      cell.className = 'bg-grid-cell';
      cell.style.left = `${x * gridSize}px`;
      cell.style.top = `${y * gridSize}px`;
      bgGrid.appendChild(cell);
    }
  }
}


createGridHighlight();
window.addEventListener('resize', createGridHighlight);


document.addEventListener('mousemove', (e) => {
  const cells = document.querySelectorAll('.bg-grid-cell');
  const x = Math.floor(e.clientX / gridSize) * gridSize;
  const y = Math.floor(e.clientY / gridSize) * gridSize;
  
  cells.forEach(cell => {
    const cellX = parseInt(cell.style.left);
    const cellY = parseInt(cell.style.top);
    const distance = Math.sqrt(Math.pow(x - cellX, 2) + Math.pow(y - cellY, 2));
    
    if (distance < gridSize * 2) {
      const intensity = 1 - (distance / (gridSize * 2));
      cell.style.border = `1px solid rgba(74, 124, 89, ${intensity * 0.3})`;
      cell.style.backgroundColor = `rgba(74, 124, 89, ${intensity * 0.05})`;
    } else {
      cell.style.border = '1px solid transparent';
      cell.style.backgroundColor = 'transparent';
    }
  });
});


function showForm(formName) {
  modal.style.display = 'flex';
  formBoxes.forEach(fb => fb.style.display = 'none');
  document.querySelector(`.form-box.${formName}`).style.display = 'block';
  
  if (formName === 'otp') {
    startOtpTimer();
  }
}


loginBtn.addEventListener('click', () => showForm('login'));
registerBtn.addEventListener('click', () => showForm('register'));
ctaBtn.addEventListener('click', () => showForm('register'));
closeModal.addEventListener('click', () => modal.style.display = 'none');

switchToRegister.forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    showForm('register');
  });
});

switchToLogin.forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    showForm('login');
  });
});


document.getElementById('registerPassword').addEventListener('input', function(e) {
  const password = e.target.value;
  const strength = checkPasswordStrength(password);
  const strengthBar = document.getElementById('password-strength-bar');
  const strengthText = document.getElementById('password-strength-text');
  
  strengthBar.className = `strength-bar strength-${strength}`;
  
  const strengthMessages = [
    'Very Weak',
    'Weak',
    'Moderate',
    'Strong',
    'Very Strong'
  ];
  strengthText.textContent = `Password Strength: ${strengthMessages[strength]}`;
});

function checkPasswordStrength(password) {
  let strength = 0;
  
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  return Math.min(strength, 4);
}


function startOtpTimer() {
  let seconds = 300;
  const timerElement = document.getElementById('otp-timer');
  
  const timer = setInterval(() => {
    if (!timerElement) {
      clearInterval(timer);
      return;
    }
    
    if (seconds <= 0) {
      clearInterval(timer);
      timerElement.textContent = "OTP expired";
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerElement.textContent = `${mins}m ${secs}s left`;
      seconds--;
    }
  }, 1000);
}


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

document.getElementById('resendOtpBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('otpEmail').value;

  const response = await fetch('resend_otp.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const result = await response.json();
  alert(result.message);
  if (result.success) {
    startOtpTimer();
  }
});


modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});