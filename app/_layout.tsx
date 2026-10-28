import React, { useEffect } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/context/ThemeContext';
import { UserProvider } from '../src/context/UserContext';
import { incrementLaunchCount, checkShouldShowRating, showRatingPrompt } from '../src/services/ratingService';
import { checkForUpdates } from '../src/services/updateService';
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
  }, [router]);

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
  }, [router]);

  // معالجة زر الرجوع
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const state = (router as any).getState?.();
      const routes = state?.routes ?? [];
      const hasNavigationHistory = !!router.canGoBack() || routes.length > 1;

      if (pathname === '/auth' || pathname === '/(tabs)' || pathname === '/') {
        if (hasNavigationHistory) {
          router.back();
          return true;
        }

        BackHandler.exitApp();
        return true;
      }

      if (hasNavigationHistory) {
        router.back();
        return true;
      }

      return false;
    });

    return () => backHandler.remove();
  }, [pathname, router]);

  // تهيئة التطبيق - تنفذ مرة واحدة فقط
  useEffect(() => {
    const initApp = async () => {
      try {
        await initAuth();

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
  }, [router]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
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
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
