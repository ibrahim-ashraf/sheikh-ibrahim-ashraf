import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { doc, setDoc } from '@firebase/firestore';

import { db } from './firebase';
import { getCurrentUser } from './authService';

// إنشاء قنوات الإشعارات
const createNotificationChannels = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(
      'new_videos',
      {
        name: 'الفيديوهات الجديدة',
        description: 'إشعارات عند نشر فيديوهات جديدة',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      }
    );

    await Notifications.setNotificationChannelAsync(
      'updates',
      {
        name: 'تحديثات التطبيق',
        description: 'إشعارات حول تحديثات التطبيق',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: 'default',
      }
    );

    await Notifications.setNotificationChannelAsync(
      'general',
      {
        name: 'إشعارات عامة',
        description: 'إشعارات عامة للتطبيق',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: 'default',
      }
    );
  }
};

// إعداد طريقة عرض الإشعارات عندما يكون التطبيق مفتوحًا
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotifications = async () => {
  try {
    // طلب صلاحية الإشعارات
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // الحصول على Project ID الخاص بـ EAS
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      console.error('Expo projectId is missing');
      return null;
    }

    // إنشاء قنوات الإشعارات
    await createNotificationChannels();

    // إنشاء Expo Push Token
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    console.log('Expo Push Token:', token);

    // حفظه في Firestore
    await savePushToken(token);

    return token;

  } catch (error) {
    console.error(
      'Error registering notifications:',
      error
    );
    return null;
  }
};

const savePushToken = async (token: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log(
        'No user found, token not saved'
      );
      return;
    }

    await setDoc(doc(db, 'users', user.id), {
      id: user.id,
      name: user.name,
      email: user.email,
      expoPushToken: token,
      updatedAt: new Date(),
    },
      {
        merge: true,
      }
    );

    console.log(
      'Push token saved successfully'
    );

  } catch (error) {
    console.error(
      'Error saving push token:',
      error
    );
  }
};