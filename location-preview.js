// 사용자가 "내 위치"를 누른 경우에만 GPS 위치를 사용합니다.
let locationPreviewMap = null;
let locationPreviewMarker = null;
const locationPreviewStyle = document.createElement('style');
locationPreviewStyle.textContent = '.location-preview{margin-top:11px;padding:14px;border:1px solid #cce9e5;border-radius:16px;background:#f8fcfb}.location-preview[hidden]{display:none}.location-preview-head{display:flex;gap:10px;align-items:center}.location-preview-head>span{font-size:23px;color:#007a88}.location-preview-head b,.location-preview-head small{display:block}.location-preview-head small{margin-top:3px;color:#6c8588;font-size:11px;line-height:1.45}.location-preview dl{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:13px 0}.location-preview dl div{padding:9px 10px;border-radius:10px;background:#fff}.location-preview dt{font-size:10px;color:#6c8588}.location-preview dd{margin:3px 0 0;font-size:12px;font-weight:800;color:#04545f}#locationMiniMap{height:160px;border-radius:12px;overflow:hidden;border:1px solid #d8e9e9}.location-preview>p{margin:9px 0 0;color:#6c8588;font-size:10px;line-height:1.5}';
document.head.appendChild(locationPreviewStyle);

function locationPreviewCard() {
  let card = document.getElementById('locationPreview');
  if (card) return card;
  card = document.createElement('section');
  card.id = 'locationPreview';
  card.className = 'location-preview';
  card.innerHTML = '<div class="location-preview-head"><span>⌖</span><div><b>현재 위치 정보</b><small id="locationName">위치를 확인하는 중입니다.</small></div></div><dl><div><dt>위도</dt><dd id="locationLat">-</dd></div><div><dt>경도</dt><dd id="locationLng">-</dd></div></dl><div id="locationMiniMap" aria-label="현재 위치 지도"></div><p>위치명과 지도는 현재 화면에서만 확인하며, 제보를 전송할 때 GPS 좌표가 함께 전달됩니다.</p>';
  document.querySelector('.location').after(card);
  return card;
}

function renderLocationMap(lat, lng) {
  const element = document.getElementById('locationMiniMap');
  if (!window.L || !element) return;
  if (!locationPreviewMap) {
    locationPreviewMap = L.map(element, { zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(locationPreviewMap);
  }
  locationPreviewMap.setView([lat, lng], 16);
  if (locationPreviewMarker) locationPreviewMarker.remove();
  locationPreviewMarker = L.marker([lat, lng]).addTo(locationPreviewMap);
  setTimeout(() => locationPreviewMap.invalidateSize(), 100);
}

async function findLocationName(lat, lng) {
  const name = document.getElementById('locationName');
  name.textContent = '현재 위치명을 찾는 중입니다…';
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=18`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('lookup failed');
    const data = await response.json();
    name.textContent = data.display_name || '현재 위치명을 찾지 못했습니다.';
  } catch (error) {
    name.textContent = '위치명은 확인하지 못했지만, 위도·경도는 정상적으로 확인되었습니다.';
  }
}

window.getLocation = function () {
  const locationText = document.getElementById('locationText');
  locationText.textContent = '위치 권한을 요청하는 중입니다…';
  if (!navigator.geolocation) { locationText.textContent = '이 브라우저에서는 GPS 위치를 지원하지 않습니다.'; return; }
  navigator.geolocation.getCurrentPosition(async (result) => {
    const lat = result.coords.latitude, lng = result.coords.longitude;
    position = [lat, lng];
    locationText.textContent = `위도 ${lat.toFixed(6)} · 경도 ${lng.toFixed(6)}`;
    document.getElementById('office').textContent = 'GPS 좌표가 제보 내용에 포함됩니다.';
    const card = locationPreviewCard();
    card.hidden = false;
    document.getElementById('locationLat').textContent = lat.toFixed(6);
    document.getElementById('locationLng').textContent = lng.toFixed(6);
    renderLocationMap(lat, lng);
    await findLocationName(lat, lng);
    toast('현재 GPS 위치를 확인했습니다.');
  }, (error) => {
    position = null;
    const message = error.code === 1 ? '위치 권한이 필요합니다. 주소창의 위치 설정을 “허용”으로 바꾼 뒤 다시 눌러 주세요.' : '현재 위치를 찾지 못했습니다. GPS 또는 Wi‑Fi를 켠 뒤 다시 시도해 주세요.';
    locationText.textContent = message;
    document.getElementById('office').textContent = '정확한 GPS 위치 확인 후 제보할 수 있습니다.';
    toast(message);
  }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
};
