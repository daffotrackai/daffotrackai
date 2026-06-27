import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const TOAST_TYPES = {
  error: {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-(--bg-card)',
    border: 'border-red-500/50',
  },
  success: {
    icon: CheckCircle,
    color: 'text-emerald-500',
    bg: 'bg-(--bg-card)',
    border: 'border-emerald-500/50',
  },
  info: {
    icon: Info,
    color: 'text-teal-500',
    bg: 'bg-(--bg-card)',
    border: 'border-teal-500/50',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-(--bg-card)',
    border: 'border-amber-500/50',
  },
};

export default function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-right-10 ${config.bg} ${config.border}`}
          >
            <div className={`shrink-0 mt-0.5 ${config.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-(--text-main) leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-(--text-muted) hover:text-(--text-main) transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
