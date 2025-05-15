import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'wouter';
import { useTheme } from '@/lib/themeContext';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import ThemeSwitcher from './ThemeSwitcher';
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  Package, 
  Brush, 
  LayoutDashboard
} from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setLocation] = useLocation();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/shop?search=${encodeURIComponent(searchQuery)}`);
    closeMenu();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const menuButton = document.getElementById('menu-button');
      if (mobileMenu && 
          !mobileMenu.contains(event.target as Node) && 
          menuButton && 
          !menuButton.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  const { theme } = useTheme();
  const { user, isAuthenticated, isAdmin, isCreator, logout } = useAuth();
  const [location] = useLocation();

  return (
    <header className={`sticky top-0 z-50 ${theme.headerClasses} shadow-sm theme-transition`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-2">
            <span className="font-montserrat text-2xl font-bold text-primary">PrintOn</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-medium hover:text-primary transition-colors ${
              location === '/' ? 'text-primary' : 'text-foreground'
            }`}>
              Home
            </Link>
            <Link href="/shop" className={`font-medium hover:text-primary transition-colors ${
              location === '/shop' ? 'text-primary' : 'text-foreground'
            }`}>
              Shop
            </Link>
            <Link href="/create" className={`font-medium hover:text-primary transition-colors ${
              location === '/create' ? 'text-primary' : 'text-foreground'
            }`}>
              Create
            </Link>
            <Link href="/sell" className={`font-medium hover:text-primary transition-colors ${
              location === '/sell' ? 'text-primary' : 'text-foreground'
            }`}>
              Sell
            </Link>
            <Link href="/about" className={`font-medium hover:text-primary transition-colors ${
              location === '/about' ? 'text-primary' : 'text-foreground'
            }`}>
              About
            </Link>
          </nav>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <ThemeSwitcher />

              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        {user?.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.username} />
                        ) : (
                          <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <Link href="/profile">
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <Link href="/profile/orders">
                        <span>Orders</span>
                      </Link>
                    </DropdownMenuItem>

                    {isCreator && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <Link href="/creator/dashboard">
                            <span>Creator Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Brush className="mr-2 h-4 w-4" />
                          <Link href="/creator/designs">
                            <span>My Designs</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <Link href="/admin">
                            <span>Admin Panel</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="default" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Auth Buttons & Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              {isAuthenticated ? (
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" asChild>
                  <Link href="/profile">
                    <Avatar className="h-8 w-8">
                      {user?.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.username} />
                      ) : (
                        <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                  </Link>
                </Button>
              ) : (
                <Button variant="default" size="sm" className="h-8 px-3 py-1" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              )}

              <Button 
                id="menu-button"
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-border">
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="px-2">
                <div className="flex gap-2">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" size="icon" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
              <Link href="/" className="block py-2 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/shop" className="block py-2 hover:text-primary transition-colors">
                Shop
              </Link>
              <Link href="/create" className="block py-2 hover:text-primary transition-colors">
                Create
              </Link>
              <Link href="/sell" className="block py-2 hover:text-primary transition-colors">
                Sell
              </Link>
              <Link href="/about" className="block py-2 hover:text-primary transition-colors">
                About
              </Link>

              <div className="flex items-center space-x-4 py-2">
                <ThemeSwitcher />
                <Button variant="ghost" size="icon" aria-label="Search">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Cart">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </div>

              {!isAuthenticated && (
                <div className="py-2">
                  <Button variant="default" asChild className="w-full">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full mt-2">
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;