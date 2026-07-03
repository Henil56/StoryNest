import React from 'react'
import {Container,Logo,LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function Header() {
  const authStatus=useSelector((state)=>state.auth.status)
  const navigate=useNavigate()

  const navItems=[
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "All Posts",
      slug: "/all-post",
      active: authStatus,
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <Container>
        <nav className='flex'>
          <div className='mr-4 flex items-center'>
            <Link to='/'>
              <Logo size='small' className='text-indigo-600' />
            </Link>
          </div>
          <ul className='flex items-center gap-2 ml-auto list-none'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name} className='inline-block'>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='px-3 py-1 rounded-md text-sm hover:bg-indigo-600 hover:text-white transition-colors'
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header