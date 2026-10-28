import { ArrowLeftRight } from 'lucide-react-native';

import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/ui/empty-state';
import { useTheme } from '@/hooks/use-theme';

export default function TransactionsTab() {
  const { colors } = useTheme();

  return (
    <Screen title="Transactions">
      <EmptyState
        icon={<ArrowLeftRight size={20} color={colors.mutedForeground} />}
        title="Transactions"
        description="Transactions list coming in Phase 1"
      />
    </Screen>
  );
}
