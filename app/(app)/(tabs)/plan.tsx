import { PiggyBank } from 'lucide-react-native';

import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/ui/empty-state';
import { useTheme } from '@/hooks/use-theme';

export default function PlanTab() {
  const { colors } = useTheme();

  return (
    <Screen title="Plan">
      <EmptyState
        icon={<PiggyBank size={20} color={colors.mutedForeground} />}
        title="Plan"
        description="Budgets and goals coming in Phase 2"
      />
    </Screen>
  );
}
