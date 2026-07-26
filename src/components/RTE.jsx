import React, { useEffect, useState, useMemo } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'
import conf from '../conf/conf.js'

export default function RTE({ name, control, label, defaultValue = "", placeholder = "Write your story here..." }) {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className='w-full space-y-2'>
      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange, value } }) => {
          // Calculate live content metrics
          const plainText = (value || '').replace(/<[^>]*>/g, '').trim()
          const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0
          const charCount = plainText.length
          const readingTime = Math.max(1, Math.ceil(wordCount / 200))

          return (
            <div className="w-full max-w-full overflow-hidden">
              {/* Header with Stats */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {label && <label className='text-sm font-semibold text-text-primary'>{label}</label>}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted font-medium bg-surface/60 backdrop-blur-sm px-3 py-1 rounded-full border border-border/40">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {wordCount} {wordCount === 1 ? 'word' : 'words'}
                  </span>
                  <span>·</span>
                  <span>{charCount} chars</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {wordCount > 0 ? `${readingTime} min read` : '0 min'}
                  </span>
                </div>
              </div>

              {/* Editor Frame */}
              <div className="rounded-2xl overflow-hidden border border-border shadow-md focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/15 transition-all duration-300 w-full overflow-hidden">
                <Editor
                  key={isDark ? 'dark-editor' : 'light-editor'}
                  apiKey={conf.tinyMceAPIKEY && conf.tinyMceAPIKEY !== 'undefined' ? conf.tinyMceAPIKEY : 'no-api-key'}
                  tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"
                  initialValue={defaultValue}
                  value={value}
                  init={{
                    height: 520,
                    menubar: false,
                    branding: false,
                    promotion: false,
                    statusbar: false,
                    elementpath: false,
                    toolbar_mode: 'sliding',
                    placeholder: placeholder,
                    font_family_formats: 'Inter=Inter,sans-serif; Roboto=Roboto,sans-serif; Georgia=Georgia,serif; Playfair=Playfair Display,serif; Monospace=monospace; System=system-ui,sans-serif',
                    font_size_formats: '12px 14px 16px 18px 20px 24px 32px 40px',
                    skin: isDark ? 'oxide-dark' : 'oxide',
                    content_css: isDark ? 'dark' : 'default',
                    plugins: [
                      "image",
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "charmap",
                      "preview",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "wordcount",
                      "emoticons",
                      "accordion",
                    ],
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline forecolor | alignleft aligncenter | bullist numlist | link image | strikethrough blockquote backcolor alignjustify outdent indent media table emoticons charmap searchreplace code preview fullscreen",
                    content_style: isDark
                      ? `
                        html, body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.8; color: #F8FAFC; background-color: #110722; box-sizing: border-box; }
                        p { margin: 0 0 1.25em 0; }
                        h1, h2, h3, h4 { color: #FFFFFF; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; }
                        a { color: #f472b6; text-decoration: underline; }
                        blockquote { border-left: 2px solid #db2777; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #cbd5e1; }
                        code { background: #1e1b2e; color: #f472b6; padding: 0.2rem 0.4rem; border-radius: 6px; font-size: 0.9em; }
                        pre { background: #0a0314; color: #f8fafc; padding: 1rem; border-radius: 12px; overflow-x: auto; }
                        img { max-width: 100%; border-radius: 12px; }
                        ::selection { background-color: rgba(219, 39, 119, 0.4); }
                        .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before { position: absolute !important; top: 16px !important; left: 20px !important; color: #64748B !important; opacity: 0.5 !important; font-style: normal !important; pointer-events: none !important; }
                      `
                      : `
                        html, body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.8; color: #0D1B2A; background-color: #EAF4FB; box-sizing: border-box; }
                        p { margin: 0 0 1.25em 0; }
                        h1, h2, h3, h4 { color: #0D1B2A; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; }
                        a { color: #3B72A0; text-decoration: underline; }
                        blockquote { border-left: 2px solid #4682B4; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #2E4A62; }
                        code { background: #E0F0FA; color: #2F5C84; padding: 0.2rem 0.4rem; border-radius: 6px; font-size: 0.9em; }
                        pre { background: #17304D; color: #F0F8FF; padding: 1rem; border-radius: 12px; overflow-x: auto; }
                        img { max-width: 100%; border-radius: 12px; }
                        ::selection { background-color: rgba(70, 130, 180, 0.3); }
                        .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before { position: absolute !important; top: 16px !important; left: 20px !important; color: #5B8AAD !important; opacity: 0.5 !important; font-style: normal !important; pointer-events: none !important; }
                      `
                  }}
                  onEditorChange={onChange}
                />
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}
