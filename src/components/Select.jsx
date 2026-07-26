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
        <div className={`w-full relative ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
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
                className={`w-full px-4 py-3 rounded-xl border border-border bg-surface-elevated text-left text-text-primary shadow-sm outline-none transition-all duration-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 hover:border-border-hover hover:shadow-md appearance-none pr-10 relative ${className}`}
            >
                <span className={`block truncate text-base sm:text-sm ${!selected ? 'text-text-muted' : ''}`}>
                    {selected || placeholder || (options && options[0])}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full rounded-xl border border-border/80 bg-surface-elevated dark:bg-[#160B2C] backdrop-blur-xl shadow-2xl overflow-hidden py-1.5 animate-scale-in max-h-60 overflow-y-auto">
                    {options?.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-all duration-200 ${
                                selected === option 
                                    ? 'bg-primary-50 text-primary-700 font-semibold dark:bg-primary-900/30 dark:text-primary-300' 
                                    : 'text-text-secondary hover:bg-primary-50/50 hover:text-text-primary dark:hover:bg-primary-900/20'
                            }`}
                        >
                            <span>{option}</span>
                            {/* Checkmark for selected */}
                            {selected === option && (
                                <svg className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default React.forwardRef(Select)