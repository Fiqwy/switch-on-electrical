/* ==========================================================
   SWITCH ON ELECTRICAL — Service Areas Map
   Real map: Leaflet 1.9.4 + CARTO dark tiles + lime markers.
   HQ pulse on Beechmont, 7 clickable suburb markers → suburb pages.
   ========================================================== */

(function () {
  'use strict';

  if (!window.L) return;
  const mapEl = document.getElementById('areasMap');
  if (!mapEl) return;

  // Centred around the midpoint of Beechmont (hinterland) ↔ Surfers (coast).
  const map = L.map('areasMap', {
    center: [-28.05, 153.32],
    zoom: 10,
    minZoom: 9,
    maxZoom: 14,
    scrollWheelZoom: false,    // don't hijack page scroll
    zoomControl: true,
    attributionControl: true,
  });

  // CARTO dark tiles — already dark-themed, perfect base for the black palette.
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  // Custom DOM markers — full control via CSS.
  const limeIcon = L.divIcon({
    html: '<div class="map-pin"></div>',
    className: 'map-pin-wrap',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
  const hqIcon = L.divIcon({
    html: '<div class="map-pin hq"><i></i></div>',
    className: 'map-pin-wrap',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const suburbs = [
    { name: 'Beechmont',          slug: 'beechmont',          lat: -28.1219, lon: 153.1928, hq: true },
    { name: 'Tamborine Mountain', slug: 'tamborine-mountain', lat: -27.9658, lon: 153.1907 },
    { name: 'Nerang',             slug: 'nerang',             lat: -27.9889, lon: 153.3349 },
    { name: 'Mudgeeraba',         slug: 'mudgeeraba',         lat: -28.0830, lon: 153.3700 },
    { name: 'Robina',             slug: 'robina',             lat: -28.0779, lon: 153.3917 },
    { name: 'Burleigh Heads',     slug: 'burleigh-heads',     lat: -28.0879, lon: 153.4474 },
    { name: 'Broadbeach',         slug: 'broadbeach',         lat: -28.0276, lon: 153.4297 },
    { name: 'Surfers Paradise',   slug: 'surfers-paradise',   lat: -28.0023, lon: 153.4145 },
  ];

  suburbs.forEach((s) => {
    const marker = L.marker([s.lat, s.lon], { icon: s.hq ? hqIcon : limeIcon }).addTo(map);
    const tooltip = s.hq
      ? `<strong>${s.name}</strong><br><span class="tt-sub">HQ — Switch On</span>`
      : `<strong>${s.name}</strong><br><span class="tt-sub">Tap for ${s.name} quote →</span>`;
    marker.bindTooltip(tooltip, { direction: 'top', offset: [0, -8] });
    if (!s.hq) {
      marker.on('click', () => { window.location.href = `suburbs/${s.slug}.html`; });
    }
  });

  // Resize handler — fixes the map if the container changes size (e.g. orientation change).
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => map.invalidateSize(), 250);
  });
})();
