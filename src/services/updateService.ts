import { Alert, Linking } from 'react-native';
import Constants from 'expo-constants';

const VERSION_CHECK_URL = 'https://ibrahim-ashraf.github.io/sheikh-ibrahim-ashraf/app-version.json';
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

const parseVersion = (version: string): number[] | null => {
  if (!/^\d+\.\d+\.\d+$/.test(version)) return null;
  const parts = version.split('.').map(Number);
  return parts.every(Number.isSafeInteger) ? parts : null;
};

const compareVersions = (v1: string, v2: string): number => {
  const parts1 = parseVersion(v1);
  const parts2 = parseVersion(v2);
  if (!parts1 || !parts2) {
    throw new Error('Invalid application version');
  }

  for (let i = 0; i < parts1.length; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
};

const isVersionInfo = (value: unknown): value is VersionInfo => {
  if (typeof value !== 'object' || value === null) return false;
  const info = value as Partial<VersionInfo>;
  return (
    typeof info.latestVersion === 'string' &&
    parseVersion(info.latestVersion) !== null &&
    typeof info.minVersion === 'string' &&
    parseVersion(info.minVersion) !== null &&
    typeof info.message?.ar === 'string' &&
    typeof info.message?.en === 'string' &&
    typeof info.forceUpdate === 'boolean' &&
    typeof info.url === 'string' &&
    /^https?:\/\//.test(info.url)
  );
};

export const checkForUpdates = async () => {
  try {
    const response = await fetch(VERSION_CHECK_URL);
    if (!response.ok) {
      throw new Error(`Version check failed with HTTP ${response.status}`);
    }

    const data: unknown = await response.json();
    if (!isVersionInfo(data)) {
      throw new Error('Version check returned invalid data');
    }
    const versionInfo = data;
    const currentVersion = Constants.expoConfig?.version || '1.0.0';

    const needsUpdate = compareVersions(versionInfo.latestVersion, currentVersion) > 0;
    const isBelowMin = compareVersions(currentVersion, versionInfo.minVersion) < 0;

    if (needsUpdate || isBelowMin) {
      const buttons = [];
      if (!versionInfo.forceUpdate && !isBelowMin) {
        buttons.push({
          text: 'لاحقاً',
          style: 'cancel' as const,
        });
      }
      buttons.push({
        text: 'تحديث',
        onPress: () => {
          Linking.openURL(versionInfo.url).catch(error => {
            console.error('Error opening update URL:', error);
          });
        },
      });

      Alert.alert(
        'تحديث جديد',
        versionInfo.message.ar,
        buttons
      );
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};
