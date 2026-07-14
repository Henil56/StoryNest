import React from "react";

function Spinner({ size = "sm" }) {
    const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-5 h-5" };
    return (
        <svg
            className={`${sizes[size] || sizes.sm} animate-spin`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}

export default function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    bgColor,
    className = "",
    disabled = false,
    loading = false,
    loadingText,
    ...props
}) {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md',
        secondary: 'bg-white dark:bg-surface-elevated text-primary-600 border border-border hover:border-border-hover hover:bg-primary-50 dark:hover:bg-primary-900/30 focus:ring-primary-200',
        danger: 'bg-danger text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm hover:shadow-md',
        success: 'bg-success text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm hover:shadow-md',
        outline: 'bg-transparent text-primary-600 border border-primary-600 hover:bg-primary-50 focus:ring-primary-500',
        ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-200',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const variantClasses = bgColor
        ? `${bgColor} text-white hover:opacity-90 shadow-sm hover:shadow-md`
        : (variants[variant] || variants.primary);
    const sizeClasses = sizes[size] || sizes.md;
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            disabled={isDisabled}
            className={`${base} ${variantClasses} ${sizeClasses} ${className}`}
            aria-busy={loading}
            {...props}
        >
            {loading && <Spinner size={size} />}
            {loading ? (loadingText || children) : children}
        </button>
    );
}