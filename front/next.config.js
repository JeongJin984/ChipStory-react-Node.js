const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const webpack = require('webpack')

module.exports = withBundleAnalyzer({
  distDir: '.next',
  webpack(config) {
    const prod = process.env.NODE_ENV === 'production'
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'eval',
    }
  },
})