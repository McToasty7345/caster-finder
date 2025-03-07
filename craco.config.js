module.exports = {
    webpack: {
      configure: {
        resolve: {
          fallback: {
            path: require.resolve("path-browserify"),
            crypto: require.resolve("crypto-browserify"),
            buffer: require.resolve("buffer/"),
            stream: require.resolve("stream-browserify"),
            fs: false,
            os: false,
            util: false,
          },
        },
      },
    },
  };