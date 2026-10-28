import { LineChart } from 'lucide-react-native';

import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/ui/empty-state';
import { useTheme } from '@/hooks/use-theme';

export default function InsightsTab() {
  const { colors } = useTheme();

  return (
    <Screen title="Insights">
      <EmptyState
        icon={<LineChart size={20} color={colors.mutedForeground} />}
        title="Insights"
        description="Analytics coming in Phase 3"
      />
    </Screen>
  );
}
