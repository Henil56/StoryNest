import React, { useId } from 'react'

function Input({
    label,
    type = "text",
    className = "",
    error = "",
    required = false,
    ref,
    ...props
}) {
    const id = useId()
    const hasError = !!error

    return (
        <div className='w-full'>
            {label && (
                <label
                    className='inline-flex items-center gap-1 mb-1.5 pl-0.5 text-sm font-medium text-text-secondary'
                    htmlFor={id}
                >
                    {label}
                    {required && (
                        <span className="text-rose-500 text-xs leading-none">*</span>
                    )}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    className={`w-full px-5 py-3.5 rounded-2xl border ${hasError
                        ? 'border-rose-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 bg-rose-50/30 dark:bg-rose-900/10'
                        : 'border-border focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
                        } bg-surface-elevated text-text-primary placeholder:text-text-muted outline-none transition-all duration-300 shadow-sm hover:border-border-hover ${className}`}
                    ref={ref}
                    {...props}
                    id={id}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${id}-error` : undefined}
                />
                {hasError && (
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
            {hasError && (
                <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-xs text-rose-500 animate-fade-in">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    )
}

export default Input