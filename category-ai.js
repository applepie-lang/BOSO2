// 선택한 제보 유형과 맞지 않는 AI 안내 문구를 방지합니다.
const chooseReportCategory = window.chooseCategory;

function updateAiButton() {
  const button = document.getElementById('aiCheck');
  if (!button) return;
  const names = {
    '해양 쓰레기': '해양 쓰레기',
    '동물 사체': '동물 사체',
    '시설물 파손': '시설물 파손',
    '인명 위험': '인명 위험'
  };
  button.textContent = `✦ AI로 ${names[selected] || '사진'} 참고 확인하기`;
}

window.chooseCategory = function (category, icon) {
  chooseReportCategory(category, icon);
  updateAiButton();
};

const analyzeSelectedImage = window.analyzeImage;
window.analyzeImage = async function () {
  const image = document.getElementById('preview');
  const result = document.getElementById('aiResult');
  if (!image.src) {
    toast('판별할 사진을 먼저 추가해 주세요.');
    return;
  }

  if (selected === '동물 사체') {
    result.hidden = false;
    result.className = 'ai-result warning';
    result.innerHTML = '<b>동물 사체 제보로 접수합니다.</b><br>현재 공개 AI 모델은 동물 사체 여부를 정확히 판별하지 못하므로, 사진과 선택한 제보 유형을 담당자가 함께 확인합니다.';
    return;
  }

  if (selected === '시설물 파손') {
    result.hidden = false;
    result.className = 'ai-result warning';
    result.innerHTML = '<b>시설물 파손 제보로 접수합니다.</b><br>부식·파손 상태는 사진만으로 정확히 판별하기 어려워 담당자가 현장 정보를 함께 확인합니다.';
    return;
  }

  if (selected === '인명 위험') {
    result.hidden = false;
    result.className = 'ai-result warning';
    result.innerHTML = '<b>인명 위험 제보로 접수합니다.</b><br>긴급한 위험 상황은 사진 판별을 기다리지 말고 119 또는 112에 먼저 신고해 주세요. 제보 내용은 담당자가 함께 확인합니다.';
    return;
  }

  analyzeSelectedImage();
};
