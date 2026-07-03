import React,{useId} from 'react'

function Select({
    options,
    label,
    className="",
    ...props
},ref) 
{
    const id=useId()
    return (
    <div className='w-full'>
        {label && (
            <label htmlFor={id} className='inline-block mb-1.5 pl-0.5 text-sm font-medium text-text-secondary'>
                {label}
            </label>
        )}
        <select
        {...props}
        id={id}
        ref={ref}
        className={`w-full px-4 py-3 rounded-xl border border-border bg-surface-elevated text-text-primary outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 hover:border-border-hover appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2394A3B8%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[position:right_12px_center] bg-no-repeat pr-10 ${className}`}
        >
            {options?.map((option)=>(
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select)