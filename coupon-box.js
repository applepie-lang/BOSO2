// 상점 교환 쿠폰은 이 기기에만 저장되는 테스트용 쿠폰입니다.
function coupons() {
  return JSON.parse(localStorage.getItem('bosoCoupons') || '[]');
}

function saveCoupons(items) {
  localStorage.setItem('bosoCoupons', JSON.stringify(items));
}

function makeCouponNumber() {
  if (!window.crypto?.getRandomValues) {
    return Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('');
  }
  const values = new Uint32Array(14);
  crypto.getRandomValues(values);
  return Array.from(values, (value) => value % 10).join('');
}

function addCoupon(name) {
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);
  const item = { id: Date.now(), name, code: makeCouponNumber(), expiresAt: expiresAt.toISOString() };
  const all = coupons();
  all.unshift(item);
  saveCoupons(all);
  return item;
}

function couponExpiry(item) {
  const date = new Date(item.expiresAt);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

window.openCouponBox = function () {
  const modal = document.createElement('div');
  modal.className = 'coupon-modal';
  const now = Date.now();
  const items = coupons();
  const rows = items.map((item) => {
    const expired = new Date(item.expiresAt).getTime() < now;
    return `<article class="coupon ${expired ? 'expired' : ''}"><b>${item.name}</b><span>임시 바코드 번호</span><code>${item.code}</code><small>${expired ? '유효기간 만료' : `유효기간: ${couponExpiry(item)}까지`}</small></article>`;
  }).join('') || '<p class="coupon-empty">아직 보유한 쿠폰이 없어요.<br>포인트 상점에서 교환해 보세요.</p>';
  modal.innerHTML = `<div class="coupon-box"><button class="coupon-close" aria-label="닫기">×</button><h2>내 쿠폰함</h2><p>교환 후 1개월 동안 사용할 수 있어요.</p>${rows}</div>`;
  modal.querySelector('.coupon-close').onclick = () => modal.remove();
  document.body.appendChild(modal);
};

window.redeem = function (cost, name) {
  if (points() < cost) {
    toast(`포인트가 ${cost - points()}P 부족합니다.`);
    return;
  }
  savePoints(points() - cost);
  addActivity('포인트 상점 교환', `${name} 교환`, -cost);
  const coupon = addCoupon(name);
  toast(`${name} 교환 완료! 쿠폰 번호 ${coupon.code}가 생성되었습니다.`);
};

const couponButton = document.createElement('button');
couponButton.className = 'coupon-button';
couponButton.textContent = '▣ 내 쿠폰함 보기';
couponButton.onclick = openCouponBox;
document.querySelector('.points-card').after(couponButton);

const couponStyle = document.createElement('style');
couponStyle.textContent = '.coupon-button{width:100%;border:1px solid #9fd2ad;background:#f0fbf3;color:#176b36;border-radius:12px;padding:13px;font:700 13px inherit;margin:14px 0 4px}.coupon-modal{position:fixed;inset:0;background:#062d3288;z-index:60;display:grid;place-items:center;padding:20px}.coupon-box{position:relative;width:min(460px,100%);max-height:80vh;overflow:auto;background:#fff;border-radius:20px;padding:22px}.coupon-box h2{margin:0}.coupon-box>p{font-size:12px;color:#6c8588}.coupon-close{position:absolute;right:15px;top:11px;border:0;background:none;font-size:25px}.coupon{border:1px solid #b9ddc2;border-radius:14px;padding:15px;margin-top:11px;background:#f7fcf8}.coupon b,.coupon span,.coupon small{display:block}.coupon span{font-size:10px;color:#66806e;margin-top:9px}.coupon code{display:block;letter-spacing:3px;font:700 18px monospace;color:#173d26;margin:4px 0 9px}.coupon small{font-size:11px;color:#176b36}.coupon.expired{opacity:.55;filter:grayscale(1)}.coupon-empty{text-align:center;padding:25px 0;line-height:1.7}';
document.head.appendChild(couponStyle);
