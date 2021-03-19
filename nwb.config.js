module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'coloqioWebchat',
      externals: {
        react: 'React'
      }
    }
  }
}
