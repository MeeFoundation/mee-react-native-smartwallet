module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "@assets": "./src/assets",
          "@components": "./src/components",
          "@navigation": "./src/navigation",
          "@screens": "./src/screens",
          "@services": "./src/services",
          "@utils": "./src/utils",
          "@store": "./src/store",
        },
      },
    ],
    "react-native-reanimated/plugin",
  ],
}
