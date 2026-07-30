// GPS 좌표를 OpenStreetMap 해안선 데이터와 비교해 바다 인근 여부를 확인합니다.
const COAST_DISTANCE_METERS = 1000;

async function isNearSea(latitude, longitude) {
  const query = `[out:json][timeout:15];way["natural"="coastline"](around:${COAST_DISTANCE_METERS},${latitude},${longitude});out ids;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('해안선 정보를 불러오지 못했습니다.');
  const data = await response.json();
  return Array.isArray(data.elements) && data.elements.length > 0;
}

const submitFromSeaOnly = window.submitReport;
window.submitReport = async function () {
  if (!position) {
    await window.getLocation();
    if (!position) return;
  }

  const locationText = document.getElementById('locationText');
  locationText.textContent = '주변 해안선을 확인하는 중입니다…';
  try {
    const nearSea = await isNearSea(position[0], position[1]);
    if (!nearSea) {
      toast('바다 또는 해안선에서 1km 이내에서만 제보할 수 있습니다.');
      locationText.textContent = '바다·해안선 1km 이내 위치가 아닙니다.';
      return;
    }
    locationText.textContent = '바다·해안선 1km 이내 위치입니다.';
    submitFromSeaOnly();
  } catch (_) {
    toast('해안선 정보를 확인하지 못했습니다. 인터넷 연결 후 다시 시도해 주세요.');
    locationText.textContent = '해안선 정보를 확인하지 못했습니다.';
  }
};
