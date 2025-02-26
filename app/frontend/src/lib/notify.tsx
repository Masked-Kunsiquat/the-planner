import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconAlertTriangle } from "@tabler/icons-react";

/**
 * Displays a toast notification.
 *
 * @param type - "success" | "error" | "warning"
 * @param title - Notification title
 * @param message - Notification message
 */
export function showNotification(
  type: "success" | "error" | "warning",
  title: string,
  message: string
) {
  // ✅ Use functions to return JSX instead of declaring JSX directly
  const getIcon = (type: "success" | "error" | "warning") => {
    switch (type) {
      case "success":
        return <IconCheck size={20} />;
      case "error":
        return <IconX size={20} />;
      case "warning":
        return <IconAlertTriangle size={20} />;
      default:
        return null;
    }
  };

  const colors = {
    success: "teal",
    error: "red",
    warning: "yellow",
  };

  notifications.show({
    title,
    message,
    color: colors[type],
    icon: getIcon(type), // ✅ Now using function instead of inline JSX
    autoClose: 3000,
  });
}
