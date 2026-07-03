import React from 'react'
import appwriteService from "../appwrite/config"
import Badge from './ui/Badge'
import { Link } from 'react-router-dom'

function stripHtml(input) {
  if (!input) return ''
  return input.replace(/<[^>]*>/g, '')
}

function PostCard({ $id, title, featuredImage, category, content, views, likes }) {
  const excerpt = stripHtml(content).substring(0, 120)

  return (
    <Link to={`/post/${$id}`} className="group block h-full">
      <div className="h-full flex flex-col rounded-2xl border border-border bg-surface-elevated shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className='overflow-hidden shrink-0'>
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className='w-full aspect-[16/10] object-cover transition-transform duration-500 group-hover:scale-105'
          />
        </div>
        <div className='p-5 flex flex-col flex-1'>
          {category && <Badge>{category}</Badge>}
          <h2 className='mt-3 text-lg font-bold text-text-primary line-clamp-2 group-hover:text-primary-600 transition-colors duration-200'>{title}</h2>
          {excerpt && <p className='mt-2 text-sm text-text-muted line-clamp-3 leading-relaxed'>{excerpt}...</p>}
          <div className='mt-auto pt-4 flex items-center justify-between text-sm'>
            <div className='flex items-center gap-3 text-text-muted'>
              <div className="flex items-center gap-1" title="Views">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{views || 0}</span>
              </div>
              <div className="flex items-center gap-1" title="Likes">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{(likes || []).length}</span>
              </div>
            </div>
            <div className='flex items-center font-semibold text-primary-600 group-hover:gap-1 transition-all duration-200'>
              Read more
              <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard