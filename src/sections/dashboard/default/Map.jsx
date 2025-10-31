import { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography, Paper, IconButton, useTheme } from '@mui/material';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import axios from 'axios';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

const countryCoordinates = {
  US: { lat: 37.0902, lng: -95.7129 },
  CA: { lat: 56.1304, lng: -106.3468 },
  GB: { lat: 55.3781, lng: -3.436 },
  DE: { lat: 51.1657, lng: 10.4515 },
  FR: { lat: 46.2276, lng: 2.2137 },
  IT: { lat: 41.8719, lng: 12.5674 },
  ES: { lat: 40.4637, lng: -3.7492 },
  AU: { lat: -25.2744, lng: 133.7751 },
  JP: { lat: 36.2048, lng: 138.2529 },
  CN: { lat: 35.8617, lng: 104.1954 },
  IN: { lat: 20.5937, lng: 78.9629 },
  BR: { lat: -14.235, lng: -51.9253 },
  MX: { lat: 23.6345, lng: -102.5528 },
  RU: { lat: 61.524, lng: 105.3188 },
  ZA: { lat: -30.5595, lng: 22.9375 },
  NG: { lat: 9.082, lng: 8.6753 },
  CM: { lat: 7.3697, lng: 12.3547 },
  EG: { lat: 26.8206, lng: 30.8025 },
  KE: { lat: -0.0236, lng: 37.9062 },
  GH: { lat: 7.9465, lng: -1.0232 },
  UG: { lat: 1.3733, lng: 32.2903 },
  TZ: { lat: -6.369, lng: 34.8888 },
  ET: { lat: 9.145, lng: 40.4897 },
  AR: { lat: -38.4161, lng: -63.6167 },
  CL: { lat: -35.6751, lng: -71.543 },
  CO: { lat: 4.5709, lng: -74.2973 },
  PE: { lat: -9.19, lng: -75.0152 },
  VE: { lat: 6.4238, lng: -66.5897 },
  TH: { lat: 15.87, lng: 100.9925 },
  VN: { lat: 14.0583, lng: 108.2772 },
  PH: { lat: 12.8797, lng: 121.774 },
  ID: { lat: -0.7893, lng: 113.9213 },
  MY: { lat: 4.2105, lng: 101.9758 },
  SG: { lat: 1.3521, lng: 103.8198 },
  KR: { lat: 35.9078, lng: 127.7669 },
  PK: { lat: 30.3753, lng: 69.3451 },
  BD: { lat: 23.685, lng: 90.3563 },
  NP: { lat: 28.3949, lng: 84.124 },
  LK: { lat: 7.8731, lng: 80.7718 },
  SA: { lat: 23.8859, lng: 45.0792 },
  AE: { lat: 23.4241, lng: 53.8478 },
  TR: { lat: 38.9637, lng: 35.2433 },
  IL: { lat: 31.0461, lng: 34.8516 },
  PL: { lat: 51.9194, lng: 19.1451 },
  UA: { lat: 48.3794, lng: 31.1656 },
  RO: { lat: 45.9432, lng: 24.9668 },
  NL: { lat: 52.1326, lng: 5.2913 },
  BE: { lat: 50.5039, lng: 4.4699 },
  SE: { lat: 60.1282, lng: 18.6435 },
  NO: { lat: 60.472, lng: 8.4689 },
  DK: { lat: 56.2639, lng: 9.5018 },
  FI: { lat: 61.9241, lng: 25.7482 },
  AT: { lat: 47.5162, lng: 14.5501 },
  CH: { lat: 46.8182, lng: 8.2275 },
  PT: { lat: 39.3999, lng: -8.2245 },
  GR: { lat: 39.0742, lng: 21.8243 },
  CZ: { lat: 49.8175, lng: 15.473 },
  HU: { lat: 47.1625, lng: 19.5033 },
  IE: { lat: 53.4129, lng: -8.2439 },
  NZ: { lat: -40.9006, lng: 174.886 },
  HR: { lat: 45.1, lng: 15.2 },
  SI: { lat: 46.1512, lng: 14.9955 },
  SK: { lat: 48.669, lng: 19.699 },
  LT: { lat: 55.1694, lng: 23.8813 },
  LV: { lat: 56.8796, lng: 24.6032 },
  EE: { lat: 58.5953, lng: 25.0136 },
  BG: { lat: 42.7339, lng: 25.4858 },
  RS: { lat: 44.0165, lng: 21.0059 },
  BA: { lat: 43.9159, lng: 17.6791 },
  MK: { lat: 41.6086, lng: 21.7453 },
  AL: { lat: 41.1533, lng: 20.1683 },
  MT: { lat: 35.9375, lng: 14.3754 },
  CY: { lat: 35.1264, lng: 33.4299 },
  LU: { lat: 49.8153, lng: 6.1296 },
  IS: { lat: 64.9631, lng: -19.0208 }
};

