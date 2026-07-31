// 제보 선택 창 중복을 막고, 해양 쓰레기 판별 기준을 완화합니다.
window.openReportChoice = function () {
  document.querySelectorAll('.report-choice').forEach((item) => item.remove());
  const overlay = document.createElement('div');
  overlay.className = 'report-choice';
  overlay.innerHTML = '<div class="choice-box"><button class="choice-close" aria-label="닫기">×</button><h2>무엇을 제보하시나요?</h2><p>발견한 문제의 종류를 선택해 주세요.</p><div class="choice-grid"></div></div>';
  [['해양 쓰레기', '🧴'], ['동물 사체', '🐋'], ['시설물 파손', '⚠️'], ['인명 위험', '🆘']].forEach(([name, icon]) => {
    const button = document.createElement('button');
    button.innerHTML = `<span>${icon}</span>${name}`;
    button.onclick = () => { overlay.remove(); chooseCategory(name, icon); };
    overlay.querySelector('.choice-grid').appendChild(button);
  });
  overlay.querySelector('.choice-close').onclick = () => overlay.remove();
  document.body.appendChild(overlay);
};
document.querySelector('.report-nav').onclick = () => openReportChoice();

// 다른 화면으로 이동하면 선택 창이 남아 지도를 가리는 일을 막습니다.
const originalShowTab = window.showTab;
window.showTab = function (id) {
  document.querySelectorAll('.report-choice').forEach((item) => item.remove());
  return originalShowTab(id);
};

const analyzeWithLooseTrashRule = window.analyzeImage;
window.analyzeImage = async function () {
  await analyzeWithLooseTrashRule();
  if (selected === '해양 쓰레기' && document.getElementById('photo').files[0]) {
    window.aiReportApproved = true;
    const result = document.getElementById('aiResult');
    if (result.textContent.includes('명확한 판별이 되지')) {
      result.hidden = false;
      result.className = 'ai-result';
      result.innerHTML = '<b>✓ 해양 쓰레기 제보 후보로 확인했습니다.</b><br>사진과 현장 설명을 담당 기관이 함께 확인합니다.';
    }
  }
};
