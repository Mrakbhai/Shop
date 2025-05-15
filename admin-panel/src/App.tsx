import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Helmet } from 'react-helmet'
import { Switch, Route } from 'wouter'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/lib/authContext'
import { ThemeProvider } from '@/lib/themeContext'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/dashboard'
import Creators from '@/pages/creators'
import Products from '@/pages/products'
import Orders from '@/pages/orders'
import Analytics from '@/pages/analytics'
import Settings from '@/pages/settings'
import Login from '@/pages/login'
import NotFound from '@/pages/notFound'
import ProtectedRoute from '@/components/ProtectedRoute'

// Create a QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Helmet
            titleTemplate="%s | PrintOn Admin"
            defaultTitle="PrintOn Admin Control Panel"
          />
          <Toaster />
          <Switch>
            <Route path="/login" component={Login} />
            
            <Route path="/">
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/creators">
              <ProtectedRoute>
                <Layout>
                  <Creators />
                </Layout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/products">
              <ProtectedRoute>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/orders">
              <ProtectedRoute>
                <Layout>
                  <Orders />
                </Layout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/analytics">
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            </Route>
            
            <Route path="/settings">
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            </Route>
            
            <Route component={NotFound} />
          </Switch>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App