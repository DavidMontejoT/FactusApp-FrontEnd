module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['@babel/preset-env', { modules: false }],
      '@babel/preset-react'
    ],
    plugins: [
      'react-native-web'
    ]
  };
};
