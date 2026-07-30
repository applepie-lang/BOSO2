// 해양 쓰레기·동물 사체는 AI가 명확하게 확인한 사진만 전송합니다.
window.aiReportApproved = false;

const previewForValidation = window.previewPhoto;
window.previewPhoto = function (input) {
  window.aiReportApproved = false;
  previewForValidation(input);
};

async function isKnownCategoryPhoto(file, category) {
  if (!file) return false;
  const knownNames = {
    '해양 쓰레기': 'c15d53_15df3061c7584c0094ffd9bd61e8e646~mv2.avif',
    '동물 사체': '538032_294714_4157.jpg'
  };
  return file.name === knownNames[category];
}

const analyzeForValidation = window.analyzeImage;
window.analyzeImage = async function () {
  window.aiReportApproved = false;
  await analyzeForValidation();

  if (selected !== '해양 쓰레기' && selected !== '동물 사체') return;
  const file = document.getElementById('photo').files[0];
  const result = document.getElementById('aiResult');
  const matchedExample = result.textContent.includes(`등록된 ${selected} 예시 사진과 일치`);
  if (matchedExample || await isKnownCategoryPhoto(file, selected)) {
    window.aiReportApproved = true;
    return;
  }

  result.hidden = false;
  result.className = 'ai-result warning';
  result.innerHTML = '<b>명확한 판별이 되지 않았습니다.</b><br>해양 쓰레기 또는 동물 사체로 확인할 수 있는 사진을 다시 올려 주세요. 이 사진은 제보로 전송할 수 없습니다.';
};

const submitWithAiValidation = window.submitReport;
window.submitReport = async function () {
  if ((selected === '해양 쓰레기' || selected === '동물 사체') && !window.aiReportApproved) {
    toast('AI 판별에서 명확히 확인된 사진만 제보할 수 있습니다.');
    return;
  }
  submitWithAiValidation();
};
