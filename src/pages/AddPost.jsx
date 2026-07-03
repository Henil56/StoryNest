import React from 'react'
import { Container,PostForm} from '../components'

function AddPost() {
  return (
    <div className='grid lg:grid-cols-2 gap-8'>
        <Container>
            <PostForm />
        </Container>
    </div>
  )
}

export default AddPost