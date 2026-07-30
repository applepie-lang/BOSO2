// 포인트 적립뿐 아니라 상점에서 사용한 포인트도 활동 내역에 표시합니다.
window.openHistory = function () {
  const modal = document.createElement('div');
  modal.className = 'history-modal';
  const activities = JSON.parse(localStorage.getItem('bosoActivity') || '[]');
  const reportRows = reports().map((report) =>
    `<li><b>${report.emoji} ${report.category}</b><span>${report.resolved ? '해결완료 · +150P 지급' : '처리 중'}</span></li>`
  ).join('') || '<li>아직 제보 내역이 없어요.</li>';
  const pointRows = activities.map((activity) => {
    const used = activity.points < 0;
    const amount = `${used ? '' : '+'}${activity.points.toLocaleString()}P`;
    return `<li><b>${activity.type}</b><span>${activity.detail}　<em class="${used ? 'point-used' : ''}">${amount}</em></span></li>`;
  }).join('') || '<li>아직 포인트 내역이 없어요.</li>';

  modal.innerHTML = `<div class="history-box"><button class="history-close">×</button><h2>내 활동 내역</h2><h3>사건 처리 상태</h3><ul>${reportRows}</ul><h3>포인트 적립·사용 내역</h3><ul>${pointRows}</ul></div>`;
  modal.querySelector('.history-close').onclick = () => modal.remove();
  document.body.appendChild(modal);
};

const historyStyle = document.createElement('style');
historyStyle.textContent = '.point-used{color:#c34242!important}';
document.head.appendChild(historyStyle);
