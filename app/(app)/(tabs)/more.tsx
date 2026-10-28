import { Ellipsis } from 'lucide-react-native';

import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/ui/empty-state';
import { useTheme } from '@/hooks/use-theme';

export default function MoreTab() {
  const { colors } = useTheme();

  return (
    <Screen title="More">
      <EmptyState
        icon={<Ellipsis size={20} color={colors.mutedForeground} />}
        title="More"
        description="Accounts, categories and settings"
      />
    </Screen>
  );
}
