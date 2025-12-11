import { createTheme } from '@mui/material/styles';

// third-party
import { presetDarkPalettes, presetPalettes } from '@ant-design/colors';

// project imports
import ThemeOption from './theme';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode, presetColor) {
  const colors = presetPalettes;
  const darkColors = presetDarkPalettes;

  // Custom blue color palette based on #336AFF for primary color
  const customBlue = [
    '#d8e3fcff', // 0 - lightest
    '#bfd4fdff', // 1
    '#a2c1fdff', // 2
    '#85ACFF', // 3 - light
    '#5C8FFF', // 4
    '#336AFF', // 5 - main
    '#2952CC', // 6 - dark
    '#1F3D99', // 7
    '#142966', // 8 - darker
    '#0A1433', // 9
    '#050A1A' // 10 - darkest
  ];

  // Custom orange color palette based on #E66F00 for secondary/graph use
  const customOrange = [
    '#FFF7F0', // 0 - lightest
    '#FFE8D6', // 1
    '#FFD4B3', // 2
    '#FFC08F', // 3 - light
    '#FF9B5C', // 4
    '#FF9E43', // 5 - main
    '#C75F00', // 6 - dark
    '#A84F00', // 7
    '#8A4000', // 8 - darker
    '#6B3000', // 9
    '#4D2100' // 10 - darkest
  ];

  // Override blue with custom blue for primary color
  colors.blue = customBlue;
  darkColors.blue = customBlue;

  // Add custom orange as cyan for secondary/graph use
  colors.cyan = customOrange;
  darkColors.cyan = customOrange;

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
    '#fafafa', // 0 - lightest (for text on dark bg)
    '#f5f5f5', // 1
    '#f0f0f0', // 2
    '#d9d9d9', // 3
    '#bfbfbf', // 4
    '#8c8c8c', // 5
    '#595959', // 6
    '#4d4d4d', // 7
    '#262626', // 8
    '#141414ff', // 9
    '#0f0f0fff' // 10 - darkest (for backgrounds)
  ];

  let darkGreyAscent = ['#1f1f1f', '#2b2b2bff', '#afafafff', '#ccccccff'];

  let darkGreyConstant = ['#0a1929', '#333333ff'];

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
