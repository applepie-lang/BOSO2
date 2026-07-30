// 제보 해결 여부는 담당 기관이 확인합니다. 사용자에게 해결 확인 버튼을 표시하지 않습니다.
window.renderReports = function () {
  const root = document.getElementById('recent');
  const all = reports();
  document.getElementById('mapCount').textContent = all.length;
  if (!all.length) {
    root.innerHTML = '<p class="empty">아직 제보한 내용이 없어요.</p>';
    return;
  }
  root.innerHTML = all.slice(0, 3).map((report) => {
    const status = report.resolved ? '담당 기관 해결 완료' : '담당 기관 확인 중';
    return `<div class="report-item"><span class="r-icon">${report.emoji}</span><div><b>${report.category}</b><small>${report.date} · ${status}</small></div><span class="badge">${report.resolved ? '해결완료' : '접수완료'}</span></div>`;
  }).join('');
};

renderReports();
