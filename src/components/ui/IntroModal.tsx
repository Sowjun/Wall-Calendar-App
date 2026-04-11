"use client";

import React, { useEffect } from "react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

type IntroModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function IntroModal({ isOpen, onClose }: IntroModalProps) {
  const modalRef = React.useRef<HTMLDivElement | null>(null);
  const todayLabel = format(new Date(), "MMMM d");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) {
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;

        if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Welcome onboarding"
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-5 sm:p-6 max-h-[85vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">Welcome 👋</h2>
            <p className="mt-1 text-base sm:text-lg text-gray-700 dark:text-slate-200">Ready to plan your days?</p>
            <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
              Today is {todayLabel} - a good day to get organized.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-3 sm:p-4 border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">Try this:</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                  - Select a few dates on the calendar
                  <br />
                  - Add a note for your plan
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-3 sm:p-4 border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">📅 Plan multiple days effortlessly</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                  Build clear plans across date ranges in just a few clicks.
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-slate-800/70 p-3 sm:p-4 border border-gray-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">✍️ Capture notes instantly</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                  Keep ideas, reminders, and tasks close to your selected dates.
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 px-1">⚡ Smooth, distraction-free experience.</p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-all duration-200"
                autoFocus
              >
                Start Planning
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
