import { createTheme } from '@mui/material/styles';

// third-party
import { presetDarkPalettes, presetPalettes } from '@ant-design/colors';

// project imports
import ThemeOption from './theme';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode, presetColor) {
  const colors = presetPalettes;
  const darkColors = presetDarkPalettes;

  let greyPrimary = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#f0f0f0',
    '#d9d9d9',
    '#bfbfbf',
    '#8c8c8c',
    '#595959',
    '#262626',
    '#141414',
    '#000000'
  ];
  let greyAscent = ['#fafafa', '#bfbfbf', '#434343', '#1f1f1f'];
  let greyConstant = ['#fafafb', '#e6ebf1'];

  // let darkGreyPrimary = [
  //   '#000000',
  //   '#141414',
  //   '#262626',
  //   '#4d4d4d',
  //   '#595959',
  //   '#8c8c8c',
  //   '#bfbfbf',
  //   '#d9d9d9',
  //   '#f0f0f0',
  //   '#f5f5f5',
  //   '#fafafa'
  // ];
  // Dark Mode Greys for Very Dark Blue Theme
  let darkGreyPrimary = [
    '#ffffffff', // 0 - lightest (for text on dark bg)
    '#f5f5f5ff', // 1
    '#e2e8f0', // 2
    '#cbd5e1', // 3
    '#aab7c4', // 4
    '#99a1acff', // 5
    '#5c6672ff', // 6
    '#2e323aff', // 7
    '#27292eff', // 8
    '#1d2022ff', // 9
    '#1e2124ff' // 10 - darkest (for backgrounds)
  ];

  let darkGreyAscent = ['#121314ff', '#1d2022ff', '#5e6d7eff', '#5c6672ff'];

  let darkGreyConstant = ['#0a1929', '#112240'];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];
  darkColors.grey = [...darkGreyPrimary, ...darkGreyAscent, ...darkGreyConstant];

  const paletteColor = ThemeOption(mode === 'dark' ? darkColors : colors, presetColor, mode);

  return createTheme({
    palette: {
      mode,
      common: {
        black: '#000',
        white: '#fff'
      },
      ...paletteColor,
      text: {
        primary: paletteColor.grey[mode === 'dark' ? 200 : 700],
        secondary: paletteColor.grey[mode === 'dark' ? 400 : 500],
        disabled: paletteColor.grey[mode === 'dark' ? 600 : 400]
      },
      action: {
        disabled: paletteColor.grey[mode === 'dark' ? 700 : 300]
      },
      divider: paletteColor.grey[mode === 'dark' ? 700 : 200],
      background: {
        paper: paletteColor.grey[mode === 'dark' ? 800 : 0],
        default: paletteColor.grey[mode === 'dark' ? 900 : 'A50']
      }
    }
  });
}
