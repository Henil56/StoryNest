import React,{useCallback} from 'react'
import { useForm } from 'react-hook-form'
import {Button,Input,Select,RTE} from '../index'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({post}) {

    const {register,handleSubmit,watch,setValue,control,getValues}=useForm({
        defaultValues:{
            title: post?.title || '',
            slug:post?.slug||'',
            content:post?.content||'',
            status:post?.status||'active',
        },
    })

    const navigate=useNavigate()
    const userData=useSelector(state=>state.auth.userData)

    const submit = async (data)=>{
        if(post){
            const file = data.image[0]? appwriteService.uploadFile(data.image):null
            if(file){
                appwriteService.deleteFile(post.featuredImage)
            }
            const dbPost=await appwriteService.updatePost(post.$id,{
                ...data,
                featuredImage:file?file.$id:undefined,
                
            })
            if(dbPost){
                navigate(`/post/${dbPost.$id}`)
            }
        }else{
            const file=await appwriteService.uploadFile(data.image[0]);
            if(file){
                const fileId=file.$id
                data.featuredImage=fileId
                const dbPost = await appwriteService.createPost({
                    ...data,
                    userId: userData.$id
                })
                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }
    const slugTransform=useCallback((value)=>{
        if(value && typeof value==='string')
            return value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, '-')
            .replace(/\s/g,'-')
            .substring(0,36)
            return ''
    },[])

    React.useEffect(()=>{
        const subscription=watch((value,{name})=>{
            if(name==='title'){
                setValue('slug',slugTransform(value.title,{shouldValidate:true}))
            }
        })

        return()=>{
            subscription.unsubscribe()
        }

    },[watch,slugTransform,setValue])


    return (
        <div className="rounded-2xl bg-surface-elevated p-6 sm:p-8 shadow-sm border border-border animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-2">{post ? '✏️ Edit Story' : '📝 Create New Story'}</h2>
            <p className="text-text-muted text-sm mb-8">Share your thoughts with the world</p>
            <form onSubmit={handleSubmit(submit)} className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-5">
                    <Input
                        label="Title"
                        placeholder="Give your story a title"
                        {...register("title", { required: true })}
                    />
                    <Input
                        label="Slug"
                        placeholder="url-friendly-slug"
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                    <RTE label="Content" name="content" control={control} defaultValue={getValues("content")} />
                </div>
                <div className="space-y-5">
                    <div>
                        <label className="inline-block mb-1.5 pl-0.5 text-sm font-medium text-text-secondary">Featured Image</label>
                        <div className="mt-1 rounded-xl border-2 border-dashed border-border hover:border-primary-300 transition-colors duration-200 p-6 text-center">
                            <svg className="mx-auto w-10 h-10 text-text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-text-muted mb-2">Click to upload or drag and drop</p>
                            <p className="text-xs text-text-muted">PNG, JPG, GIF</p>
                            <input
                                type="file"
                                className="mt-3 text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/40 dark:file:text-primary-300 dark:hover:file:bg-primary-900/60 file:cursor-pointer cursor-pointer w-full"
                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                {...register("image", { required: !post })}
                            />
                        </div>
                    </div>
                    {post && (
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
                        options={["active", "inactive"]}
                        label="Status"
                        {...register("status", { required: true })}
                    />
                    <Button type="submit" bgColor={post ? "bg-emerald-600" : undefined} className="w-full" size="lg">
                        {post ? "Update Story" : "Publish Story"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
export default PostForm
