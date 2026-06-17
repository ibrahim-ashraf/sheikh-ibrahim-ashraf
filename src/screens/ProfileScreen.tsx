import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSubscription } from '../context/SubscriptionContext';
import { signOut, getUserFromStorage } from '../services/authService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const { theme } = useTheme();
  const { userInfo, setUserInfo } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    const loadUserInfo = async () => {
      const storedUser = await getUserFromStorage();
      if (storedUser) {
        setUserInfo(storedUser);
      }
    };

    if (!userInfo) {
      loadUserInfo();
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserInfo(null);
      await AsyncStorage.setItem('@previous_path', '/profile');
      router.replace('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!userInfo) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          يرجى تسجيل الدخول للوصول إلى معلومات حسابك
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push('/auth')}
        >
          <Text style={styles.buttonText}>تسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.profileCard, { backgroundColor: theme.colors.card }]}>
        <Image
          source={{ uri: userInfo.photoUrl || 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={[styles.name, { color: theme.colors.text }]}>{userInfo.name}</Text>
        <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{userInfo.email}</Text>
      </View>

      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: theme.colors.card }]}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={24} color={theme.colors.primary} />
        <Text style={[styles.signOutText, { color: theme.colors.primary }]}>
          تسجيل الخروج
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
