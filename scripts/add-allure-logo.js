const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const reportDir = path.join(rootDir, 'allure-report');
const sourceLogo = path.join(rootDir, 'assets', 'emSphere-logo.gif');
const reportAssetsDir = path.join(reportDir, 'assets');
const reportLogo = path.join(reportAssetsDir, 'emSphere-logo.gif');
const reportIndex = path.join(reportDir, 'index.html');

if (!fs.existsSync(reportIndex)) {
  console.warn('Allure report index.html was not found; logo injection skipped.');
  process.exit(0);
}

if (!fs.existsSync(sourceLogo)) {
  console.warn(`Logo was not found at ${sourceLogo}; logo injection skipped.`);
  process.exit(0);
}

fs.mkdirSync(reportAssetsDir, { recursive: true });
fs.copyFileSync(sourceLogo, reportLogo);

let html = fs.readFileSync(reportIndex, 'utf8');

const logoScript = `
    <!-- emSphere-Allure-branding:start -->
    <style>
      .emsphere-logo-brand {
        position: fixed;
        top: 18px;
        right: 20px;
        z-index: 1001;
        width: 150px;
        max-width: 18vw;
        height: 48px;
        object-fit: contain;
        pointer-events: none;
        background: transparent;
      }

      @media (max-width: 900px) {
        .emsphere-logo-brand {
          width: 110px;
          height: 40px;
          right: 8px;
          top: 18px;
        }
      }
    </style>
    <script>
      (function () {
        function addEmSphereLogo() {
          if (document.getElementById('emsphere-logo-brand')) return;
          var logo = document.createElement('img');
          logo.id = 'emsphere-logo-brand';
          logo.className = 'emsphere-logo-brand';
          logo.src = 'assets/emSphere-logo.gif';
          logo.alt = 'emSphere';
          document.body.appendChild(logo);
        }

        function initializeEmSphereBranding() {
          addEmSphereLogo();
          document.title = 'emSphere - Allure Report';
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initializeEmSphereBranding);
        } else {
          initializeEmSphereBranding();
        }

        var observer = new MutationObserver(function () {
          if (!document.getElementById('emsphere-logo-brand')) {
            addEmSphereLogo();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      })();
    </script>
    <!-- emSphere-Allure-branding:end -->`;

if (!html.includes('emsphere-Allure-branding:start')) {
  html = html.replace('</body>', `${logoScript}\n</body>`);
}

html = html.replace(/<title>.*?<\/title>/, '<title>emSphere - Allure Report</title>');
fs.writeFileSync(reportIndex, html, 'utf8');
console.log('✅ emSphere logo added to Allure report:', reportIndex);
