import React from 'react'
import { Container,PostForm} from '../components'
import PageHeader from '../components/ui/PageHeader'

function AddPost() {
  return (
    <div className='py-12'>
        <Container>
            <PageHeader title="Create New Story" subtitle="Share your ideas and inspire your readers." />
            <PostForm />
        </Container>
    </div>
  )
}

export default AddPost