export default function CountryMap({ filters }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const containerRef = useRef(null);

  const today = new Date();
  const effectiveStartDate = filters?.startDate || '2020-01-10';
  const effectiveEndDate = filters?.endDate || today.toISOString().split('T')[0];
  const effectiveGranularity = filters?.granularity || 'day';
  const effectiveCategory = filters?.category || 'signup';

  const userLabel = effectiveCategory === 'signup' ? 'Signed Up Users' : 'Active Users';

  const fetchCountryData = useCallback(async () => {
    setLoading(true);
    try {
      const countryParam = filters?.countryCode ? `&country_code=${filters.countryCode}` : '';
      const response = await axios.get(
        `${import.meta.env.VITE_APP_TELEMETRY_API}${effectiveCategory}?start_date=${effectiveStartDate}&end_date=${effectiveEndDate}&granularity=${effectiveGranularity}&group_by=country&page=1&page_size=100${countryParam}`
      );

      const categoryKey = effectiveCategory.includes('retained') ? 'retained' : 'signup';
      const countryStats = response.data[categoryKey]?.data || [];

      const formatted = countryStats
        .map((item) => {
          const rawCode = item?.country_code;
          const code = typeof rawCode === 'string' ? rawCode.toUpperCase() : undefined;
          const isValidCode = code && countries.isValid(code, 'en');
          const name = isValidCode ? countries.getName(code, 'en') : 'Unknown';
          const count = item.signup_users ?? item.retained_users ?? 0;

          if (isValidCode && countryCoordinates[code]) {
            return {
              country: name || code || 'Unknown',
              countryCode: code,
              users: count,
              position: countryCoordinates[code]
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      setCountryData(formatted);
      setError('');
    } catch (err) {
      console.error('Error fetching country data:', err);
      setError('Failed to load country data');
    } finally {
      setLoading(false);
    }
  }, [effectiveCategory, effectiveStartDate, effectiveEndDate, effectiveGranularity, filters?.countryCode]);

  useEffect(() => {
    fetchCountryData();
  }, [fetchCountryData]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.L || !mapRef.current || countryData.length === 0) return;

    const initializeMap = () => {
      try {
        console.log('Initializing map with', countryData.length, 'countries');

        const L = window.L;

        if (mapInstanceRef.current) {
          console.log('Removing existing map');
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const container = mapRef.current;

        container._leaflet_id = null;
        container.innerHTML = '';

        console.log('Creating map on clean container');

        const map = L.map(container, {
          center: [20, 0],
          zoom: 2,
          minZoom: 2,
          maxZoom: 18,
          zoomControl: true,
          attributionControl: true,
          zoomAnimation: true,
          fadeAnimation: true,
          markerZoomAnimation: true
        });

        map.zoomControl.setPosition('topleft');

        mapInstanceRef.current = map;

        console.log('Map instance created:', map);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
          attribution: '',
          subdomains: 'abcd',
          maxZoom: 20,
          pane: 'shadowPane'
        }).addTo(map);

        console.log('Tile layer added');

        const userCounts = countryData.map((d) => d.users).sort((a, b) => a - b);
        const lowThreshold = userCounts[Math.floor(userCounts.length / 3)];
        const mediumThreshold = userCounts[Math.floor((userCounts.length * 2) / 3)];

        const getColor = (users) => {
          if (users <= lowThreshold) {
            return '#4caf50';
          } else if (users <= mediumThreshold) {
            return '#ff9800';
          } else {
            return '#f44336';
          }
        };

        console.log('Color thresholds:', { low: lowThreshold, medium: mediumThreshold });
        console.log('Adding', countryData.length, 'circle markers...');

        markersRef.current = [];

        const bounds = [];
        countryData.forEach((item, index) => {
          console.log(`Adding circle ${index + 1}:`, item.country, item.position);

          const circleColor = getColor(item.users);

          const circle = L.circleMarker([item.position.lat, item.position.lng], {
            radius: 6,
            color: '#ffffff',
            fillColor: circleColor,
            fillOpacity: 0.7,
            weight: 1,
            className: 'pulse-marker'
          }).addTo(map);

          console.log('Circle added:', circle);

          markersRef.current.push({
            marker: circle,
            color: circleColor,
            users: item.users,
            originalRadius: 6,
            originalOpacity: 0.7
          });

          circle.bindTooltip(
            `<div style="text-align: start;">
              <h3>${item.country}</h3>
              <span style="font-size: 11px;">${item.users.toLocaleString()} ${userLabel.toLowerCase()}</span>
            </div>`,
            {
              direction: 'top',
              offset: [0, -5],
              opacity: 0.95,
              className: 'custom-tooltip'
            }
          );

          circle.bindPopup(
            `<div style="min-width: 150px; padding: 4px;">
              <strong style="font-size: 15px; color: ${circleColor};">${item.country}</strong><br/>
              <span style="font-size: 13px; color: #666;">${userLabel}: <strong style="color: #333;">${item.users.toLocaleString()}</strong></span>
            </div>`,
            {
              maxWidth: 250,
              className: 'custom-popup'
            }
          );

          circle.on('mouseover', function () {
            if (selectedColor === null || selectedColor === circleColor) {
              this.setStyle({
                radius: 9,
                fillOpacity: 1,
                weight: 2
              });
            }
          });

          circle.on('mouseout', function () {
            const markerData = markersRef.current.find((m) => m.marker === circle);
            if (markerData) {
              if (selectedColor === null) {
                this.setStyle({
                  radius: markerData.originalRadius,
                  fillOpacity: markerData.originalOpacity,
                  weight: 1
                });
              } else if (selectedColor === circleColor) {
                this.setStyle({
                  radius: 8,
                  fillOpacity: 1,
                  weight: 1
                });
              } else {
                this.setStyle({
                  radius: 6,
                  fillOpacity: 0.2,
                  weight: 1
                });
              }
            }
          });

          bounds.push([item.position.lat, item.position.lng]);
        });

        console.log('Markers added, fitting bounds...');

        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 4 });
          console.log('Bounds fitted to:', bounds.length, 'markers');
        }

        console.log('Map state:', {
          center: map.getCenter(),
          zoom: map.getZoom(),
          size: map.getSize(),
          bounds: map.getBounds()
        });

        setMapLoaded(true);
        console.log('Map initialization complete');
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load map');
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryData, userLabel]);

  useEffect(() => {
    setMapLoaded(false);
  }, [filters]);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullscreen]);

  const handleColorClick = (color) => {
    if (selectedColor === color) {
      setSelectedColor(null);
      markersRef.current.forEach(({ marker, color: markerColor }) => {
        marker.setStyle({
          fillOpacity: 0.7,
          radius: 6
        });
      });
    } else {
      setSelectedColor(color);
      markersRef.current.forEach(({ marker, color: markerColor }) => {
        if (markerColor === color) {
          marker.setStyle({
            fillOpacity: 1,
            radius: 8
          });
        } else {
          marker.setStyle({
            fillOpacity: 0.2,
            radius: 6
          });
        }
      });
    }
  };

  return (
    <>
      <style>
        {`
          /* Tooltip styling */
          .custom-tooltip {
            background-color: ${isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)'} !important;
            border: 1px solid ${isDarkMode ? '#334155' : '#ddd'} !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
            padding: 6px 10px !important;
            font-family: inherit !important;
            color: ${isDarkMode ? '#e2e8f0' : '#333'} !important;
          }
          
          .custom-tooltip::before {
            border-top-color: ${isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)'} !important;
          }
          
          /* Popup styling */
          .custom-popup .leaflet-popup-content-wrapper {
            background-color: ${isDarkMode ? '#1e293b' : '#fff'} !important;
            color: ${isDarkMode ? '#e2e8f0' : '#333'} !important;
            border-radius: 8px !important;
            box-shadow: 0 3px 14px rgba(0,0,0,0.3) !important;
          }
          
          .custom-popup .leaflet-popup-tip {
            background-color: ${isDarkMode ? '#1e293b' : '#fff'} !important;
            box-shadow: 0 3px 14px rgba(0,0,0,0.3) !important;
          }
          
          /* Zoom control styling */
          .leaflet-control-zoom {
            border: none !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
            border-radius: 8px !important;
            overflow: hidden !important;
          }
          
          .leaflet-control-zoom a {
            background-color: ${isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)'} !important;
            border: none !important;
            color: ${isDarkMode ? '#e2e8f0' : '#333'} !important;
            font-size: 18px !important;
            line-height: 32px !important;
            width: 32px !important;
            height: 32px !important;
          }
          
          .leaflet-control-zoom a:hover {
            background-color: ${isDarkMode ? 'rgba(51, 65, 85, 1)' : 'rgba(255, 255, 255, 1)'} !important;
            color: #1976d2 !important;
          }
          
          /* Marker pulse animation */
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .pulse-marker:hover {
            animation: pulse 0.1s ease-in-out;
          }
          
          /* Attribution styling */
          .leaflet-control-attribution {
            background-color: ${isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)'} !important;
            color: ${isDarkMode ? '#94a3b8' : '#666'} !important;
            font-size: 10px !important;
            padding: 2px 5px !important;
          }
          
          .leaflet-control-attribution a {
            color: ${isDarkMode ? '#60a5fa' : '#0078A8'} !important;
          }
        `}
      </style>
      <Box
        ref={containerRef}
        component={Paper}
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          ...(isFullscreen && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            borderRadius: 0
          })
        }}
      >
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ flex: 1 }}>
            <CircularProgress />
          </Box>
        )}
        {!loading && error && (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ flex: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        {!loading && !error && countryData.length > 0 && (
          <Box sx={{ position: 'relative', flex: 1, width: '100%', minHeight: 0 }}>
            <Box
              ref={mapRef}
              sx={{
                height: '100%',
                width: '100%'
              }}
            />
            <IconButton
              onClick={toggleFullscreen}
              sx={(theme) => ({
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                color: 'text.primary',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: 1000,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 1)' : 'rgba(255, 255, 255, 1)'
                }
              })}
            >
              {isFullscreen ? <FullscreenExitOutlined style={{ fontSize: 20 }} /> : <FullscreenOutlined style={{ fontSize: 20 }} />}
            </IconButton>
            <Box
              sx={(theme) => ({
                position: 'absolute',
                bottom: 20,
                right: 20,
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                padding: '12px 16px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: 1000
              })}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                {userLabel}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {[
                  { color: '#4caf50', label: 'Low', value: 'low' },
                  { color: '#ff9800', label: 'Medium', value: 'medium' },
                  { color: '#f44336', label: 'High', value: 'high' }
                ].map((item) => (
                  <Box
                    key={item.value}
                    onClick={() => handleColorClick(item.color)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s',
                      backgroundColor: selectedColor === item.color ? 'rgba(0,0,0,0.08)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        border: '2px solid #ffffff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        flexShrink: 0
                      }}
                    />
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
        {!loading && !error && countryData.length === 0 && (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ flex: 1 }}>
            <Typography color="text.secondary">No country data available for the selected filters</Typography>
          </Box>
        )}
      </Box>
    </>
  );
}

CountryMap.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    groupBy: PropTypes.string,
    granularity: PropTypes.string,
    category: PropTypes.string,
    countryCode: PropTypes.string
  })
};
