// material-ui
import { alpha, keyframes, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// assets
import worldDots from '/world-dots.svg';

// ==============================|| LOGIN - WORLD MAP BACKGROUND ||============================== //

const MAP_WIDTH = 3600;
const MAP_HEIGHT = 1420;
const LAT_MAX = 84;
const LAT_SPAN = 142;

const project = ([lat, lon]) => [((lon + 180) / 360) * MAP_WIDTH, ((LAT_MAX - lat) / LAT_SPAN) * MAP_HEIGHT];

const SIGNALS = {
  yaounde: [3.87, 11.52],
  lagos: [6.52, 3.38],
  nairobi: [-1.29, 36.82],
  tehran: [35.69, 51.39],
  delhi: [28.61, 77.21],
  jakarta: [-6.2, 106.85],
  berlin: [52.52, 13.4],
  saoPaulo: [-23.55, -46.63],
  mexicoCity: [19.43, -99.13]
};

const ROUTES = [
  ['yaounde', 'berlin'],
  ['lagos', 'saoPaulo'],
  ['nairobi', 'delhi'],
  ['tehran', 'berlin'],
  ['delhi', 'jakarta'],
  ['mexicoCity', 'lagos']
];

// Quadratic curve bowed upwards in proportion to its length.
const arcPath = (from, to) => {
  const [x1, y1] = project(SIGNALS[from]);
  const [x2, y2] = project(SIGNALS[to]);
  const lift = Math.hypot(x2 - x1, y2 - y1) * 0.25;
  return `M${x1} ${y1}Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - lift} ${x2} ${y2}`;
};

const ping = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(4); opacity: 0; }
`;

const travel = keyframes`
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: -1; }
`;

export default function LoginBackground() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accent = theme.palette.primary.main;
  const background = theme.palette.background.default;

  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: `radial-gradient(ellipse at 20% 10%, ${alpha(accent, isDark ? 0.22 : 0.12)}, transparent 55%),
          radial-gradient(ellipse at 85% 90%, ${alpha(theme.palette.info.main, isDark ? 0.18 : 0.1)}, transparent 50%),
          ${background}`,
        '@media (prefers-reduced-motion: reduce)': {
          '& *': { animation: 'none !important' }
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'max(115vw, 960px)',
          aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}`,
          transform: 'translate(-50%, -50%)',
          '@media (orientation: portrait)': { width: '210vh' }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: alpha(isDark ? theme.palette.grey[400] : accent, isDark ? 0.22 : 0.2),
            maskImage: `url(${worldDots})`,
            maskSize: '100% 100%',
            maskRepeat: 'no-repeat'
          }}
        />

        <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <linearGradient id="login-route" x1="0" x2="1">
              <stop offset="0" stopColor={accent} stopOpacity="0" />
              <stop offset="0.5" stopColor={accent} stopOpacity="0.9" />
              <stop offset="1" stopColor={accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          {ROUTES.map(([from, to], i) => (
            <g key={`${from}-${to}`}>
              <path d={arcPath(from, to)} fill="none" stroke={alpha(accent, isDark ? 0.25 : 0.2)} strokeWidth="3" strokeDasharray="10 14" />
              <Box
                component="path"
                d={arcPath(from, to)}
                pathLength="1"
                fill="none"
                stroke="url(#login-route)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="0.25 0.75"
                sx={{ animation: `${travel} ${5 + i}s linear ${i * 0.8}s infinite` }}
              />
            </g>
          ))}
          {Object.entries(SIGNALS).map(([name, coords], i) => {
            const [cx, cy] = project(coords);
            return (
              <g key={name}>
                <Box
                  component="circle"
                  cx={cx}
                  cy={cy}
                  r="9"
                  fill={accent}
                  sx={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animation: `${ping} 2.8s ease-out ${(i * 0.45) % 2.8}s infinite`
                  }}
                />
                <circle cx={cx} cy={cy} r="7" fill={accent} />
              </g>
            );
          })}
        </svg>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 35%, ${alpha(background, 0.85)} 100%)`
        }}
      />
    </Box>
  );
}
