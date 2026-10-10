import { useEffect } from 'react'
import { CatalogProvider } from './context/CatalogContext'
import { ToastProvider } from './context/ToastContext'
import { StoreProvider } from './context/StoreContext'
import { useLocation } from './lib/router'
import { useStore } from './context/StoreContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/Cart'
import Checkout, { OrderSuccess } from './pages/Checkout'
import Admin from './pages/admin/Admin'

function Routes() {
  const { path } = useLocation()
  const { closeDrawer } = useStore()

  // On page change: scroll to top (not when only filters change) and close the cart drawer.
  useEffect(() => {
    window.scrollTo(0, 0)
    closeDrawer()
  }, [path]) // eslint-disable-line react-hooks/exhaustive-deps

  if (path.startsWith('/admin')) return <Admin />

  let page
  if (path === '/') page = <Home />
  else if (path === '/shop') page = <Shop />
  else if (path.startsWith('/product/')) page = <ProductDetail slug={path.replace('/product/', '')} />
  else if (path === '/cart') page = <CartPage />
  else if (path === '/checkout') page = <Checkout />
  else if (path === '/checkout/success') page = <OrderSuccess />
  else page = <Home />

  return (
    <>
      <Navbar />
      <main id="main">{page}</main>
      <Footer />
      <CartDrawer />
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <CatalogProvider>
        <StoreProvider>
          <Routes />
        </StoreProvider>
      </CatalogProvider>
    </ToastProvider>
  )
}
