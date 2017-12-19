module.exports = {
    webpackConfig: require('./build/webpack.dev.conf.js'),
    components: 'src/components/**/*.vue',
    ignore: ['**/test/**', '**/*.test.js', '**/*.test.jsx', '**/*.spec.js', '**/*.spec.jsx']
};
