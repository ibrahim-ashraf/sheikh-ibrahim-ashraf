import mobileAds, { MaxAdContentRating, TestIds, InterstitialAd, AdEventType, } from 'react-native-google-mobile-ads';
import { checkPremiumStatus } from './purchaseService';

const isProduction = true;

// استبدل بمعرفات الإعلانات الحقيقية في الإصدار النهائي
export const adUnitIds = {
  banner: isProduction ? 'ca-app-pub-4846811371537023/2763074336' : TestIds.BANNER,
  interstitial: isProduction ? 'ca-app-pub-4846811371537023/2550253085' : TestIds.INTERSTITIAL,
};

// تحديث وظيفة التحقق من حالة الإعلانات
export const checkAdsStatus = async () => {
  try {
    const initialize = await mobileAds().initialize();
    console.log('Ads initialization status:', initialize);
    return initialize;
  } catch (error) {
    console.error('Error checking ads status:', error);
    return null;
  }
};

export const shouldShowAds = async (): Promise<boolean> => {
  const isPremium = await checkPremiumStatus();
  return !isPremium;
};

// تهيئة الإعلانات
export const initializeAds = async () => {
  try {
    const showAds = await shouldShowAds();
    if (!showAds) {
      console.log('Premium user - ads disabled');
      return;
    }

    console.log('Starting ads initialization...');
    console.log('Using banner ad ID:', adUnitIds.banner);
    console.log('Is production mode:', isProduction);

    await mobileAds()
      .setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.G,
        tagForChildDirectedTreatment: true,
        tagForUnderAgeOfConsent: true,
        testDeviceIdentifiers: ['EMULATOR'],
      });

    console.log('Configuration set successfully');

    // اضافة تأخير صغير قبل التهيئة
    await new Promise(resolve => setTimeout(resolve, 1000));

    const initialize = await mobileAds().initialize();
    console.log('Mobile Ads initialization completed:', initialize);

    const status = await checkAdsStatus();
    console.log('Initial ads status checked');

    // تأخير تحميل أول إعلان بيني
    setTimeout(() => {
      InterstitialAdManager.loadAd();
      console.log('First interstitial ad load attempted');
    }, 2000);

  } catch (error) {
    console.error('Error in ads initialization:', error);
  }
};

// إدارة الإعلان البيني
class InterstitialAdManager {
  private static interstitialAd: InterstitialAd | null = null;
  private static isLoading = false;
  private static lastAdTime = 0;
  private static readonly MIN_INTERVAL = 60000; // دقيقة واحدة بين الإعلانات

  static loadAd() {
    if (this.isLoading || this.interstitialAd) return;

    try {
      this.isLoading = true;
      this.interstitialAd = InterstitialAd.createForAdRequest(adUnitIds.interstitial, {
        requestNonPersonalizedAdsOnly: true,
        keywords: ['islamic', 'education', 'lectures']
      });

      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log('Interstitial ad loaded successfully');
        this.isLoading = false;
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('Interstitial ad error:', error);
        this.isLoading = false;
        this.interstitialAd = null;

        // إعادة المحاولة بعد فترة في حالة الفشل
        setTimeout(() => this.loadAd(), 5000);
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Interstitial ad closed');
        this.interstitialAd = null;
        this.loadAd(); // تحميل إعلان جديد بعد الإغلاق
      });

      this.interstitialAd.load();
    } catch (error) {
      console.error('Error while creating interstitial ad:', error);
      this.isLoading = false;
      this.interstitialAd = null;
    }
  }

  static async showAd() {
    try {
      const now = Date.now();
      if (now - this.lastAdTime < this.MIN_INTERVAL) {
        console.log('Skipping ad due to minimum interval');
        return false;
      }

      if (!this.interstitialAd) {
        this.loadAd();
        return false;
      }

      const isLoaded = await this.interstitialAd.loaded;
      if (isLoaded) {
        await this.interstitialAd.show();
        this.lastAdTime = now;
        this.interstitialAd = null;
        this.loadAd(); // تحميل الإعلان التالي
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      this.interstitialAd = null;
      return false;
    }
  }

  static preloadAd() {
    if (!this.interstitialAd && !this.isLoading) {
      this.loadAd();
    }
  }
}

export { InterstitialAdManager };
