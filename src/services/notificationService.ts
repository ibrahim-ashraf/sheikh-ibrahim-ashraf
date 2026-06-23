import * as Notifications from 'expo-notifications';
import { Linking, Platform, Alert } from 'react-native';
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
    // التحقق من صلاحية الإشعارات
    const permissions = await Notifications.getPermissionsAsync();

    if (permissions.status !== 'granted') {
      // عرض تنبيه للمستخدم لتفعيل الإشعارات
      const wantsNotifications = await askNotificationPermission();

      if (!wantsNotifications) {
        return null;
      }

      if (permissions.canAskAgain) {
        const request = await Notifications.requestPermissionsAsync();
        console.log('Notification permission request result:', request);
      } else {
        console.log('Notification permission denied and cannot ask again');

        // عرض تنبيه للمستخدم لتفعيل الإشعارات من إعدادات التطبيق
        const openSettings = await askOpenSettings();

        if (openSettings) {
          openAppSettings();
        } else {
          console.log('User chose not to open settings');
          return null;
        }
      }
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

const openAppSettings = () => {
  if (Platform.OS === 'ios') {
    // يفتح إعدادات التطبيق على نظام iOS
    Linking.openURL('app-settings:');
  } else if (Platform.OS === 'android') {
    // يفتح صفحة الإعدادات (تفاصيل التطبيق) على نظام Android
    Linking.openSettings();
  } else {
    Alert.alert('خطأ', 'لا يمكن فتح الإعدادات على هذا الجهاز');
  }
};

function askNotificationPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      'تفعيل الإشعارات',
      'هل تريد تفعيل الإشعارات لتلقي أحدث الفيديوهات والتحديثات؟',
      [
        {
          text: 'لاحقًا',
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: 'نعم',
          onPress: () => resolve(true),
        },
      ]
    );
  });
}

function askOpenSettings(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      'الإشعارات معطلة',
      'يرجى تفعيل الإشعارات من إعدادات التطبيق.',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: 'فتح الإعدادات',
          onPress: () => resolve(true),
        },
      ]
    );
  });
}