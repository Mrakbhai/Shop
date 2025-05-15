import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import Product from "@/pages/product";
import Create from "@/pages/create";
import Sell from "@/pages/sell";
import About from "@/pages/about";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Profile from "@/pages/profile/index";
import Orders from "@/pages/profile/orders";
import CreatorDashboard from "@/pages/creator/dashboard";
import CreatorDesigns from "@/pages/creator/designs";
import AdminPanel from "@/pages/admin/index";
import CouponPurchase from "@/pages/coupons/purchase";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useTheme } from "@/lib/themeContext";
import ScrollToTop from "@/components/ScrollToTop";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={Product} />
      <Route path="/create" component={Create} />
      <Route path="/sell" component={Sell} />
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile/orders" component={Orders} />
      <Route path="/creator/dashboard" component={CreatorDashboard} />
      <Route path="/creator/designs" component={CreatorDesigns} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/coupons/purchase" component={CouponPurchase} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className={`min-h-screen font-sfpro ${theme.bodyClasses}`}>
          <Header />
          <ScrollToTop />
          <main>
            <Toaster />
            <Router />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;