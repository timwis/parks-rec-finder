module.exports = {
    webpackConfig: require('./build/webpack.dev.conf.js'),
    components: 'src/components/**/*.vue',
    ignore: ['**/test/**', '**/*.test.js', '**/*.test.jsx', '**/*.spec.js', '**/*.spec.jsx'],
    sections: [
        {
          name: 'UI Components',
          components: 'src/components/**/*.vue'
        },
        {
          name: 'State Containers',
          components: 'src/containers/**/*.vue'
        }
    ]
};
