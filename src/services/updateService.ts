import { Alert, Linking } from 'react-native';
import Constants from 'expo-constants';

const VERSION_CHECK_URL = 'https://sheikh-ibrahim-ashraf.netlify.app/app-version.json';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.meftahaloloom.sheikhibrahimashraf';

interface VersionInfo {
  latestVersion: string;
  minVersion: string;
  message: {
    ar: string;
    en: string;
  };
  forceUpdate: boolean;
  url: string;
}

const compareVersions = (v1: string, v2: string): number => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
};

export const checkForUpdates = async () => {
  try {
    const response = await fetch(VERSION_CHECK_URL);
    const versionInfo: VersionInfo = await response.json();
    const currentVersion = Constants.expoConfig?.version || '1.0.0';

    console.log('Current version:', currentVersion);
    console.log('Latest version:', versionInfo.latestVersion);

    const needsUpdate = compareVersions(versionInfo.latestVersion, currentVersion) > 0;
    const isBelowMin = compareVersions(currentVersion, versionInfo.minVersion) < 0;

    if (needsUpdate || isBelowMin) {
      Alert.alert(
        'تحديث جديد',
        versionInfo.message.ar,
        [
          !versionInfo.forceUpdate && !isBelowMin ? {
            text: 'لاحقاً',
            style: 'cancel',
          } : undefined,
          {
            text: 'تحديث',
            onPress: () => Linking.openURL(versionInfo.url),
          },
        ].filter(Boolean) as any
      );
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};
