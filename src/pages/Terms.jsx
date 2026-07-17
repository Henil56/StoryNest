import React from 'react'
import { Container } from '../components'
import { Helmet } from 'react-helmet-async'

function Terms() {
  return (
    <div className="py-16 bg-surface text-text-primary min-h-screen">
      <Helmet>
        <title>Terms & Conditions | StoryNest</title>
      </Helmet>
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">Terms & Conditions</h1>
            <p className="text-text-secondary text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <div className="bg-surface-elevated rounded-3xl p-8 md:p-12 border border-white/10 dark:border-white/5 shadow-xl space-y-10 text-text-secondary leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using StoryNest ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                2. User Accounts & Registration
              </h2>
              <p className="mb-4">To fully use the Service, you must register for an account. By registering, you agree to:</p>
              <ul className="list-none space-y-3">
                <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Provide accurate, current, and complete information about yourself.</li>
                <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Maintain the security of your password and identification.</li>
                <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Accept full responsibility for all activities that occur under your account.</li>
                <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Notify us immediately of any unauthorized use of your account or any other breach of security.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                3. User-Generated Content
              </h2>
              <p className="mb-4">
                You retain ownership of all intellectual property rights in any content you submit to the Platform. However, by uploading, posting, or submitting content to StoryNest, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content in any existing or future media.
              </p>
              <p>
                You represent and warrant that you own or have the necessary licenses, rights, and permissions to publish the content you submit. StoryNest does not endorse any user-generated content and expressly disclaims any and all liability in connection with user submissions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                4. Prohibited Conduct
              </h2>
              <p className="mb-4">You agree not to use the Service to:</p>
              <ul className="list-none space-y-3">
                <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Upload or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another's privacy.</li>
                <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                <li className="flex items-start gap-2"><span className="text-primary-500 mt-1">•</span> Upload or transmit any material that contains software viruses or any other computer code designed to interrupt, destroy, or limit the functionality of the Platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                5. Termination
              </h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                6. Limitation of Liability
              </h2>
              <p>
                In no event shall StoryNest, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

          </div>
        </div>
      </Container>
    </div>
  )
}

export default Terms
