// 제보 전 위치 권한을 요청하고, 승인된 GPS 좌표를 제보에 저장합니다.
let reportAddress = '';

function requestReportLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 GPS 위치를 지원하지 않습니다.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (result) => {
        position = [result.coords.latitude, result.coords.longitude];
        document.getElementById('locationText').textContent = `위도 ${position[0].toFixed(6)} · 경도 ${position[1].toFixed(6)}`;
        document.getElementById('office').textContent = 'GPS 좌표가 제보 내용에 포함됩니다.';
        resolve();
      },
      (error) => {
        position = null;
        const message = error.code === 1
          ? '위치 권한이 필요합니다. 권한 허용 창에서 “허용”을 선택해 주세요.'
          : '현재 위치를 찾지 못했습니다. GPS 또는 Wi-Fi를 켠 뒤 다시 시도해 주세요.';
        document.getElementById('locationText').textContent = message;
        reject(new Error(message));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  });
}

window.getLocation = async function () {
  document.getElementById('locationText').textContent = '위치 권한을 요청하는 중입니다…';
  try {
    await requestReportLocation();
    toast('현재 GPS 위치를 확인했습니다.');
  } catch (error) {
    toast(error.message);
  }
};

const submitAfterLocation = window.submitReport;
window.submitReport = async function () {
  if (!position) {
    document.getElementById('locationText').textContent = '제보를 보내려면 위치 권한이 필요합니다…';
    try {
      await requestReportLocation();
    } catch (error) {
      toast(error.message);
      return;
    }
  }
  const countBefore = reports().length;
  submitAfterLocation();
  if (reports().length > countBefore) {
    const all = reports();
    all[0].address = reportAddress;
    localStorage.setItem('bosoReports', JSON.stringify(all));
  }
};
