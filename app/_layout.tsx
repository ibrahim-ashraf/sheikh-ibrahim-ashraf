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
import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

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

        const isFirstLaunch = await AsyncStorage.getItem('@first_launch');
        console.log('Is first launch?', isFirstLaunch);
        const isUserSignedIn = await ensureSignedIn();

        if (!isUserSignedIn) {
          router.replace('/auth');
          return;
        }

        if (!isFirstLaunch && isUserSignedIn) {
          await AsyncStorage.setItem('@first_launch', 'true');
          router.replace('/(tabs)');
          return;
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
