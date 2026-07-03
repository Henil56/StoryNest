import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <footer className="border-t bg-white mt-20">
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="-m-6 flex flex-wrap">
            <div className="w-full p-6 md:w-1/2 lg:w-5/12">
              <div className="flex h-full flex-col justify-between">
                <div className="mb-4 inline-flex items-center">
                  <Logo size="medium" />
                </div>
                <div>
                        <p className="text-sm text-gray-600 mb-2">
                            StoryNestCreate.Read.Inspire.
                        </p>
                        <p className="text-sm text-gray-600">
                            &copy; Copyright 2026. All Rights Reserved by StoryNest.
                        </p>
                </div>
              </div>
            </div>
            <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                <div className="h-full">
                    <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                        Quick Links
                    </h3>
                    <ul>
                        <li className="mb-4">
                            <Link className="text-base font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200" to="/">Home</Link>
                        </li>
                        <li className="mb-4">
                            <Link className="text-base font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200" to="/all-post">Explore</Link>
                        </li>
                        <li className="mb-4">
                            <Link className="text-base font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200" to="/add-post">Write</Link>
                        </li>
                        <li>
                            <Link className="text-base font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200" to="/resources">Resources</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="w-full p-6 md:w-1/2 lg:w-2/12">
              <div className="h-full">
                <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                        More
                </h3>
                <ul>
                        <li className="mb-4">
                            <Link className="text-base font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200" to="/privacy">Privacy</Link>
                        </li>
                        <li className="mb-4">
                            <Link className="text-base font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200" to="/terms">Terms</Link>
                        </li>
                        <li>
                            <a className="text-base font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
                        </li>
                </ul>
              </div>
            </div>
            <div className="w-full p-6 md:w-1/2 lg:w-3/12">
              <div className="h-full">
                <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                  Legals
                </h3>
                <ul>
                  <li className="mb-4">
                    <Link
                      className=" text-base font-medium text-gray-900 hover:text-indigo-600"
                      to="/"
                    >
                      Terms &amp; Conditions
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link
                      className=" text-base font-medium text-gray-900 hover:text-indigo-600"
                      to="/"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      className=" text-base font-medium text-gray-900 hover:text-indigo-600"
                      to="/"
                    >
                      Licensing
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer