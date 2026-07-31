// Keep navigation usable even when an old optional script fails to load.
(function () {
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
})();
