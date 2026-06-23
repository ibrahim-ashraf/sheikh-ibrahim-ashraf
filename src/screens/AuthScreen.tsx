import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSubscription } from '../context/SubscriptionContext';
import { signIn } from '../services/authService';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotifications } from '../services/notificationService';

const AuthScreen = () => {
  const { theme } = useTheme();
  const { setUserInfo } = useSubscription();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const userInfo = await signIn();
      if (userInfo) {
        setUserInfo(userInfo);

        try {
          await registerForPushNotifications();
        } catch (error) {
          console.error('Notification registration failed:', error);
        }

        router.replace('/(tabs)'); // توجيه المستخدم مباشرة للصفحة الرئيسية
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Ionicons name="person-circle-outline" size={100} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          تسجيل الدخول
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          قم بتسجيل الدخول للوصول لحسابك الشخصي والاستفادة من ميزات التطبيق المختلفة
        </Text>

        <TouchableOpacity
          style={[styles.googleButton, { backgroundColor: theme.colors.card }]}
          onPress={handleGoogleSignIn}
        >
          <Image
            source={require('../../assets/images/google-logo.png')}
            style={styles.googleIcon}
          />
          <Text style={[styles.googleButtonText, { color: theme.colors.text }]}>
            تسجيل الدخول باستخدام Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 16,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthScreen;
