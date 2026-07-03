import React from 'react'
import appwriteService from "../appwrite/config"
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './Button'
import { Link } from 'react-router-dom'

function stripHtml(input) {
  if (!input) return ''
  return input.replace(/<[^>]*>/g, '')
}

function PostCard({ $id, title, featuredImage, category, content }) {
  const excerpt = stripHtml(content).substring(0, 120)

  return (
    <Card className="group overflow-hidden">
      <div className='overflow-hidden'>
        <img
          src={appwriteService.getFilePreview(featuredImage)}
          alt={title}
          className='w-full aspect-16/10 object-cover group-hover:scale-110 transition-all duration-300'
        />
      </div>
      <div className='p-5'>
        {category && <Badge>{category}</Badge>}
        <h2 className='mt-3 text-xl font-bold text-gray-900'>{title}</h2>
        {excerpt && <p className='mt-2 text-gray-600'>{excerpt}...</p>}
        <div className='mt-4'>
          <Link to={`/post/${$id}`}>
            <Button className='px-4 py-2'>Read More →</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default PostCard