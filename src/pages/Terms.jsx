import React from 'react'
import { Container } from '../components'

function Terms() {
  return (
    <div className="py-12 bg-surface text-text-primary min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto bg-surface-elevated rounded-2xl p-8 border border-border shadow-sm">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-6">Terms & Conditions</h1>
          <div className="space-y-6 text-text-secondary leading-relaxed">
            <p>
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-200 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using StoryNest, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
            
            <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-200 mt-8 mb-4">2. Description of Service</h2>
            <p>
              StoryNest provides users with a platform for creating, sharing, and reading written content (the "Service"). You understand and agree that the Service is provided "AS-IS" and that StoryNest assumes no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.
            </p>

            <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-200 mt-8 mb-4">3. User Conduct</h2>
            <p>
              You understand that all information, data, text, software, music, sound, photographs, graphics, video, messages or other materials ("Content"), whether publicly posted or privately transmitted, are the sole responsibility of the person from which such Content originated. This means that you, and not StoryNest, are entirely responsible for all Content that you upload, post, email or otherwise transmit via the Service.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Terms
