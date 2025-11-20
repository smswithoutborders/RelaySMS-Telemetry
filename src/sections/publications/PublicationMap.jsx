import { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import axios from 'axios';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import countryCoords from 'country-coords';

// components
import Loader from 'components/Loader';
import ErrorDisplay from 'components/ErrorDisplay';

countries.registerLocale(enLocale);

const coordsByCountry = countryCoords.byCountry();

export default function PublicationMap({ filters, selectedCountry, onCountrySelect }) {
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
  const geoJsonLayerRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];
  const effectiveStartDate = filters?.startDate || '2021-01-10';
  const effectiveEndDate = filters?.endDate || today;
  const effectivePlatform = filters?.platform || '';
  const effectiveStatus = filters?.status || '';
  const effectiveSource = filters?.source || '';
  const effectiveCountry = filters?.country || '';

  const fetchCountryData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        start_date: effectiveStartDate,
        end_date: effectiveEndDate,
        page: 1,
        page_size: 100
      };

      if (effectivePlatform) params.platform_name = effectivePlatform;
      if (effectiveStatus) params.status = effectiveStatus;
      if (effectiveSource) params.source = effectiveSource;
      if (effectiveCountry) params.country_code = effectiveCountry;

      const response = await axios.get(`${import.meta.env.VITE_APP_TELEMETRY_API}publications`, { params });

      const publications = response.data.publications?.data || [];

      if (!publications || publications.length === 0) {
        setCountryData([]);
        setError('');
        setLoading(false);
        return;
      }

      const countryMap = {};
      publications.forEach((pub) => {
        const countryCode = pub.country_code?.toUpperCase();
        if (countryCode && countries.isValid(countryCode, 'en')) {
          if (!countryMap[countryCode]) {
            countryMap[countryCode] = {
              countryCode: countryCode,
              country: countries.getName(countryCode, 'en'),
              publications: 0
            };
          }
          countryMap[countryCode].publications += 1;
        }
      });

      const formatted = Object.values(countryMap)
        .map((item) => {
          try {
            const countryInfo = coordsByCountry.get(item.countryCode);
            if (countryInfo && countryInfo.latitude !== undefined && countryInfo.longitude !== undefined) {
              return {
                country: item.country,
                countryCode: item.countryCode,
                publications: item.publications,
                position: { lat: countryInfo.latitude, lng: countryInfo.longitude }
              };
            }
          } catch (error) {
            console.warn(`Could not get coordinates for country code: ${item.countryCode}`, error);
          }
          return null;
        })
        .filter((item) => item !== null);

      setCountryData(formatted);
      setError('');
    } catch (err) {
      console.error('Error fetching country data:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError('Unable to load map data');
      setCountryData([]);
    } finally {
      setLoading(false);
    }
  }, [effectiveStartDate, effectiveEndDate, effectivePlatform, effectiveStatus, effectiveSource, effectiveCountry]);

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
          zoom: 0,
          minZoom: 0,
          maxZoom: 18,
          zoomControl: true,
          attributionControl: true,
          zoomAnimation: true,
          fadeAnimation: true,
          markerZoomAnimation: true,
          scrollWheelZoom: false,
          touchZoom: false,
          doubleClickZoom: false
        });

        map.zoomControl.setPosition('topleft');

        mapInstanceRef.current = map;

        const bgColor = isDarkMode ? '#0f0f0fff' : '#fafafa';
        container.style.backgroundColor = bgColor;

        L.tileLayer(
          isDarkMode
            ? 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
          {
            attribution: '',
            subdomains: 'abcd',
            maxZoom: 20,
            pane: 'shadowPane'
          }
        ).addTo(map);

        const publicationCounts = countryData.map((d) => d.publications).sort((a, b) => a - b);
        const lowThreshold = publicationCounts[Math.floor(publicationCounts.length / 3)];
        const mediumThreshold = publicationCounts[Math.floor((publicationCounts.length * 2) / 3)];

        const getColor = (publications) => {
          if (publications === undefined || publications === null) return null;
          if (publications <= lowThreshold) {
            return '#C7D3FF';
          } else if (publications <= mediumThreshold) {
            return '#577BFF';
          } else {
            return '#0024A8';
          }
        };

        const countryDataMap = {};
        countryData.forEach((item) => {
          countryDataMap[item.countryCode] = {
            publications: item.publications,
            country: item.country,
            color: getColor(item.publications)
          };
        });

        markersRef.current = [];

        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
          .then((response) => response.json())
          .then((data) => {
            const geoJsonLayer = L.geoJSON(data, {
              style: (feature) => {
                const countryCode = feature.properties['ISO3166-1-Alpha-2'];
                const countryInfo = countryDataMap[countryCode];

                if (countryInfo) {
                  return {
                    fillColor: countryInfo.color,
                    fillOpacity: 0.8,
                    color: isDarkMode ? '#475569' : '#d8d8d8ff',
                    weight: 1.5
                  };
                } else {
                  return {
                    fillColor: isDarkMode ? '#2d2d2d' : '#e8e8e8',
                    fillOpacity: 0.6,
                    color: isDarkMode ? '#475569' : '#cccccc',
                    weight: 1
                  };
                }
              },
              onEachFeature: (feature, layer) => {
                const countryCode = feature.properties['ISO3166-1-Alpha-2'];
                const countryInfo = countryDataMap[countryCode];

                if (countryInfo) {
                  markersRef.current.push({
                    layer: layer,
                    color: countryInfo.color,
                    publications: countryInfo.publications,
                    countryCode: countryCode,
                    originalOpacity: 0.7
                  });

                  layer.bindTooltip(
                    `<div style="text-align: start;">
                      <h3>${countryInfo.country}</h3>
                      <span style="font-size: 11px;">${countryInfo.publications.toLocaleString()} publications</span>
                    </div>`,
                    {
                      direction: 'top',
                      offset: [0, 0],
                      opacity: 0.95,
                      className: 'custom-tooltip'
                    }
                  );

                  layer.bindPopup(
                    `<div style="min-width: 150px; padding: 4px;">
                      <strong style="font-size: 15px; color: ${countryInfo.color};">${countryInfo.country}</strong><br/>
                      <span style="font-size: 13px; color: #666;">Publications: <strong style="color: #333;">${countryInfo.publications.toLocaleString()}</strong></span>
                    </div>`,
                    {
                      maxWidth: 250,
                      className: 'custom-popup'
                    }
                  );

                  layer.on('click', function () {
                    onCountrySelect?.(countryCode === selectedCountry ? null : countryCode);
                  });

                  layer.on('mouseover', function (e) {
                    if (selectedColor === null || selectedColor === countryInfo.color) {
                      this.setStyle({
                        fillOpacity: 0.9,
                        weight: 2,
                        color: '#ffffff'
                      });
                    }
                  });

                  layer.on('mouseout', function () {
                    const layerData = markersRef.current.find((m) => m.layer === layer);
                    if (layerData) {
                      if (selectedColor === null) {
                        this.setStyle({
                          fillOpacity: layerData.originalOpacity,
                          weight: 1,
                          color: isDarkMode ? '#475569' : '#d8d8d8ff'
                        });
                      } else if (selectedColor === countryInfo.color) {
                        this.setStyle({
                          fillOpacity: 0.9,
                          weight: 1,
                          color: isDarkMode ? '#475569' : '#d8d8d8ff'
                        });
                      } else {
                        this.setStyle({
                          fillOpacity: 0.2,
                          weight: 1,
                          color: isDarkMode ? '#475569' : '#d8d8d8ff'
                        });
                      }
                    }
                  });
                }
              },
              pane: 'tilePane'
            }).addTo(map);

            geoJsonLayerRef.current = geoJsonLayer;

            if (countryData.length > 0) {
              const bounds = [];
              countryData.forEach((item) => {
                bounds.push([item.position.lat, item.position.lng]);
              });
              map.fitBounds(bounds, { padding: [10, 10], maxZoom: 1.4 });
            }
          })
          .catch((error) => console.error('Error loading GeoJSON:', error));

        setMapLoaded(true);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Unable to initialize map');
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
  }, [countryData, isDarkMode]);

  useEffect(() => {
    setMapLoaded(false);
  }, [filters]);

  useEffect(() => {
    if (!mapLoaded || markersRef.current.length === 0) return;

    markersRef.current.forEach(({ layer, color, countryCode, originalOpacity }) => {
      if (selectedCountry && countryCode === selectedCountry) {
        layer.setStyle({
          fillOpacity: 1,
          weight: 3,
          color: '#f1a35aff'
        });
        layer.openPopup();
        if (mapInstanceRef.current) {
          const bounds = layer.getBounds();
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 0.5 });
        }
      } else if (selectedCountry) {
        layer.setStyle({
          fillOpacity: 0.3,
          weight: 1,
          color: isDarkMode ? '#475569' : '#d8d8d8ff'
        });
      } else {
        layer.setStyle({
          fillOpacity: originalOpacity,
          weight: 1,
          color: isDarkMode ? '#475569' : '#d8d8d8ff'
        });
        layer.closePopup();
      }
    });
  }, [selectedCountry, mapLoaded, isDarkMode]);

  const handleRetry = () => {
    setError('');
    fetchCountryData();
  };

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
      markersRef.current.forEach(({ layer }) => {
        layer.setStyle({
          fillOpacity: 0.7
        });
      });
    } else {
      setSelectedColor(color);
      markersRef.current.forEach(({ layer, color: layerColor }) => {
        if (layerColor === color) {
          layer.setStyle({
            fillOpacity: 0.9
          });
        } else {
          layer.setStyle({
            fillOpacity: 0.2
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
          
          /* Country hover transition */
          .leaflet-interactive {
            transition: fill-opacity 0.2s ease, stroke-width 0.2s ease !important;
            cursor: pointer !important;
          }
          
          .leaflet-interactive:hover {
            stroke-width: 2 !important;
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
        sx={{
          height: '100%',
          minHeight: { xs: '300px', sm: '400px' },
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
        {!loading && error && <ErrorDisplay onRetry={handleRetry} fullHeight />}
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
                top: { xs: 8, sm: 90 },
                left: { xs: 8, sm: 10 },
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
                left: { xs: 10, sm: 20 },
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
                sx={{ fontWeight: 600, mb: 1, color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.75rem' } }}
              >
                Publications
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {[
                  { color: '#C7D3FF', label: 'Low', value: 'low' },
                  { color: '#577BFF', label: 'Medium', value: 'medium' },
                  { color: '#0024A8', label: 'High', value: 'high' }
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
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        border: '2px solid #ffffff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        flexShrink: 0
                      }}
                    />
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' }, color: 'text.secondary' }}>
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

PublicationMap.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    platform: PropTypes.string,
    status: PropTypes.string,
    source: PropTypes.string,
    country: PropTypes.string
  }),
  selectedCountry: PropTypes.string,
  onCountrySelect: PropTypes.func
};
