import { Stack } from 'expo-router';
import SubscriptionScreen from '../src/screens/SubscriptionScreen';
import { useTheme } from '../src/context/ThemeContext';

export default function SubscribePage() {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'الاشتراك المميز',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      />
      <SubscriptionScreen />
    </>
  );
}
