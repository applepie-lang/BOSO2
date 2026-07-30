// 테스트를 위해 기존 포인트를 한 번만 100,000P로 설정합니다.
if (localStorage.getItem('bosoPointsTestInitialized') !== '100000') {
  localStorage.setItem('bosoPoints', '100000');
  localStorage.setItem('bosoPointsTestInitialized', '100000');
  savePoints(100000);
}

// 교환 버튼을 누르면 해당 포인트를 즉시 차감합니다.
window.redeem = function (cost, name) {
  if (points() < cost) {
    toast(`포인트가 ${cost - points()}P 부족합니다.`);
    return;
  }
  savePoints(points() - cost);
  addActivity('포인트 상점 교환', `${name} 교환`, -cost);
  toast(`${name} 교환 완료! ${cost.toLocaleString()}P가 차감되었습니다.`);
};
