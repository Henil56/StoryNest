import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { apiSlice } from '../../store/apiSlice'

const CATEGORIES = [
    "Technology",
    "AI",
    "Programming",
    "Business",
    "Startups",
    "Education",
    "Science",
    "Health",
    "Lifestyle",
    "Travel",
    "Food",
    "Entertainment",
    "Books",
    "Sports",
    "Finance",
    "Personal Stories",
    "Opinion",
    "News",
    "Creative Writing",
    "Other",
]

const DRAFT_KEY = 'storynest_post_draft'

function PostForm({ post }) {

    // ── Restore draft from sessionStorage (only for new posts) ──
    const savedDraft = !post ? (() => {
        try {
            const raw = sessionStorage.getItem(DRAFT_KEY)
            return raw ? JSON.parse(raw) : null
        } catch { return null }
    })() : null

    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || savedDraft?.title || '',
            slug: post?.slug || savedDraft?.slug || '',
            content: post?.content || savedDraft?.content || '',
            status: post?.status || savedDraft?.status || 'active',
            category: post?.category || savedDraft?.category || '',
        },
    })

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userData = useSelector(state => state.auth.userData)
    const [loading, setLoading] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)
    const dropZoneRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)

    // ── Persist draft to sessionStorage on every field change (new posts only) ──
    useEffect(() => {
        if (post) return // Don't save drafts for edits
        const subscription = watch((values) => {
            try {
                const draft = {
                    title: values.title || '',
                    slug: values.slug || '',
                    content: values.content || '',
                    status: values.status || 'active',
                    category: values.category || '',
                }
                sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
            } catch { /* storage full – ignore */ }
        })
        return () => subscription.unsubscribe()
    }, [watch, post])

    // ── Clear draft helper ──
    const clearDraft = useCallback(() => {
        try { sessionStorage.removeItem(DRAFT_KEY) } catch {}
    }, [])

    const submit = async (data) => {
        setSubmitError("")
        setLoading(true)
        try {
            if (post) {
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
                if (file) {
                    appwriteService.deleteFile(post.featuredImage)
                }
                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : undefined,
                })
                if (dbPost) {
                    clearDraft()
                    dispatch(apiSlice.util.invalidateTags(['Post', 'AuthorPosts']))
                    navigate(`/post/${dbPost.$id}`)
                }
            } else {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    const fileId = file.$id
                    data.featuredImage = fileId
                    const dbPost = await appwriteService.createPost({
                        ...data,
                        userId: userData.$id,
                        authorName: userData.name || userData.email || 'Anonymous',
                    })
                    if (dbPost) {
                        clearDraft()
                        dispatch(apiSlice.util.invalidateTags(['Post', 'AuthorPosts']))
                        navigate(`/post/${dbPost.$id}`)
                    }
                }
            }
        } catch (error) {
            setSubmitError(error.message || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string')
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, '-')
                .replace(/\s/g, '-')
                .substring(0, 36)
        return ''
    }, [])

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title') {
                setValue('slug', slugTransform(value.title, { shouldValidate: true }))
            }
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [watch, slugTransform, setValue])

    // ── Image preview handler ──
    const handleImageChange = useCallback((file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result)
            reader.readAsDataURL(file)
        }
    }, [])

    // Watch for file input changes
    const imageField = watch('image')
    useEffect(() => {
        if (imageField && imageField.length > 0) {
            handleImageChange(imageField[0])
        }
    }, [imageField, handleImageChange])

    // ── Drag & Drop handlers ──
    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (files && files.length > 0 && files[0].type.startsWith('image/')) {
            // Programmatically set the file input
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(files[0])
            if (fileInputRef.current) {
                fileInputRef.current.files = dataTransfer.files
                // Trigger react-hook-form change
                const event = new Event('change', { bubbles: true })
                fileInputRef.current.dispatchEvent(event)
            }
            handleImageChange(files[0])
        }
    }, [handleImageChange])

    const removePreview = useCallback((e) => {
        e.stopPropagation()
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        setValue('image', null)
    }, [setValue])

    // ── Draft indicator ──
    const hasDraft = !post && savedDraft && (savedDraft.title || savedDraft.content)

    return (
        <div className="animate-fade-in relative">
            {/* Draft restored banner */}
            {hasDraft && (
                <div className="mb-6 flex items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Draft restored</p>
                            <p className="text-xs text-amber-600 dark:text-amber-400/70">Your unsaved work has been recovered.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            clearDraft()
                            setValue('title', '')
                            setValue('slug', '')
                            setValue('content', '')
                            setValue('category', '')
                            setValue('status', 'active')
                            setImagePreview(null)
                        }}
                        className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all duration-200 shrink-0"
                    >
                        Discard
                    </button>
                </div>
            )}

            {submitError && (
                <div className="mb-6 flex items-center gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-sm text-danger">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit(submit)} className="flex flex-col lg:flex-row gap-8 items-start" noValidate>
                <div className="flex-1 w-full space-y-6 rounded-3xl bg-surface-elevated p-6 sm:p-8 shadow-xl shadow-primary-500/5 border border-border/50">
                    <Input
                        label="Title"
                        placeholder="Give your story a title"
                        required
                        error={errors.title?.message}
                        {...register("title", {
                            required: "Title is required",
                            minLength: { value: 3, message: "Title must be at least 3 characters" }
                        })}
                    />
                    <Input
                        label="Slug"
                        placeholder="url-friendly-slug"
                        required
                        error={errors.slug?.message}
                        {...register("slug", { required: "Slug is required" })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                    <RTE label="Content" name="content" control={control} defaultValue={getValues("content")} />
                </div>
                <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 space-y-6 rounded-3xl bg-surface-elevated p-6 sm:p-8 shadow-xl shadow-primary-500/5 border border-border/50 lg:sticky lg:top-28">
                    <div>
                        <label className="inline-flex items-center gap-1 mb-1.5 pl-0.5 text-sm font-medium text-text-secondary">
                            Featured Image
                            {!post && <span className="text-rose-500 text-xs leading-none">*</span>}
                        </label>

                        {/* Image Preview or Upload Zone */}
                        {imagePreview ? (
                            /* ── Preview State ── */
                            <div className="mt-2 relative group rounded-2xl overflow-hidden border-2 border-primary-300 dark:border-primary-700 shadow-md">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full aspect-[16/10] object-cover"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 rounded-xl bg-white/90 text-gray-800 text-sm font-medium backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-lg hover:scale-105"
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Change
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={removePreview}
                                        className="px-4 py-2 rounded-xl bg-rose-500/90 text-white text-sm font-medium backdrop-blur-sm hover:bg-rose-600 transition-all duration-200 shadow-lg hover:scale-105"
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Remove
                                        </span>
                                    </button>
                                </div>
                                {/* Filename badge */}
                                <div className="absolute bottom-2 left-2 right-2">
                                    <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-medium truncate">
                                        ✓ Image selected
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* ── Upload Zone ── */
                            <div
                                ref={dropZoneRef}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`mt-2 rounded-2xl border-2 border-dashed transition-all duration-300 p-8 text-center group cursor-pointer ${
                                    isDragging
                                        ? 'border-primary-500 bg-primary-100/50 dark:bg-primary-900/30 scale-[1.02] shadow-lg shadow-primary-500/10'
                                        : errors.image
                                            ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-900/20'
                                            : 'border-primary-200 bg-primary-50/30 hover:bg-primary-50/80 hover:border-primary-400 hover:shadow-md dark:border-primary-900/50 dark:bg-primary-900/10 dark:hover:bg-primary-900/30'
                                }`}
                            >
                                <svg className={`mx-auto w-12 h-12 mb-4 transition-all duration-300 ${isDragging ? 'text-primary-500 scale-125' : 'text-primary-400 group-hover:scale-110 group-hover:text-primary-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-text-muted mb-1">
                                    {isDragging ? (
                                        <span className="text-primary-600 dark:text-primary-400 font-medium">Drop your image here</span>
                                    ) : (
                                        <>Click to upload or <span className="text-primary-600 dark:text-primary-400 font-medium">drag and drop</span></>
                                    )}
                                </p>
                                <p className="text-xs text-text-muted">PNG, JPG, GIF</p>
                            </div>
                        )}

                        {/* Hidden file input – always rendered */}
                        {(() => {
                            const { ref: rhfRef, ...imageRegister } = register("image", { required: !post ? "A featured image is required" : false })
                            return (
                                <input
                                    type="file"
                                    ref={(e) => {
                                        fileInputRef.current = e
                                        rhfRef(e)
                                    }}
                                    className="hidden"
                                    accept="image/png, image/jpg, image/jpeg, image/gif"
                                    {...imageRegister}
                                />
                            )
                        })()}

                        {errors.image && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.image.message}
                            </p>
                        )}
                    </div>
                    {post && !imagePreview && (
                        <div className="w-full">
                            <p className="text-sm font-medium text-text-secondary mb-2">Current Image</p>
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-xl border border-border"
                            />
                        </div>
                    )}
                    <Select
                        options={CATEGORIES}
                        label="Category"
                        placeholder="Select Category"
                        className=""
                        {...register("category", { required: true })}
                    />
                    <Select
                        options={["active", "inactive"]}
                        label="Status"
                        {...register("status", { required: true })}
                    />
                    <Button
                        type="submit"
                        bgColor={post ? "bg-emerald-600" : undefined}
                        className="w-full"
                        size="lg"
                        loading={loading}
                        loadingText={post ? "Updating story..." : "Publishing story..."}
                    >
                        {post ? "Update Story" : "Publish Story"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
export default PostForm
