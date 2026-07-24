import React, { useId, useState } from 'react'

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
    const isPasswordType = type === "password"
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible)
    }

    const currentType = isPasswordType && isPasswordVisible ? "text" : type

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
                    type={currentType}
                    className={`w-full px-5 py-3.5 rounded-2xl border ${hasError
                        ? 'border-rose-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 bg-rose-50/30 dark:bg-rose-900/10'
                        : 'border-border focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
                        } bg-surface-elevated text-text-primary placeholder:text-text-muted outline-none transition-all duration-300 shadow-sm hover:border-border-hover ${
                            isPasswordType ? 'pr-12' : hasError ? 'pr-10' : ''
                        } ${className}`}
                    ref={ref}
                    {...props}
                    id={id}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${id}-error` : undefined}
                />
                {isPasswordType && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    >
                        {isPasswordVisible ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.71-1.58c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}
                {hasError && !isPasswordType && (
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