module.exports = {
  plugins: [
    'babel-plugin-transform-typescript-metadata',
    'react-native-reanimated/plugin',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
  presets: ['module:metro-react-native-babel-preset'],
};
