import { LayoutDashboard } from 'lucide-react-native';

import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/ui/empty-state';
import { useTheme } from '@/hooks/use-theme';

export default function HomeTab() {
  const { colors } = useTheme();

  return (
    <Screen title="Home">
      <EmptyState
        icon={<LayoutDashboard size={20} color={colors.mutedForeground} />}
        title="Home"
        description="Dashboard coming in Phase 1"
      />
    </Screen>
  );
}
