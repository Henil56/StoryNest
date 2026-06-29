import React from "react";

export default function Button({
    children,
    type = "button",
    variant = "primary",
    bgColor, // optional override for backward compatibility
    className = "",
    ...props
}) {
    const base = 'px-4 py-2 rounded-xl transition-all transform active:scale-95 focus:outline-none focus:ring-2';

    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'bg-white text-indigo-600 border border-gray-200 hover:bg-gray-50 focus:ring-indigo-200',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: 'bg-transparent text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
        ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-200',
    };

    const variantClasses = bgColor ? `${bgColor} text-white` : (variants[variant] || variants.primary);

    return (
        <button
            type={type}
            className={`${base} ${variantClasses} ${className} transform hover:scale-105`}
            {...props}
        >
            {children}
        </button>
    );
}