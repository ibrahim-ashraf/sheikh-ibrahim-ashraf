import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { adUnitIds, shouldShowAds } from '../services/adsService';
import { useTheme } from '../context/ThemeContext';
import { useSubscription } from '../context/SubscriptionContext';

interface AdSize {
  width: number;
  height: number;
}

export const AdBanner = () => {
  const { theme } = useTheme();
  const { isPremium } = useSubscription();
  const [showAd, setShowAd] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [adSize, setAdSize] = useState<AdSize>({ width: 0, height: 0 });

  useEffect(() => {
    const checkAdsStatus = async () => {
      const shouldShow = await shouldShowAds();
      setShowAd(shouldShow);
    };
    checkAdsStatus();
  }, [isPremium]);

  if (!showAd) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      accessible={true}
      accessibilityLabel="مساحة إعلانية"
      accessibilityHint="إعلان من جوجل"
      onLayout={event => {
        console.log('AdBanner container layout:', event.nativeEvent.layout);
      }}
    >
      {adError ? (
        <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
          {adError}
        </Text>
      ) : (
        <View style={styles.adWrapper}>
          <BannerAd
            unitId={adUnitIds.banner}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
              keywords: ['islamic', 'education', 'lectures']
            }}
            onAdLoaded={() => {
              console.log('Banner ad loaded successfully');
              setAdLoaded(true);
              setAdError(null);
            }}
            onAdFailedToLoad={(error) => {
              console.error('Banner ad failed to load:', error);
              setAdLoaded(false);
              setAdError('تعذر تحميل الإعلان');
            }}
          />
        </View>
      )}
      {__DEV__ && (
        <Text style={styles.debugText}>
          {adLoaded ? 'Ad Loaded' : 'Ad Not Loaded'}
          {adSize.width > 0 ? ` (${adSize.width}x${adSize.height})` : ''}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
    minHeight: 60,
    borderRadius: 8,
    margin: 8,
    borderWidth: __DEV__ ? 1 : 0,
    borderColor: 'rgba(255,0,0,0.3)'
  },
  adWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 4,
  },
  debugText: {
    fontSize: 10,
    color: 'rgba(255,0,0,0.5)',
    position: 'absolute',
    top: 0,
    right: 2,
  },
});
