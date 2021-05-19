import { Colors, colors } from 'react-native-elements';

const P9_GREYSCALE_LIGHT = {
  grey0: 'rgb(142,142,147)',
  grey1: 'rgb(174,174,178)',
  grey2: 'rgb(199,199,204)',
  grey3: 'rgb(209,209,214)',
  grey4: 'rgb(229,229,234)',
  grey5: 'rgb(242,242,247)',
};

export const P9_COLORS_LIGHT: Colors = {
  ...colors,
  ...P9_GREYSCALE_LIGHT,
  // blue: 'rgb(10,132,255)',
  // green: 'rgb(48,209,88)',
  // indigo: 'rgb(94,92,230)',
  // orange: 'rgb(255,159,10)',
  // pink: 'rgba(255,55,95,1)',
  // purple: 'rgb(191,90,242)',
  // red: 'rgb(255,69,58)',
  teal: 'rgb(90,200,250)',
  // yellow: 'rgb(255,214,10)',
  primary: 'rgb(255,45,85)',
  // secondary: '',
  white: 'rgb(255,255,255)',
  black: 'rgb(0,0,0)',
  background: P9_GREYSCALE_LIGHT.grey5,
  backgroundInput: P9_GREYSCALE_LIGHT.grey4,
  border: P9_GREYSCALE_LIGHT.grey0,
  // text0: 'rgb(255,255,255)',
  // text1: 'rgb(242,242,247)',
  // text2: 'rgb(229,229,234)',
  // text3: 'rgb(209,209,214)',
  // text4: 'rgb(199,199,204)',
  // text5: 'rgb(174,174,178)',
  // primary: string;
  card: P9_GREYSCALE_LIGHT.grey5,
  placeholder: P9_GREYSCALE_LIGHT.grey0,
  // text: string;
  // border: string;
  // notification: string;
};
