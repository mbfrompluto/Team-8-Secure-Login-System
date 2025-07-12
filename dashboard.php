<?php
session_start();
if (!isset($_SESSION['otp_verified']) || $_SESSION['otp_verified'] !== true) {
    header("Location: index.html");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Dashboard</title>
  <style>
    html, body {
      margin: 0;
      height: 100%;
      font-family: 'Segoe UI', sans-serif;
      overflow: hidden;
    }

    #vanta-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .overlay {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .card {
      background: rgba(255, 255, 255, 0.92);
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
      text-align: center;
      max-width: 400px;
      animation: zoomIn 1s ease;
    }

    .card h2 {
      margin-bottom: 12px;
      color: #222;
    }

    .card p {
      margin-bottom: 24px;
      color: #444;
    }

    .card a {
      background: #0071e3;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 10px;
      font-weight: bold;
      transition: background 0.2s ease;
    }

    .card a:hover {
      background: #0059b2;
    }

    @keyframes zoomIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  </style>
</head>
<body>

<div id="vanta-bg"></div>

<div class="overlay">
  <div class="card">
    <h2>Welcome to your Dashboard!</h2>
    <p>You are logged in securely.</p>
    <a href="logout.php">Logout</a>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js"></script>

<script>
  VANTA.BIRDS({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.0,
    scaleMobile: 1.0,
    backgroundAlpha: 0.0,
    color1: 0x6a00ff,
    color2: 0xff00c8,
    birdSize: 1.5,
    wingSpan: 25.0,
    separation: 55.0,
    alignment: 45.0,
    cohesion: 45.0,
    quantity: 3.0
  })
</script>

</body>
</html>
