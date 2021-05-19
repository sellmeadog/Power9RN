import { Colors, colors } from 'react-native-elements';

const P9_GREYSCALE_DARK = {
  grey0: 'rgb(28,28,30)',
  grey1: 'rgb(44,44,46)',
  grey2: 'rgb(58,58,60)',
  grey3: 'rgb(72,72,74)',
  grey4: 'rgb(99,99,102)',
  grey5: 'rgb(142,142,147)',
};

export const P9_COLORS_DARK: Colors = {
  ...colors,
  ...P9_GREYSCALE_DARK,
  // blue: 'rgb(10,132,255)',
  // green: 'rgb(48,209,88)',
  // indigo: 'rgb(94,92,230)',
  // orange: 'rgb(255,159,10)',
  // pink: 'rgba(255,55,95,1)',
  // purple: 'rgb(191,90,242)',
  // red: 'rgb(255,69,58)',
  teal: 'rgb(100,210,255)',
  // yellow: 'rgb(255,214,10)',
  primary: 'rgb(255,159,10)',
  // secondary: '',
  background: P9_GREYSCALE_DARK.grey1,
  backgroundInput: P9_GREYSCALE_DARK.grey0,
  border: P9_GREYSCALE_DARK.grey5,
  card: P9_GREYSCALE_DARK.grey0,
  text: P9_GREYSCALE_DARK.grey5,
  placeholder: P9_GREYSCALE_DARK.grey5,
  // text0: 'rgb(255,255,255)',
  // text1: 'rgb(242,242,247)',
  // text2: 'rgb(229,229,234)',
  // text3: 'rgb(209,209,214)',
  // text4: 'rgb(199,199,204)',
  // text5: 'rgb(174,174,178)',
};
