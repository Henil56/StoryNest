import React from 'react'
import { Container } from '../components'
import { Link } from 'react-router-dom'

function Resources() {
  return (
    <div className="py-12 bg-surface text-text-primary min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">Writing Resources</h1>
            <p className="text-lg text-text-secondary">Tools, guides, and inspiration for your storytelling journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-elevated rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-3">Writer's Guide</h2>
              <p className="text-text-secondary mb-6">Learn the basics of structuring a compelling narrative, character development, and world-building.</p>
              <Link to="/all-post" className="text-primary-600 hover:text-primary-700 font-medium">
                Read the guide &rarr;
              </Link>
            </div>

            <div className="bg-surface-elevated rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-3">Community Forums</h2>
              <p className="text-text-secondary mb-6">Connect with other writers, get feedback on your drafts, and participate in weekly writing prompts.</p>
              <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
                Join the discussion &rarr;
              </Link>
            </div>

            <div className="bg-surface-elevated rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-3">Publishing Tips</h2>
              <p className="text-text-secondary mb-6">Ready to share your work with the world? Learn how to format your posts to reach a wider audience.</p>
              <Link to="/add-post" className="text-primary-600 hover:text-primary-700 font-medium">
                Start writing &rarr;
              </Link>
            </div>

            <div className="bg-surface-elevated rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-3">Style Guidelines</h2>
              <p className="text-text-secondary mb-6">A comprehensive overview of formatting options, typography, and best practices for StoryNest.</p>
              <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
                View guidelines &rarr;
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Resources
