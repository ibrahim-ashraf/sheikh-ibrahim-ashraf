import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getSubscriptionPackages, purchasePackage, restorePurchases } from '../services/purchaseService';
import { PurchasesPackage } from 'react-native-purchases';
import { useSubscription } from '../context/SubscriptionContext';
import { useRouter } from 'expo-router';
import { getUserFromStorage } from '../services/authService';

const subscriptionIds = {
  yearly: 'remove_ads:remove-ads-yearly',
  monthly: 'remove_ads:remove-ads-monthly',
};

const SubscriptionScreen = () => {
  const { theme } = useTheme();
  const { isPremium, userInfo, setUserInfo, checkSubscription } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [purchasing, setPurchasing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (!userInfo) {
        const storedUser = await getUserFromStorage();
        if (storedUser) {
          setUserInfo(storedUser);
        } else {
          router.push('/auth');
          return;
        }
      }
      loadPackages();
    };

    loadData();
  }, [userInfo]);

  const loadPackages = async () => {
    try {
      const availablePackages = await getSubscriptionPackages();
      setPackages(availablePackages);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pack: PurchasesPackage) => {
    try {
      setPurchasing(true);
      const success = await purchasePackage(pack);
      if (success) {
        await checkSubscription();
        Alert.alert('نجاح', 'تم الاشتراك بنجاح');
      } else {
        Alert.alert('تنبيه', 'تم إلغاء عملية الشراء');
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء عملية الشراء');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setPurchasing(true);
      const restored = await restorePurchases();
      if (restored) {
        await checkSubscription();
        Alert.alert('نجاح', 'تم استعادة الاشتراك بنجاح');
      } else {
        Alert.alert('تنبيه', 'لم يتم العثور على اشتراكات سابقة');
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء استعادة المشتريات');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading || purchasing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {userInfo ? (
        isPremium ? (
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Ionicons name="star" size={64} color={theme.colors.primary} />
            <Text style={[styles.title, { color: theme.colors.text }]}>
              أنت مشترك حالياً
            </Text>
            <Text style={[styles.description, { color: theme.colors.text }]}>
              استمتع بتجربة خالية من الإعلانات
            </Text>

            <TouchableOpacity
              onPress={() => Linking.openURL('https://play.google.com/store/account/subscriptions')}
              style={[styles.manageButton, { backgroundColor: theme.colors.card }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="إدارة الاشتراك"
              accessibilityHint="إدارة اشتراكك على متجر جوجل بلاي"
            >
              <View style={styles.buttonInner}>
                <Ionicons name="settings-outline" size={20} color={theme.colors.text} style={styles.buttonIcon} />
                <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                  إدارة الاشتراك
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Ionicons name="star" size={64} color={theme.colors.primary} />
            <Text style={[styles.title, { color: theme.colors.text }]}>
              اشتراك مميز
            </Text>
            <Text style={[styles.description, { color: theme.colors.text }]}>
              احصل على تجربة خالية من الإعلانات وادعم القناة
            </Text>

            {packages.map((pack, index) => {
              const isYearly = pack.product.identifier === subscriptionIds.yearly;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.subscribeButton,
                    {
                      backgroundColor: theme.colors.primary,
                      opacity: isYearly ? 1 : 0.9,
                      transform: [{ scale: isYearly ? 1.05 : 1 }]
                    }
                  ]}
                  onPress={() => handlePurchase(pack)}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>
                      {isYearly ? 'اشتراك سنوي' : 'اشتراك شهري'}
                    </Text>
                    <Text style={styles.priceText}>
                      {pack.product.priceString}
                      {isYearly ? ' في السنة' : ' في الشهر'}
                    </Text>
                    {isYearly && (
                      <View style={styles.saveContainer}>
                        <Text style={styles.saveText}>وفر 20% عن الاشتراك الشهري</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={handleRestore}
              style={[styles.restoreButton, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.restoreText, { color: theme.colors.text }]}>
                استعادة الاشتراك
              </Text>
            </TouchableOpacity>

            <View style={styles.features}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>
                  تصفح بدون إعلانات
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>
                  دعم القناة والمحتوى
                </Text>
              </View>
            </View>
          </View>
        )
      ) : (
        <View style={styles.signInContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            يرجى تسجيل الدخول للاستمرار
          </Text>
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push('/auth')}
          >
            <Text style={styles.signInButtonText}>تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 32,
  },
  subscribeButton: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
  },
  saveText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
  restoreButton: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  restoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  features: {
    marginTop: 32,
    width: '100%',
    paddingHorizontal: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    marginRight: 12,
    fontSize: 16,
  },
  signInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButton: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  manageButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default SubscriptionScreen;
