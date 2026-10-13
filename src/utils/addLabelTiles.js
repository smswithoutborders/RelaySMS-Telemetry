// ==============================|| MAP - CARTO LABEL TILES ||============================== //

const CARTO_BASEMAPS_KEY = import.meta.env.VITE_CARTO_BASEMAPS_KEY;

export default function addLabelTiles(L, map, isDarkMode) {
  if (!CARTO_BASEMAPS_KEY) return;

  const style = isDarkMode ? 'dark_only_labels' : 'light_only_labels';
  L.tileLayer(`https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(CARTO_BASEMAPS_KEY)}`, {
    attribution: '',
    subdomains: 'abcd',
    maxZoom: 20,
    pane: 'shadowPane'
  }).addTo(map);
}
