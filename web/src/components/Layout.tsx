import { Outlet } from 'react-router'
import Navbar from './Navbar.tsx'
import Footer from './Footer.tsx'
import styles from './Layout.module.css'

// <Outlet /> is where the current page (Home, About, ...) gets rendered.
function Layout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
