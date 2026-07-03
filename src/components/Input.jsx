import React,{useId} from 'react'


function Input({
    label,
    type="text",
    className="",
    ref,
    ...props
}){
    const id=useId()
    return(
        <div className='w-full'>
            {label && (
                <label
                    className='inline-block mb-1.5 pl-0.5 text-sm font-medium text-text-secondary'
                    htmlFor={id}
                >{label}</label>
            )}
            <input
                type={type}
                className={`w-full px-4 py-3 rounded-xl border border-border bg-surface-elevated text-text-primary placeholder:text-text-muted outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 hover:border-border-hover ${className}`}
                ref={ref}
                {...props}
                id={id}
            />
        </div>
    )
}


export default Input