import Purchases, { CustomerInfo, PurchasesConfiguration, PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEY = 'goog_VyzZgsBQFqfVlNzVRAIMtzCPzzd';

export const subscriptionIds = {
  entitlement: 'premium',
  monthly: 'remove-ads-monthly',
  yearly: 'remove-ads-yearly'
};

let isInitialized = false;

export const initPurchases = async () => {
  try {
    if (isInitialized) return;

    const configuration: PurchasesConfiguration = {
      apiKey: API_KEY,
    };
    await Purchases.configure(configuration);
    isInitialized = true;
    console.log('RevenueCat initialized successfully');
  } catch (error) {
    console.error('Error initializing RevenueCat:', error);
    isInitialized = false;
  }
};

const ensureInitialized = async (retries = 3): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    if (isInitialized) return true;
    await initPurchases();
    if (isInitialized) return true;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
};

export const getSubscriptionPackages = async (): Promise<PurchasesPackage[]> => {
  try {
    const offerings = await Purchases.getOfferings();
    if (!offerings.current) return [];
    return offerings.current.availablePackages;
  } catch (error) {
    console.error('Error getting packages:', error);
    return [];
  }
};

export const purchasePackage = async (pack: PurchasesPackage): Promise<boolean> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pack);
    console.log('Purchase successful:', customerInfo);
    return customerInfo.entitlements.active[subscriptionIds.entitlement]?.isActive || false;
  } catch (error) {
    console.error('Error purchasing package:', error);
    return false;
  }
};

export const checkPremiumStatus = async (): Promise<boolean> => {
  try {
    const initialized = await ensureInitialized();
    if (!initialized) {
      console.error('Failed to initialize RevenueCat');
      return false;
    }

    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[subscriptionIds.entitlement]?.isActive || false;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

export const restorePurchases = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    console.log('Entitlement:', customerInfo.entitlements.active);
    return customerInfo.entitlements.active[subscriptionIds.entitlement]?.isActive || false;
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return false;
  }
};
