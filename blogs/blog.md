# HTML format for my blogs
### Just need to change the h1 heading and the content inside the blog container. Anyone checking this repository out feel free to use this. I am bit noob so it must be annoying for you to see this code if you are a pro but don't hesitate to raise issues and suggest any improvement <br><br>
```html
<!DOCTYPE html>

<html lang="en">

  <head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-BX8JFPKXJ4"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-BX8JFPKXJ4');
    </script>
    <meta charset="UTF-8">
    <meta name="author" content="Aayush Rath">
    <meta name="description" content="A website to write my blogs and my projects">
    <title>Aayush Rath</title>
    <link rel="icon" href="../assets/images/screw-removebg-preview.png">
    <link href='https://fonts.googleapis.com/css?family=Josefin Slab' rel='stylesheet'>
    <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
    <link href='https://fonts.googleapis.com/css?family=Jura' rel='stylesheet'>
    <script type="importmap">
      {
        "imports": {
          "three": "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js",
          "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/"
        }
      }
    </script>
    <style>
      * {
          box-sizing: border-box;
      }

      html{
          font-size: 22px;
      }


      h1 {
          text-align: center;
          font-family: 'Montserrat';
          margin-bottom: 70px;
          padding-top: 30px;
          font-weight: 100;
      }

      h2 {
        font-weight: 500;
        padding-left: 5%;
        margin-top: 30px;
        font-family: 'Montserrat', sans-serif;
    }

      .horizontal_line {
          width: 100%;
          border-top: 1px solid black;
          animation: growLine 1.2s ease-out forwards;
      }

      body.dark-mode .horizontal_line {
        border-top: 1px solid white;
      }

      .site-footer {
          text-align: center;
          margin-top: 30px;
          padding: 20px;
          font-family: 'Josefin Slab', serif;
          color: #333;
          background-color: #fffaf4;
      }

      .footer-line {
          border: none;
          border-top: 1px solid #aaa;
          margin: 40px auto 20px auto;
          width: 80%;
      }

      body.dark-mode .site-footer{
        background-color: #222222;
        color: white;
      }

      .home-button {
        position: absolute;
        top: 15px;
        right: 30px;
        background-color: #fffaf4;
        color: #222;
        padding: 6px 12px;
        border-radius: 6px;
        transition: background-color 0.3s, transform 0.2s;
        z-index: 10;
        margin-right: 50px;
        margin-top: 10px;
      }

      .home-button:hover {
        box-shadow: 0 12px 16px rgba(0, 0, 0, 0.24), 0 17px 50px rgba(0, 0, 0, 0.19);;
      }

      @keyframes growLine {
          from {
          width: 0;
          }
          to {
          width: 100%;
          }
      }

      body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #fffaf4;
      }

      body.dark-mode {
        background-color: #222222;
        color: #f5f5f5;
      }

      .dark-mode-toggle {
        position: absolute;
        width: 50px;
        height: 50px;
        font-size: 20px;
        top: 15px;
        left: 30px;
        padding: 6px;
        border: none;
        border-radius: 6px;
        background-color: #f6ddd0;
        color: #000;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        transition: background-color 0.3s;
      }

      body.dark-mode .dark-mode-toggle {
        background-color: #333;
        color: #fff;
      }

      .blog-container {
        max-width: 70%;
        margin: 100px auto 40px auto;
        padding: 30px;
        background-color: #fffaf4;
        color: #222222;
        font-family: 'Georgia', 'Times New Roman', serif;
        line-height: 1.7;
        font-size: 18px;
        border-radius: 12px;
        transition: background-color 0.4s, color 0.4s;
    }

    body.dark-mode .blog-container {
        background-color: #222222;
        color: #eaeaea;
    }

      body, .page-header, .site-footer, .button, .horizontal_line,.blog-container, h1, p, a {
        transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease;
      }
    </style>
  </head>

  <body>
    <button id="darkModeToggle" class="dark-mode-toggle">🌙</button>
    <a href="../index.html" class="home-button">
        <img src="../assets/images/home_button.png" alt="Home" width="40px">
    </a> 
    <h1></h1>
    <div class="horizontal_line"></div>
    <div class="blog-container">
    </div>
    <h2>Comments</h2>
    <script src="https://giscus.app/client.js"
        data-repo="aayush-rath/aayush-rath.github.io"
        data-repo-id="R_kgDOPGW6yA"
        data-category="Announcements"
        data-category-id="DIC_kwDOPGW6yM4CtOsv"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="en"
        crossorigin="anonymous"
        async>
    </script>

    <footer class="site-footer">
      <hr class="footer-line">
      <p>&copy; 2025 Aayush Rath. All rights reserved.</p>
    </footer>

    <script>
      const toggleBtn = document.getElementById('darkModeToggle');

      const isDarkMode = () => document.body.classList.contains('dark-mode');

      function applyDarkModePreference() {
        const enabled = localStorage.getItem('darkMode') === 'enabled';
        if (enabled) document.body.classList.add('dark-mode');

        if (enabled) {
          toggleBtn.textContent = '🌞';
        } else {
          toggleBtn.textContent = '🌙';
        }

        if (window.updateThreeSceneForDarkMode)
          updateThreeSceneForDarkMode(enabled);
      }

      document.addEventListener('sceneReady', applyDarkModePreference);

      toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const enabled = isDarkMode();
        localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');

        if (enabled) {
          toggleBtn.textContent = '🌞';
        } else {
          toggleBtn.textContent = '🌙';
        }

        if (window.updateThreeSceneForDarkMode)
          updateThreeSceneForDarkMode(enabled);
      });

      applyDarkModePreference();

        function updateGiscusTheme(isDark) {
        const giscusFrame = document.querySelector('iframe.giscus-frame');
        if (!giscusFrame) return;
        const message = {
            setConfig: {
            theme: isDark ? 'dark' : 'light'
            }
        };
        giscusFrame.contentWindow.postMessage(message, 'https://giscus.app');
        }

        toggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        updateGiscusTheme(isDark);
        });
    </script>
  </body>
</html>
```