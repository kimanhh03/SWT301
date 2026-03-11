import { useApp } from "../context/AppContext";
import { useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

export default function Toast() {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastItem({ toast }) {
  const icons = {
    success: <FaCheckCircle />,
    error: <FaTimesCircle />,
    info: <FaInfoCircle />,
  };
  return (
    <div className={`toast toast-${toast.type || "success"}`}>
      <span className="toast-icon">{icons[toast.type || "success"]}</span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}
