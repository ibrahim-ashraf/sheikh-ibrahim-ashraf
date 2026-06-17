import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const printAllStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    if (keys.length === 0) {
      console.log('📭 لا توجد بيانات مخزنة في AsyncStorage.');
      return;
    }

    const stores = await AsyncStorage.multiGet(keys);
    console.log('📦 محتوى AsyncStorage:');
    stores.forEach(([key, value]) => {
      console.log(`🔑 ${key} => 📄 ${value}`);
    });
  } catch (error) {
    console.error('حدث خطأ أثناء طباعة محتوى AsyncStorage:', error);
  }
};

const AUTH_KEY = '@auth_token';
const USER_KEY = '@user_info';

// تعريف واجهة بيانات المستخدم
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
}

// تهيئة Google Sign In
export const initAuth = async () => {
  try {
    GoogleSignin.configure({
      webClientId: '210796224926-or8rk0ej7joqiant5lllpjc9qqrdmmjl.apps.googleusercontent.com',
      offlineAccess: false,
      forceCodeForRefreshToken: false,
    });
    console.log('Google Sign-In configured successfully');
  } catch (error) {
    console.error('Error configuring Google Sign-In:', error);
  }
};

export const signIn = async (): Promise<UserInfo | null> => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    const accessToken = userInfo.data?.idToken || '';

    if (userInfo.data) {
      const userData: UserInfo = {
        id: userInfo.data.user.id || '',
        email: userInfo.data.user.email || '',
        name: userInfo.data.user.name || '',
        photoUrl: userInfo.data.user.photo || undefined,
      };

      await AsyncStorage.setItem(AUTH_KEY, accessToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      return userData;
    }
    Alert.alert('خطأ', 'لم نتمكن من جلب بيانات المستخدم');
    return null;
  } catch (error: any) {
    console.error('Error signing in:', error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      Alert.alert('تنبيه', 'تم إلغاء تسجيل الدخول من قبل المستخدم');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // محاولة إلغاء تسجيل الدخول الحالي وإعادة المحاولة
      await GoogleSignin.signOut();
      return signIn();
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert('خطأ', 'خدمات Google Play غير متاحة أو قديمة. يرجى تحديثها');
    } else {
      Alert.alert('خطأ', `حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى لاحقًا.\n${error}`);
    }
    throw error;
  }
};

export const signOut = async () => {
  try {
    await GoogleSignin.signOut();
    await AsyncStorage.multiRemove([AUTH_KEY, USER_KEY]);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const isSignedIn = async (): Promise<boolean> => {
  try {
    const userToken = await AsyncStorage.getItem(AUTH_KEY);
    if (!userToken) return false;

    const currentUser = await GoogleSignin.getCurrentUser();
    if (!currentUser) {
      await AsyncStorage.multiRemove([AUTH_KEY, USER_KEY]);
      return false;
    }

    // التحقق من صلاحية الجلسة
    try {
      await GoogleSignin.signInSilently();
      return true;
    } catch (error) {
      console.log('Silent sign in failed:', error);
      await AsyncStorage.multiRemove([AUTH_KEY, USER_KEY]);
      return false;
    }
  } catch (error) {
    console.error('Error checking sign in status:', error);
    await AsyncStorage.multiRemove([AUTH_KEY, USER_KEY]);
    return false;
  }
};

export const ensureSignedIn = async (): Promise<boolean> => {
  try {
    const signedIn = await isSignedIn();
    if (!signedIn) {
      Alert.alert('تنبيه', 'يرجى تسجيل الدخول للاستمرار');
    }
    return signedIn;
  } catch (error) {
    console.error('Error ensuring sign in:', error);
    Alert.alert('خطأ', 'حدث خطأ أثناء التحقق من تسجيل الدخول');
    return false;
  }
};

export const getCurrentUser = async (): Promise<UserInfo | null> => {
  try {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser?.user) {
      return {
        id: currentUser.user.id || '',
        email: currentUser.user.email || '',
        name: currentUser.user.name || '',
        photoUrl: currentUser.user.photo || undefined,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getUserFromStorage = async (): Promise<UserInfo | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error getting user from storage:', error);
    return null;
  }
};
