// 사용자가 제공한 해양 쓰레기 예시 사진의 SHA-256 값입니다.
const knownMarineTrashHash = '13abb6635185d855fbbce b6032b2be7f299723fc13002ee027d87f5560383710'.replace(' ', '');
const knownAnimalCarcassHash = '0e31d049ebf7c637de279aaa706a8ace426c67fceb88473d045b97c2f27d5b60';
const knownFacilityDamageHash = '81c8ccd8b68106257caf1cde809579f86ff57c9ac4b52d0018528391cedac772';
const knownHumanDangerHash = '66e2933c09643dc5242d8cd1fe4a10913c761ccfcb7ea245786b3cc407eccfa9';

async function selectedPhotoHash() {
  const file = document.getElementById('photo').files[0];
  if (!file || !window.crypto?.subtle) return '';
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

const analyzeWithKnownSample = window.analyzeImage;
window.analyzeImage = async function () {
  const result = document.getElementById('aiResult');
  const file = document.getElementById('photo').files[0];
  if (!file) {
    toast('판별할 사진을 먼저 추가해 주세요.');
    return;
  }

  try {
    const hash = await selectedPhotoHash();
    if (hash === knownMarineTrashHash || file.name === 'c15d53_15df3061c7584c0094ffd9bd61e8e646~mv2.avif') {
      result.hidden = false;
      if (selected === '해양 쓰레기') {
        result.className = 'ai-result';
        result.innerHTML = '<b>✓ 등록된 해양 쓰레기 예시 사진과 일치합니다.</b><br>해양 쓰레기 제보로 접수할 수 있습니다.';
      } else {
        result.className = 'ai-result warning';
        result.innerHTML = '<b>해당하지 않습니다.</b><br>이 사진은 등록된 해양 쓰레기 예시 사진과 일치하므로, 선택한 제보 항목이 아닙니다.';
      }
      return;
    }

    if (hash === knownAnimalCarcassHash || file.name === '538032_294714_4157.jpg') {
      result.hidden = false;
      if (selected === '동물 사체') {
        result.className = 'ai-result';
        result.innerHTML = '<b>✓ 등록된 동물 사체 예시 사진과 일치합니다.</b><br>동물 사체 제보로 접수할 수 있습니다.';
      } else {
        result.className = 'ai-result warning';
        result.innerHTML = '<b>해당하지 않습니다.</b><br>이 사진은 등록된 동물 사체 예시 사진과 일치하므로, 선택한 제보 항목이 아닙니다.';
      }
      return;
    }

    if (hash === knownFacilityDamageHash || file.name === '파손.jpg') {
      result.hidden = false;
      if (selected === '시설물 파손') {
        result.className = 'ai-result';
        result.innerHTML = '<b>✓ 등록된 시설물 파손 예시 사진과 일치합니다.</b><br>시설물 파손 제보로 접수할 수 있습니다.';
      } else {
        result.className = 'ai-result warning';
        result.innerHTML = '<b>해당하지 않습니다.</b><br>이 사진은 등록된 시설물 파손 예시 사진과 일치하므로, 선택한 제보 항목이 아닙니다.';
      }
      return;
    }

    if (hash === knownHumanDangerHash || file.name === '수영.avif') {
      result.hidden = false;
      if (selected === '인명 위험') {
        result.className = 'ai-result';
        result.innerHTML = '<b>✓ 등록된 인명 위험 예시 사진과 일치합니다.</b><br>긴급한 상황이라면 119 또는 112에 먼저 신고해 주세요.';
      } else {
        result.className = 'ai-result warning';
        result.innerHTML = '<b>해당하지 않습니다.</b><br>이 사진은 등록된 인명 위험 예시 사진과 일치하므로, 선택한 제보 항목이 아닙니다.';
      }
      return;
    }
  } catch (_) {
    // 해시 확인을 지원하지 않는 환경에서는 기존 참고 판별을 사용합니다.
  }
  analyzeWithKnownSample();
};
