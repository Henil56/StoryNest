import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthLayout } from './components/index.js'
import PageLoader from './components/ui/PageLoader.jsx'

// Eagerly loaded components for fast initial paint
import Home from './pages/Home.jsx'

// Lazy-loaded components
const Login = React.lazy(() => import('./components/Login.jsx'))
const Signup = React.lazy(() => import('./pages/Signup.jsx'))
const AddPost = React.lazy(() => import('./pages/AddPost.jsx'))
const EditPost = React.lazy(() => import('./pages/EditPost.jsx'))
const Post = React.lazy(() => import('./pages/Post.jsx'))
const AllPost = React.lazy(() => import('./pages/AllPost.jsx'))
const AuthorPosts = React.lazy(() => import('./pages/AuthorPosts.jsx'))
const Privacy = React.lazy(() => import('./pages/Privacy.jsx'))
const Terms = React.lazy(() => import('./pages/Terms.jsx'))
const Resources = React.lazy(() => import('./pages/Resources.jsx'))
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'))
const OAuthCallback = React.lazy(() => import('./pages/OAuthCallback.jsx'))
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword.jsx'))
const ResetPassword = React.lazy(() => import('./pages/ResetPassword.jsx'))



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/oauth-callback",
            element: <Suspense fallback={<PageLoader />}><OAuthCallback /></Suspense>,
        },
        {
            path: "/login",
            element: (
                <AuthLayout authentication={false}>
                    <Suspense fallback={<PageLoader />}><Login /></Suspense>
                </AuthLayout>
            ),
        },
        {
            path: "/forgot-password",
            element: (
                <AuthLayout authentication={false}>
                    <Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>
                </AuthLayout>
            ),
        },
        {
            path: "/reset-password",
            element: (
                <AuthLayout authentication={false}>
                    <Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>
                </AuthLayout>
            ),
        },
        {
            path: "/signup",
            element: (
                <AuthLayout authentication={false}>
                    <Suspense fallback={<PageLoader />}><Signup /></Suspense>
                </AuthLayout>
            ),
        },
        {
            path: "/all-post",
            element: (
                <AuthLayout authentication>
                    <Suspense fallback={<PageLoader />}><AllPost /></Suspense>
                </AuthLayout>
            ),
        },
        {
            path: "/add-post",
            element: (
                <AuthLayout authentication>
                    <Suspense fallback={<PageLoader />}><AddPost /></Suspense>
                </AuthLayout>
            ),
        },
        {
            path: "/edit-post/:slug",
            element: (
                <AuthLayout authentication>
                    <Suspense fallback={<PageLoader />}><EditPost /></Suspense>
                </AuthLayout>
            ),
        },
        {
            path: "/post/:slug",
            element: <Suspense fallback={<PageLoader />}><Post /></Suspense>,
        },
        {
            path: "/author/:authorId",
            element: <Suspense fallback={<PageLoader />}><AuthorPosts /></Suspense>,
        },
        {
            path: "/privacy",
            element: <Suspense fallback={<PageLoader />}><Privacy /></Suspense>,
        },
        {
            path: "/terms",
            element: <Suspense fallback={<PageLoader />}><Terms /></Suspense>,
        },
        {
            path: "/resources",
            element: <Suspense fallback={<PageLoader />}><Resources /></Suspense>,
        },
        {
            path: "*",
            element: <Suspense fallback={<PageLoader />}><NotFound /></Suspense>,
        }
    ],
},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </HelmetProvider>
  </React.StrictMode>,
)