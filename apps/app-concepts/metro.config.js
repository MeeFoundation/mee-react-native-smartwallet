const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Monorepo resolution
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// SVG transformer
const { transformer, resolver } = config;
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};
config.resolver = {
  ...config.resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

const globalCssPath = path.resolve(projectRoot, 'src/shared/global.css');
module.exports = withNativeWind(config, {
  input: globalCssPath,
  inlineRem: 16,
});
