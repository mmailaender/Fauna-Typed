module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.PWD': JSON.stringify(process.env.PWD),
      process: 'process/browser',
    }),
  ],
};
