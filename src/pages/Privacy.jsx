import React from 'react'
import { Container } from '../components'
import { Helmet } from 'react-helmet-async'

function Privacy() {
  return (
    <div className="py-16 bg-surface text-text-primary min-h-screen">
      <Helmet>
        <title>Privacy Policy | StoryNest</title>
      </Helmet>
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-text-secondary text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <div className="bg-surface-elevated rounded-3xl p-8 md:p-12 border border-white/10 dark:border-white/5 shadow-xl space-y-10 text-text-secondary leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                1. Introduction
              </h2>
              <p>
                Welcome to StoryNest. We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                2. Information We Collect
              </h2>
              <p className="mb-4">We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
              <ul className="list-none space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and profile picture, that you voluntarily give to us when you register with the Site.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span><strong>User-Generated Content:</strong> Stories, posts, comments, and other materials you create on the platform.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                3. Use of Your Information
              </h2>
              <p className="mb-4">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
              <ul className="list-none space-y-3">
                <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Create and manage your account.</li>
                <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Deliver your stories and content to the community.</li>
                <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Improve our website and user experience.</li>
                <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Monitor and analyze usage and trends to improve your experience with the Site.</li>
                <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                4. Data Security
              </h2>
              <p>
                We use administrative, technical, and physical security measures (powered by Appwrite BaaS) to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                5. Your Rights
              </h2>
              <p>
                You have the right to review, change, or terminate your account at any time. If you wish to delete your account or any of the stories you have published, you can do so directly from your Profile settings or by contacting our support team. Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                6. Contact Us
              </h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us via our GitHub repository or LinkedIn page linked in the footer.
              </p>
            </section>

          </div>
        </div>
      </Container>
    </div>
  )
}

export default Privacy
