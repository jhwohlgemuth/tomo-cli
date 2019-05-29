module.exports = {
    presets: [
        ['@babel/preset-env', {targets: {node: '6.10'}, useBuiltIns: 'usage', corejs: 3}],
        '@babel/preset-react',
        'minify'
    ],
    ignore: [
        './src/commands/add-eslint/templates',
        './src/commands/add-marionette/templates'
    ],
    plugins: [
        '@babel/transform-runtime',
        '@babel/proposal-class-properties',
        '@babel/proposal-optional-chaining',
        '@babel/proposal-export-default-from',
        ['@babel/proposal-pipeline-operator', {proposal: 'smart'}]
    ]
};