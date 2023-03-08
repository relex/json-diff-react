module.exports = {
  presets: [
    ['@babel/preset-env', {targets: "defaults"}],
    '@babel/preset-typescript', // for jest to support TS
    '@babel/preset-react' // for jest to support React
  ],
};
