// 부산 7개 해수욕장 중심점. 반경 1.2km 안에서만 제보를 접수합니다.
const beaches = [
  { name: '해운대해수욕장', lat: 35.1587, lng: 129.1604 },
  { name: '광안리해수욕장', lat: 35.1531, lng: 129.1186 },
  { name: '송정해수욕장', lat: 35.1785, lng: 129.1996 },
  { name: '송도해수욕장', lat: 35.0765, lng: 129.0200 },
  { name: '다대포해수욕장', lat: 35.0487, lng: 128.9656 },
  { name: '일광해수욕장', lat: 35.2621, lng: 129.2338 },
  { name: '임랑해수욕장', lat: 35.3187, lng: 129.2645 }
];
const BEACH_RADIUS_METERS = 1200;

function distanceInMeters(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371000;
  const toRadians = (degrees) => degrees * Math.PI / 180;
  const latDistance = toRadians(lat2 - lat1);
  const lngDistance = toRadians(lng2 - lng1);
  const value = Math.sin(latDistance / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(lngDistance / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function nearestBeach(location) {
  return beaches.map((beach) => ({ ...beach, distance: distanceInMeters(location[0], location[1], beach.lat, beach.lng) }))
    .sort((a, b) => a.distance - b.distance)[0];
}

const submitFromBeachOnly = window.submitReport;
window.submitReport = async function () {
  if (!position) {
    await window.getLocation();
    if (!position) return;
  }

  const nearby = nearestBeach(position);
  if (nearby.distance > BEACH_RADIUS_METERS) {
    toast(`제보 가능 지역이 아닙니다. 가장 가까운 ${nearby.name}에서 ${(nearby.distance / 1000).toFixed(1)}km 떨어져 있습니다.`);
    return;
  }

  document.getElementById('locationText').textContent = `${nearby.name} 인근 · ${Math.round(nearby.distance)}m`;
  submitFromBeachOnly();
};
