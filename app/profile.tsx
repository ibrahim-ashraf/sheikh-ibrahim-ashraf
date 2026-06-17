import { Stack } from 'expo-router';
import ProfileScreen from '../src/screens/ProfileScreen';
import { useTheme } from '../src/context/ThemeContext';

export default function ProfilePage() {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'الملف الشخصي',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      />
      <ProfileScreen />
    </>
  );
}
