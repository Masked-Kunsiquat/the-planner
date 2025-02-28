import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX, HiInformationCircle } from "react-icons/hi";
import { createRoot } from "react-dom/client";

/**
 * Standardized logging and notifications utility.
 * Logs to console and shows toasts for UI feedback.
 */

type LogType = "success" | "error" | "warning" | "info" | "debug";

const logToConsole = (type: LogType, message: string) => {
  const prefix = `[${type.toUpperCase()}]`;
  switch (type) {
    case "success":
      console.log(`%c${prefix} ${message}`, "color: green; font-weight: bold;");
      break;
    case "error":
      console.error(`%c${prefix} ${message}`, "color: red; font-weight: bold;");
      break;
    case "warning":
      console.warn(`%c${prefix} ${message}`, "color: orange; font-weight: bold;");
      break;
    case "info":
    case "debug":
      console.info(`%c${prefix} ${message}`, "color: blue; font-weight: bold;");
      break;
    default:
      console.log(prefix, message);
  }
};

// Function to display toast notifications
const showToast = (type: Exclude<LogType, "debug">, message: string) => {
  // Get toast container or create it if it doesn't exist
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "fixed top-5 right-5 z-50 space-y-3";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "toast-message";

  const iconMap: Record<Exclude<LogType, "debug">, JSX.Element> = {
    success: <HiCheck className="h-5 w-5" />,
    error: <HiX className="h-5 w-5" />,
    warning: <HiExclamation className="h-5 w-5" />,
    info: <HiInformationCircle className="h-5 w-5" />,
  };

  createRoot(toast).render(
    <Toast>
      <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg 
        ${type === "success" ? "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200" : ""}
        ${type === "error" ? "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200" : ""}
        ${type === "warning" ? "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200" : ""}
        ${type === "info" ? "bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200" : ""}
      `}>
        {iconMap[type]}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <Toast.Toggle />
    </Toast>
  );

  toastContainer.appendChild(toast);

  // Auto-remove the toast after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
};

const Logger = {
  success: (message: string) => {
    logToConsole("success", message);
    showToast("success", message);
  },
  error: (message: string) => {
    logToConsole("error", message);
    showToast("error", message);
  },
  warning: (message: string) => {
    logToConsole("warning", message);
    showToast("warning", message);
  },
  info: (message: string) => {
    logToConsole("info", message);
    showToast("info", message);
  },
  debug: (message: string) => {
    logToConsole("debug", message); // Debug logs only go to the console, not toasts.
  },
};

export default Logger;
