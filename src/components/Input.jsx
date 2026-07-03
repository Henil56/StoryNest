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
            {label && (<label
            className='inline-block mb-1 pl-1'
            htmlFor={id}
            >{label}</label>)}
            <input
            type={type}
            className={`px-3 py-3 rounded-xl border border-gray-300 bg-white text-black outline-none focus:bg-gray-50 focus:ring-2 focus:ring-indigo-500 duration-200 w-full ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
}


export default Input