import {
  ArrowLeftRight,
  Ellipsis,
  LayoutDashboard,
  LineChart,
  PiggyBank,
  type LucideIcon,
} from 'lucide-react-native';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { useTheme } from '@/hooks/use-theme';

function tabIcon(Icon: LucideIcon, active: string, inactive: string) {
  return function TabIcon({ focused }: { focused: boolean }) {
    return <Icon size={24} color={focused ? active : inactive} strokeWidth={1.75} />;
  };
}

export default function TabLayout() {
  const { colors } = useTheme();
  const icon = (Icon: LucideIcon) => tabIcon(Icon, colors.foreground, colors.mutedForeground);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon(LayoutDashboard) }} />
      <Tabs.Screen
        name="transactions"
        options={{ title: 'Transactions', tabBarIcon: icon(ArrowLeftRight) }}
      />
      <Tabs.Screen name="plan" options={{ title: 'Plan', tabBarIcon: icon(PiggyBank) }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights', tabBarIcon: icon(LineChart) }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: icon(Ellipsis) }} />
    </Tabs>
  );
}
