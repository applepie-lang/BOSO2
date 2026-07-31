// Keep navigation usable even when an old optional script fails to load.
(function () {
  var extraUiStyle = document.createElement('style');
  extraUiStyle.textContent = '.info-links{display:grid;gap:12px;margin-top:24px}.info-links a{display:flex;align-items:center;gap:13px;padding:17px;border:1px solid #cfeaf7;border-radius:16px;background:#f3fbff;color:#17445d;text-decoration:none}.info-links a>span{font-size:27px}.info-links b,.info-links small{display:block}.info-links b{font-size:14px}.info-links small{margin-top:4px;color:#6790a6;font-size:11px}.info-links i{margin-left:auto;font-size:24px;color:#3caddd;font-style:normal}nav .nav{min-width:0;flex:1;font-size:9px}@media(min-width:850px){nav .nav{flex:0 1 135px;font-size:10px}}';
  document.head.appendChild(extraUiStyle);

  // Show a small welcome screen before opening the service.
  function showWelcome() {
    var welcome = document.createElement('section');
    welcome.className = 'welcome-screen';
    welcome.style.cssText = 'position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;background:linear-gradient(160deg,#eaf8ff 0%,#bfeafb 58%,#8bd5f2 100%);color:#17445d;text-align:center;';
    welcome.innerHTML = '<div style="width:94px;height:94px;padding:14px;border-radius:30px;background:#fff;box-shadow:0 14px 32px rgba(24,109,152,.18)"><img src="boso-logo.svg" alt="BOSO 로고" style="width:100%;height:100%;object-fit:contain"></div><h1 style="margin:24px 0 6px;font-size:38px;letter-spacing:1px">BOSO</h1><p style="margin:0;color:#36708d;font-size:14px;font-weight:600">Busan Ocean Save Observer</p><p style="margin:36px 0 24px;line-height:1.7;font-size:16px;font-weight:700">시민의 제보로<br>깨끗하고 안전한 바다를 만들어요.</p><button type="button" style="width:min(300px,100%);border:0;border-radius:16px;padding:17px;background:#3caddd;color:#fff;font:800 16px inherit;box-shadow:0 10px 20px rgba(24,109,152,.22);cursor:pointer">들어가기 <span aria-hidden="true">→</span></button><small style="margin-top:18px;color:#6790a6">사진과 위치 정보로 해양 문제를 제보할 수 있어요.</small>';
    welcome.querySelector('button').onclick = function () {
      welcome.style.transition = 'opacity .22s ease';
      welcome.style.opacity = '0';
      setTimeout(function () { welcome.remove(); }, 230);
    };
    document.body.appendChild(welcome);
  }

  showWelcome();

  function closeReportChoice() {
    document.querySelectorAll('.report-choice').forEach(function (item) { item.remove(); });
  }

  var baseShowTab = window.showTab;
  window.showTab = function (id) {
    closeReportChoice();
    return baseShowTab(id);
  };

  function openCategoryChoice() {
    closeReportChoice();
    var overlay = document.createElement('div');
    overlay.className = 'report-choice';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:20px;background:rgba(18,68,93,.5);';
    var box = document.createElement('div');
    box.className = 'choice-box';
    box.style.cssText = 'display:block;width:min(420px,100%);padding:24px;border-radius:22px;background:#fff;color:#17445d;box-shadow:0 18px 50px rgba(10,66,95,.25);';
    var title = document.createElement('h2');
    title.style.cssText = 'display:block;margin:0 0 7px;font-size:20px;color:#17445d;';
    title.textContent = '\uBB34\uC5C7\uC744 \uC81C\uBCF4\uD558\uC2DC\uB098\uC694?';
    var guide = document.createElement('p');
    guide.style.cssText = 'display:block;margin:0 0 17px;color:#6790a6;font-size:12px;';
    guide.textContent = '\uBC1C\uACAC\uD55C \uBB38\uC81C\uC758 \uC885\uB958\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.';
    var grid = document.createElement('div');
    grid.className = 'choice-grid';
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px;';
    var choices = [
      ['\uD574\uC591 \uC4F0\uB808\uAE30', '\uD83E\uDDF4'],
      ['\uB3D9\uBB3C \uC0AC\uCCB4', '\uD83D\uDC0B'],
      ['\uC2DC\uC124\uBB3C \uD30C\uC190', '\u26A0\uFE0F'],
      ['\uC778\uBA85 \uC704\uD5D8', '\uD83C\uDD98']
    ];
    choices.forEach(function (choice) {
      var button = document.createElement('button');
      button.textContent = choice[1] + ' ' + choice[0];
      button.style.cssText = 'display:block;border:1px solid #cfeaf7;border-radius:13px;padding:15px 10px;background:#f3fbff;color:#17445d;font:700 13px inherit;cursor:pointer;';
      button.onclick = function () {
        overlay.remove();
        chooseCategory(choice[0], choice[1]);
      };
      grid.appendChild(button);
    });
    box.appendChild(title);
    box.appendChild(guide);
    box.appendChild(grid);
    overlay.appendChild(box);
    overlay.onclick = function (event) { if (event.target === overlay) overlay.remove(); };
    document.body.appendChild(overlay);
  }

  var reportButton = document.querySelector('.report-nav');
  if (reportButton) reportButton.onclick = openCategoryChoice;

  document.addEventListener('click', function (event) {
    var tabButton = event.target.closest('[data-tab]');
    if (tabButton && tabButton.dataset.tab !== 'report') closeReportChoice();
  });

  var photoInput = document.getElementById('photo');
  var aiButton = document.getElementById('aiCheck');
  var aiResult = document.getElementById('aiResult');
  var originalAiLabel = aiButton ? aiButton.textContent : '';

  if (aiButton) aiButton.remove();
  if (aiResult) aiResult.remove();

  function resetAiForNewPhoto() {
    if (aiButton) {
      aiButton.disabled = false;
      aiButton.textContent = originalAiLabel;
    }
    if (aiResult) {
      aiResult.hidden = true;
      aiResult.textContent = '';
      aiResult.className = 'ai-result';
    }
    window.aiReportApproved = false;
  }

  var previousPreview = window.previewPhoto;
  window.previewPhoto = function (input) {
    resetAiForNewPhoto();
    return previousPreview(input);
  };

  if (photoInput) {
    photoInput.addEventListener('click', function () { this.value = ''; });
    photoInput.addEventListener('change', resetAiForNewPhoto);
  }

  function removeDuplicateReports(list) {
    var seen = {};
    return list.filter(function (item) {
      var key = [item.category, item.description, item.date, (item.pos || []).join(',')].join('|');
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  var savedReports = removeDuplicateReports(reports());
  localStorage.setItem('bosoReports', JSON.stringify(savedReports));
  var lastReportKey = '';
  var lastReportAt = 0;

  window.submitReport = function () {
    var photo = document.getElementById('photo');
    if (!photo.files || !photo.files.length) {
      toast('\uC0AC\uC9C4\uC744 \uCD94\uAC00\uD55C \uB4A4 \uC81C\uBCF4\uD574 \uC8FC\uC138\uC694.');
      return;
    }
    if (!position) {
      toast('\uC704\uCE58 \uC815\uBCF4\uB97C \uD655\uC778\uD55C \uB4A4 \uC81C\uBCF4\uD574 \uC8FC\uC138\uC694.');
      return;
    }
    var requestKey = [selected, document.getElementById('description').value, position.join(',')].join('|');
    if (requestKey === lastReportKey && Date.now() - lastReportAt < 3000) return;
    lastReportKey = requestKey;
    lastReportAt = Date.now();
    var item = {
      id: Date.now(),
      category: selected,
      emoji: emoji,
      description: document.getElementById('description').value || '\uC2DC\uBBFC \uC81C\uBCF4',
      pos: position,
      date: new Date().toLocaleDateString('ko-KR'),
      resolved: false
    };
    var all = removeDuplicateReports(reports());
    all.unshift(item);
    localStorage.setItem('bosoReports', JSON.stringify(all));
    savePoints(points() + 25);
    renderReports();
    toast('\uC81C\uBCF4\uAC00 \uC804\uB2EC\uB418\uC5C8\uC2B5\uB2C8\uB2E4! +25P \uC801\uB9BD');
    setTimeout(function () { window.showTab('home'); }, 700);
  };
})();
