<?php
session_start();
session_unset();
session_destroy();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="refresh" content="2;url=index.html">
  <meta charset="UTF-8" />
  <title>Logging Out...</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
      font-family: 'Segoe UI', sans-serif;
    }

    #vanta-bg {
      width: 100%;
      height: 100vh;
      position: absolute;
      top: 0; left: 0;
      z-index: 0;
    }

    .box {
      position: relative;
      z-index: 1;
      background: rgba(255, 255, 255, 0.93);
      padding: 30px 40px;
      border-radius: 14px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      text-align: center;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
    }

    .box h2 {
      margin: 0;
      font-size: 24px;
      color: #222;
      animation: float 3s ease-in-out infinite;
    }

    .box p {
      margin-top: 10px;
      font-size: 16px;
      color: #444;
    }

    @keyframes float {
      0%   { transform: translateY(0); }
      50%  { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div id="vanta-bg"></div>

  <div class="box">
    <h2>Logging you out...</h2>
    <p>Redirecting to home page...</p>
  </div>

  <!-- VANTA + THREE.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js"></script>
  <script>
    VANTA.GLOBE({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x7722ff,
      color2: 0xffffff,
      backgroundColor: 0x0f0c29,
      size: 1.3
    })
  </script>
</body>
</html>
