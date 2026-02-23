"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "@/lib/utils"; // optional helper for classnames

interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {}

export const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        "bg-white border border-gray-200 p-4 rounded-lg shadow-lg",
        className
      )}
      {...props}
    />
  )
);
Toast.displayName = ToastPrimitive.Root.displayName;

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn("font-bold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description ref={ref} className={cn("text-sm text-gray-600", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

export const ToastClose = ToastPrimitive.Close;

export const Toaster = () => {
  return <ToastPrimitive.Provider swipeDirection="right">{/* Toasts rendered here */}</ToastPrimitive.Provider>;
};

// Hook
export function useToast() {
  const context = React.useContext(ToastPrimitive.ToastContext);
  if (!context) throw new Error("useToast must be inside a ToastProvider");
  return context;
}