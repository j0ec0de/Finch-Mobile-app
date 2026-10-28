import { Alert } from "react-native"
import * as Haptics from "expo-haptics"

/** Native destructive confirmation. Resolves true when the user confirms. */
export function confirmDestructive(title: string, message: string, confirmLabel = "Delete") {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {})
  return new Promise<boolean>((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
        { text: confirmLabel, style: "destructive", onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    )
  })
}
