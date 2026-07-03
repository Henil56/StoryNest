import React from 'react'
import {Editor } from '@tinymce/tinymce-react';
import {Controller } from 'react-hook-form';
import conf from '../conf/conf.js';


export default function RTE({name, control, label, defaultValue =""}) {
  return (
    <div className='w-full'> 
      {label && <label className='inline-block mb-1.5 pl-0.5 text-sm font-medium text-text-secondary'>{label}</label>}

      <div className="rounded-xl overflow-hidden border border-border">
        <Controller
          name={name || "content"}
          control={control}
          render={({field: {onChange}}) => (
            <Editor   
              apiKey={conf.tinyMceAPIKEY}
              initialValue={defaultValue}
              init={{
                initialValue: defaultValue,
                height: 500,
                menubar: true,
                plugins: [
                  "image",
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                  "anchor",
                ],
                toolbar:
                  "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                content_style: "body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:15px; line-height:1.7; color:#334155; }"
              }}
              onEditorChange={onChange}
            />
          )}
        />
      </div>
    </div>
  )
}