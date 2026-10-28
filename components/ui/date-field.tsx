import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, Text, View } from 'react-native';

import { formatDate } from '@/lib/format-date';

type DateFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
};

export function DateField({ label, value, onChange, maximumDate }: DateFieldProps) {
  if (Platform.OS === 'ios') {
    return (
      <View className="h-11 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-foreground">{label}</Text>
        <DateTimePicker
          accessibilityLabel={label}
          value={value}
          mode="date"
          display="compact"
          maximumDate={maximumDate}
          onChange={(_, date) => date && onChange(date)}
        />
      </View>
    );
  }

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: formatDate(value) }}
        onPress={() =>
          DateTimePickerAndroid.open({
            value,
            mode: 'date',
            maximumDate,
            onChange: (_, date) => date && onChange(date),
          })
        }
        className="h-11 justify-center rounded-lg border border-input bg-background px-3">
        <Text className="text-base text-foreground">{formatDate(value)}</Text>
      </Pressable>
    </View>
  );
}
