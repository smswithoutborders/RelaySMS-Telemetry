import { createTheme } from '@mui/material/styles';

// third-party
import { presetDarkPalettes, presetPalettes } from '@ant-design/colors';

// project imports
import ThemeOption from './theme';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode, presetColor) {
  const colors = presetPalettes;
  const darkColors = presetDarkPalettes;

  // Custom blue color palette based on #1F4FFF for primary color
  const customBlue = [
    '#d8e3fcff', // 0 - lightest
    '#bfd4fdff', // 1
    '#C7D3FF', // 2
    '#8FA7FF', // 3 - light
    '#6384f9', // 4
    '#577BFF', // 5 - main
    '#0031E0', // 6 - dark
    '#0024A8', // 7
    '#001871', // 8 - darker
    '#000158', // 9
    '#000824' // 10 - darkest
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

  // Softer status colours for published/failed, the same in both modes. Checked with the dataviz palette validator:
  // passes on white and on the #181818 dark card, and stays apart for red-green colour blindness (ΔE 10.4).
  // `dark` is the deeper shade for white text on solid chips (4.8:1 and 5.8:1).
  paletteColor.success = { ...paletteColor.success, main: '#46AB7B', dark: '#2C8159' };
  paletteColor.error = { ...paletteColor.error, main: '#BF4844', dark: '#B03F3C' };

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
      // Enough gap between page and card that cards read as contained panels.
      background: {
        paper: mode === 'dark' ? '#181818' : paletteColor.grey[0],
        default: mode === 'dark' ? '#0b0b0b' : '#f3f4f7'
      }
    }
  });
}
