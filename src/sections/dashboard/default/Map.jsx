import { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, IconButton, useTheme } from '@mui/material';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import axios from 'axios';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import countryCoords from 'country-coords';

// components
import Loader from 'components/Loader';

countries.registerLocale(enLocale);

const coordsByCountry = countryCoords.byCountry();

export default function CountryMap({ filters, selectedCountry, onCountrySelect }) {
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

          if (isValidCode) {
            try {
              const countryInfo = coordsByCountry.get(code);
              if (countryInfo && countryInfo.latitude !== undefined && countryInfo.longitude !== undefined) {
                return {
                  country: name || code || 'Unknown',
                  countryCode: code,
                  users: count,
                  position: { lat: countryInfo.latitude, lng: countryInfo.longitude }
                };
              }
            } catch (error) {
              console.warn(`Could not get coordinates for country code: ${code}`, error);
            }
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
        const L = window.L;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const container = mapRef.current;

        container._leaflet_id = null;
        container.innerHTML = '';

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

        map.on('click', function (e) {
          const clickedOnMarker = markersRef.current.some(({ marker }) => {
            const markerLatLng = marker.getLatLng();
            const distance = map.distance(e.latlng, markerLatLng);
            return distance < 50;
          });

          if (!clickedOnMarker) {
            onCountrySelect?.(null);
          }
        });

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

        markersRef.current = [];

        const bounds = [];
        countryData.forEach((item, index) => {
          const circleColor = getColor(item.users);

          const circle = L.circleMarker([item.position.lat, item.position.lng], {
            radius: 6,
            color: '#ffffff',
            fillColor: circleColor,
            fillOpacity: 0.7,
            weight: 1,
            className: 'pulse-marker'
          }).addTo(map);

          markersRef.current.push({
            marker: circle,
            color: circleColor,
            users: item.users,
            originalRadius: 6,
            originalOpacity: 0.7,
            countryCode: item.countryCode
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

          circle.on('click', function () {
            onCountrySelect?.(item.countryCode === selectedCountry ? null : item.countryCode);
          });

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

        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 4 });
        }

        setMapLoaded(true);
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

  useEffect(() => {
    if (!mapLoaded || markersRef.current.length === 0) return;

    markersRef.current.forEach(({ marker, color, countryCode, originalRadius, originalOpacity }) => {
      if (selectedCountry && countryCode === selectedCountry) {
        marker.setStyle({
          radius: 12,
          fillOpacity: 1,
          weight: 3,
          color: '#f1a35aff'
        });
        marker.openPopup();
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true, duration: 0.5 });
        }
      } else if (selectedCountry) {
        marker.setStyle({
          radius: originalRadius,
          fillOpacity: 0.3,
          weight: 1,
          color: '#ffffff'
        });
      } else {
        marker.setStyle({
          radius: originalRadius,
          fillOpacity: originalOpacity,
          weight: 1,
          color: '#ffffff'
        });
        marker.closePopup();
      }
    });
  }, [selectedCountry, mapLoaded]);

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
          minHeight: { xs: '400px', sm: '500px', md: '600px' },
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
            <Loader size={50} fullScreen={false} />
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
                top: { xs: 8, sm: 10 },
                right: { xs: 8, sm: 10 },
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                color: 'text.primary',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: 1000,
                padding: { xs: '6px', sm: '8px' },
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 1)' : 'rgba(255, 255, 255, 1)'
                }
              })}
            >
              {isFullscreen ? <FullscreenExitOutlined style={{ fontSize: '18px' }} /> : <FullscreenOutlined style={{ fontSize: '18px' }} />}
            </IconButton>
            <Box
              sx={(theme) => ({
                position: 'absolute',
                bottom: { xs: 10, sm: 20 },
                right: { xs: 10, sm: 20 },
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                padding: { xs: '8px 12px', sm: '12px 16px' },
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: 1000,
                maxWidth: { xs: '140px', sm: 'none' }
              })}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
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
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: 'text.secondary' }}>
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
  }),
  selectedCountry: PropTypes.string,
  onCountrySelect: PropTypes.func
};
