module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', {legacy: true}],
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
