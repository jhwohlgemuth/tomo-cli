module.exports = {
    presets: [
        ['@babel/preset-env', {targets: {node: '6.10'}, useBuiltIns: 'usage', corejs: 3}],
        '@babel/preset-react',
        'minify'
    ],
    plugins: [
        '@babel/transform-runtime',
        '@babel/proposal-class-properties',
        '@babel/proposal-optional-chaining',
        '@babel/proposal-export-default-from'
    ]
};