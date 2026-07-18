import React, { useId, useState, useRef, useEffect } from 'react'

function Select({
    options,
    label,
    placeholder,
    className="",
    ...props
}, ref) 
{
    const id = useId()
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const internalRef = useRef(null);
    const dropdownRef = useRef(null);

    const setRefs = (element) => {
        internalRef.current = element;
        if (typeof ref === 'function') ref(element);
        else if (ref) ref.current = element;
    };

    useEffect(() => {
        // Initialize selected value based on the native select or props
        if (internalRef.current && internalRef.current.value) {
            setSelected(internalRef.current.value);
        } else if (!placeholder && options && options.length > 0) {
            setSelected(options[0]);
        }
    }, [options, placeholder]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        setSelected(option);
        setIsOpen(false);
        if (internalRef.current) {
            internalRef.current.value = option;
            internalRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    return (
        <div className='w-full relative' ref={dropdownRef}>
            {label && (
                <label htmlFor={id} className='inline-block mb-1.5 pl-0.5 text-sm font-medium text-text-secondary'>
                    {label}
                </label>
            )}
            
            {/* Hidden native select for form integration */}
            <select
                {...props}
                id={id}
                ref={setRefs}
                className="hidden"
                value={selected}
                onChange={(e) => {
                    setSelected(e.target.value);
                    if (props.onChange) props.onChange(e);
                }}
            >
                {placeholder && <option value="" disabled hidden>{placeholder}</option>}
                {options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>

            {/* Custom UI */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-5 py-3.5 rounded-2xl border border-border bg-surface-elevated text-left text-text-primary shadow-sm outline-none transition-all duration-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 hover:border-border-hover appearance-none pr-12 relative ${className}`}
            >
                <span className={`block truncate ${!selected ? 'text-text-muted' : ''}`}>
                    {selected || placeholder || (options && options[0])}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-text-muted">
                    <svg className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-surface-elevated shadow-2xl overflow-hidden py-2 animate-slide-up max-h-60 overflow-y-auto">
                    {options?.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`w-full text-left px-5 py-3 text-sm transition-colors duration-200 ${
                                selected === option 
                                    ? 'bg-primary-50 text-primary-700 font-semibold dark:bg-primary-900/30 dark:text-primary-300' 
                                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default React.forwardRef(Select)