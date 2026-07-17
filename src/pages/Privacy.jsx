import React from 'react'
import { Container } from '../components'

function Privacy() {
  return (
    <div className="py-12 bg-surface text-text-primary min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto bg-surface-elevated rounded-2xl p-8 border border-border shadow-sm">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-primary-100 mb-6">Privacy Policy</h1>
          <div className="space-y-6 text-text-secondary leading-relaxed">
            <p>
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-200 mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to StoryNest. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>
            
            <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-200 mt-8 mb-4">2. The data we collect about you</h2>
            <p>
              Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
            </ul>

            <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-200 mt-8 mb-4">3. How we use your personal data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Privacy
