import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Alert, Platform } from 'react-native';

const LAUNCH_COUNT_KEY = '@app_launch_count';
const RATING_DONE_KEY = '@rating_done';
const PLAY_STORE_URL = 'market://details?id=com.meftahaloloom.sheikhibrahimashraf';
const PLAY_STORE_WEB_URL = 'https://play.google.com/store/apps/details?id=com.meftahaloloom.sheikhibrahimashraf';

export const incrementLaunchCount = async () => {
  try {
    const currentCount = await AsyncStorage.getItem(LAUNCH_COUNT_KEY);
    const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
    await AsyncStorage.setItem(LAUNCH_COUNT_KEY, newCount.toString());
    return newCount;
  } catch (error) {
    console.error('Error incrementing launch count:', error);
    return 0;
  }
};

export const checkShouldShowRating = async (): Promise<boolean> => {
  try {
    const isDone = await AsyncStorage.getItem(RATING_DONE_KEY);
    if (isDone === 'true') return false;

    const count = await AsyncStorage.getItem(LAUNCH_COUNT_KEY);
    return count ? parseInt(count) % 3 === 0 : false;
  } catch (error) {
    console.error('Error checking rating status:', error);
    return false;
  }
};

export const markRatingDone = async () => {
  try {
    await AsyncStorage.setItem(RATING_DONE_KEY, 'true');
  } catch (error) {
    console.error('Error marking rating as done:', error);
  }
};

export const openRatingPage = async () => {
  try {
    const supported = await Linking.canOpenURL(PLAY_STORE_URL);
    await Linking.openURL(supported ? PLAY_STORE_URL : PLAY_STORE_WEB_URL);
    await markRatingDone();
  } catch (error) {
    console.error('Error opening rating page:', error);
  }
};

export const showRatingPrompt = () => {
  Alert.alert(
    'قيّم التطبيق',
    'هل تستمتع باستخدام تطبيق الشيخ إبراهيم أشرف؟ نرجو تقييم التطبيق!',
    [
      {
        text: 'لاحقاً',
        style: 'cancel',
      },
      {
        text: 'قيّم الآن',
        onPress: openRatingPage,
      },
    ],
  );
};
