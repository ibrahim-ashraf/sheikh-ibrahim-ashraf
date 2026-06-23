import React, { useEffect } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/context/ThemeContext';
import { SubscriptionProvider } from '../src/context/SubscriptionContext';
import { incrementLaunchCount, checkShouldShowRating, showRatingPrompt } from '../src/services/ratingService';
import { checkForUpdates } from '../src/services/updateService';
import { initializeAds } from '../src/services/adsService';
import { initPurchases } from '../src/services/purchaseService';
import { initAuth, ensureSignedIn } from '../src/services/authService';
import { BackHandler, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { registerForPushNotifications } from '../src/services/notificationService';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // معالجة استجابة الإشعارات
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;

      if (data.type === 'video' && data.videoId) {
        router.push({ pathname: '/video/[id]', params: { id: String(data.videoId) } });
      } else if (data.type === 'update') {
        const appStoreUrl = Platform.select({
          ios: 'itms-apps://apps.apple.com/app/idYOUR_APP_ID',
          android: 'market://details?id=com.meftahaloloom.sheikhibrahimashraf',
        });
        if (appStoreUrl) {
          Linking.openURL(appStoreUrl).catch(err => console.error('Error opening app store:', err));
        }
      } else if (data.type === 'general') {
        router.push('/');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // معالجة الإشعارات عند فتح التطبيق من حالة الإغلاق
  useEffect(() => {
    const handleInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();

      if (!response) {
        return;
      }

      const data = response.notification.request.content.data;

      if (data.type === 'video' && data.videoId) {
        router.push({
          pathname: '/video/[id]', params: { id: String(data.videoId) },
        });
      } else if (data.type === 'update') {
        const appStoreUrl = Platform.select({
          ios: 'itms-apps://apps.apple.com/app/idYOUR_APP_ID',
          android: 'market://details?id=com.meftahaloloom.sheikhibrahimashraf',
        });

        if (appStoreUrl) {
          Linking.openURL(appStoreUrl);
        }
      } else if (data.type === 'general') {
        router.push('/');
      }
    };

    handleInitialNotification();
  }, []);

  // معالجة زر الرجوع
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // إغلاق التطبيق فقط إذا كنا في الشاشة الرئيسية أو شاشة تسجيل الدخول
      if (pathname === '/auth' || pathname === '/(tabs)' || pathname === '/') {
        BackHandler.exitApp();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [pathname]);

  // تهيئة التطبيق - تنفذ مرة واحدة فقط
  useEffect(() => {
    const initApp = async () => {
      try {
        await initPurchases();
        await initAuth();
        initializeAds();

        const hasLaunchedBefore = await AsyncStorage.getItem('@first_launch');
        console.log('Has launched before?', hasLaunchedBefore);
        const isUserSignedIn = await ensureSignedIn();

        if (!isUserSignedIn) {
          router.replace('/auth');
          return;
        }

        try {
          await registerForPushNotifications();
        } catch (error) {
          console.error('Notification setup failed:', error);
        }

        if (!hasLaunchedBefore && isUserSignedIn) {
          await AsyncStorage.setItem('@first_launch', 'true');
          router.replace('/(tabs)');
        }

        const launchCount = await incrementLaunchCount();
        if (launchCount > 2) {
          const shouldShowRating = await checkShouldShowRating();
          if (shouldShowRating) {
            showRatingPrompt();
          }
        }
        checkForUpdates();
      } catch (error) {
        console.error('Error in app initialization:', error);
      }
    };

    initApp();
  }, []); // تنفذ مرة واحدة فقط عند تحميل المكون

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SubscriptionProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="video/[id]"
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="playlist/[id]"
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="auth"
              options={{ headerShown: true }}
            />
          </Stack>
        </SubscriptionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
