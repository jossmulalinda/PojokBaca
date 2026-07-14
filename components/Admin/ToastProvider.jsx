'use client';

import React, { createContext, useContext, useState, useRef } from "react";
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiArrowGoBackLine,
  RiCloseLine,
} from "react-icons/ri";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  /**
   * Show standard notification toast (success, error, info)
   */
  const showToast = (message, type = "success", duration = 4000) => {
    const id = ++toastIdRef.current;
    const newToast = { id, message, type, isUndo: false };
    
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  /**
   * Show 10-second Undo toast for deletion actions
   * @param {Object} options
   * @param {string} options.message - e.g. "Berita berhasil dihapus"
   * @param {Function} options.onUndo - Callback executed if user clicks Undo
   * @param {Function} options.onConfirm - Callback executed when 10 seconds elapse
   * @param {number} [options.duration=10000] - 10000ms (10 seconds)
   */
  const showUndoToast = ({ message, onUndo, onConfirm, duration = 10000 }) => {
    const id = ++toastIdRef.current;
    let timerId = null;

    const toastObj = {
      id,
      message,
      type: "undo",
      isUndo: true,
      timeLeft: duration / 1000,
      onUndoHandler: () => {
        if (timerId) clearTimeout(timerId);
        removeToast(id);
        if (onUndo) onUndo();
        showToast("Penghapusan dibatalkan", "info", 3000);
      },
    };

    setToasts((prev) => [...prev, toastObj]);

    // Schedule actual backend confirmation after duration
    timerId = setTimeout(() => {
      removeToast(id);
      if (onConfirm) onConfirm();
      showToast("Berhasil dihapus permanen", "success", 3000);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showUndoToast }}>
      {children}

      {/* Floating Toasts Stack at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-2 animate-toast-in transition-all overflow-hidden relative"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {toast.type === "success" && (
                  <RiCheckboxCircleLine size={24} className="text-emerald-500 flex-shrink-0" />
                )}
                {toast.type === "error" && (
                  <RiErrorWarningLine size={24} className="text-red-500 flex-shrink-0" />
                )}
                {toast.type === "info" && (
                  <RiInformationLine size={24} className="text-blue-500 flex-shrink-0" />
                )}
                {toast.type === "undo" && (
                  <RiArrowGoBackLine size={24} className="text-amber-500 flex-shrink-0 animate-pulse" />
                )}

                <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                  {toast.message}
                </p>
              </div>

              {/* Action area */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {toast.isUndo ? (
                  <button
                    onClick={toast.onUndoHandler}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <RiArrowGoBackLine size={14} />
                    Batal (Undo)
                  </button>
                ) : (
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
                  >
                    <RiCloseLine size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Progress countdown bar for Undo toasts */}
            {toast.isUndo && (
              <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-amber-500 transition-all ease-linear"
                  style={{
                    animation: `toastProgress 10s linear forwards`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes toastProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
