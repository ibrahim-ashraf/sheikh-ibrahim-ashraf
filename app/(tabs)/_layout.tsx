import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useSubscription } from '../../src/context/SubscriptionContext';

export default function TabsLayout() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,
        tabBarStyle: { backgroundColor: theme.colors.background },
        tabBarActiveTintColor: theme.colors.primary,
        headerRight: () => (
          <TouchableOpacity
            onPress={toggleTheme}
            style={{ marginRight: 15 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isDarkMode ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
            accessibilityHint="انقر لتغيير مظهر التطبيق"
          >
            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          headerTitle: 'الرئيسية',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="playlists/index"
        options={{
          title: 'قوائم التشغيل',
          headerTitle: 'قوائم التشغيل',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'list' : 'list-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about/index"
        options={{
          title: 'عن القناة',
          headerTitle: 'عن القناة',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
