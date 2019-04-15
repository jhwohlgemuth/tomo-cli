module.exports = {
    presets: [
        ['@babel/preset-env', {targets: {node: '6.10'}}],
        '@babel/preset-react'
    ],
    plugins: [
        '@babel/transform-runtime',
        '@babel/proposal-class-properties',
        '@babel/proposal-optional-chaining',
        '@babel/proposal-export-default-from'
    ]
};