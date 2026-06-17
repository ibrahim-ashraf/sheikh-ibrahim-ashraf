import { Stack } from 'expo-router';
import AuthScreen from '../src/screens/AuthScreen';
import { useTheme } from '../src/context/ThemeContext';

export default function AuthPage() {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'تسجيل الدخول',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerBackVisible: false, // إخفاء زر الرجوع
          gestureEnabled: false, // منع الرجوع بالإيماءات
        }}
      />
      <AuthScreen />
    </>
  );
}
