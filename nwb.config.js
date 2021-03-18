module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'coloqioWebchat',
      entry: './src/umd.js',
      externals: {
        react: 'React'
      }
    }
  }
}
