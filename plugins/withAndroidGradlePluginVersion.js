const fs = require('node:fs/promises');
const path = require('node:path');
const { withDangerousMod, withProjectBuildGradle } = require('expo/config-plugins');

const ANDROID_GRADLE_PLUGIN_VERSION = '8.13.2';
const MINIMUM_GRADLE_VERSION = [8, 13, 0];

const compareVersions = (left, right) => {
  for (let index = 0; index < right.length; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
};

const withAndroidGradlePluginVersion = (config) => {
  config = withProjectBuildGradle(config, (config) => {
    const dependencyPattern =
      /classpath\s*\(\s*(['"])com\.android\.tools\.build:gradle(?::[^'"]+)?\1\s*\)/;
    if (!dependencyPattern.test(config.modResults.contents)) {
      throw new Error('Could not find the Android Gradle Plugin dependency in android/build.gradle');
    }

    config.modResults.contents = config.modResults.contents.replace(
      dependencyPattern,
      `classpath("com.android.tools.build:gradle:${ANDROID_GRADLE_PLUGIN_VERSION}")`
    );
    return config;
  });

  return withDangerousMod(config, [
    'android',
    async (config) => {
      const wrapperPath = path.join(
        config.modRequest.platformProjectRoot,
        'gradle',
        'wrapper',
        'gradle-wrapper.properties'
      );
      const wrapperContents = await fs.readFile(wrapperPath, 'utf8');
      const distributionPattern =
        /^(distributionUrl=.*\/gradle-)(\d+(?:\.\d+){1,2})(-(?:bin|all)\.zip.*)$/m;
      const match = wrapperContents.match(distributionPattern);
      if (!match) {
        throw new Error('Could not find the Gradle distribution URL in gradle-wrapper.properties');
      }

      const currentVersion = match[2].split('.').map(Number);
      while (currentVersion.length < 3) currentVersion.push(0);
      if (compareVersions(currentVersion, MINIMUM_GRADLE_VERSION) < 0) {
        const updatedContents = wrapperContents.replace(
          distributionPattern,
          `$1${MINIMUM_GRADLE_VERSION.join('.')}$3`
        );
        await fs.writeFile(wrapperPath, updatedContents);
      }

      return config;
    },
  ]);
};

module.exports = withAndroidGradlePluginVersion;
