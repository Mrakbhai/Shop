import React, { useState, useEffect, useCallback } from 'react';
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
  LayoutDashboard,
  X
} from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setLocation] = useLocation();
  const { theme } = useTheme();
  const { user, isAuthenticated, isAdmin, isCreator, logout } = useAuth();
  const [location] = useLocation();

  // Close menu function
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      closeMenu();
    }
  };

  // Close menu when clicking outside
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
      // Prevent body scrolling when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, closeMenu]);

  // Close menu on location change
  useEffect(() => {
    closeMenu();
  }, [location, closeMenu]);

  // Custom navigation link component
  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link 
      href={href} 
      className={`font-medium hover:text-primary transition-colors ${
        location === href ? 'text-primary font-semibold' : 'text-foreground'
      }`}
      onClick={closeMenu}
    >
      {children}
    </Link>
  );

  // Mobile navigation link component
  const MobileNavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link 
      href={href} 
      className={`block py-2 px-4 hover:bg-primary/10 transition-colors rounded-md ${
        location === href ? 'text-primary font-semibold bg-primary/5' : 'text-foreground'
      }`}
      onClick={closeMenu}
    >
      {children}
    </Link>
  );

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={`sticky top-0 z-50 ${theme.headerClasses} shadow-sm theme-transition`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
            <span className="font-montserrat text-2xl font-bold text-primary">PrintOn</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/shop">Shop</NavLink>
            <NavLink href="/create">Create</NavLink>
            <NavLink href="/sell">Sell</NavLink>
            <NavLink href="/about">About</NavLink>
          </nav>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <ThemeSwitcher />

              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 h-9 pl-9 focus:w-60 transition-all duration-300"
                />
                <Search className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </form>

              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        {user?.photoURL ? (
                          <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                        ) : (
                          <AvatarFallback>
                            {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer" onClick={closeMenu} asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer" onClick={closeMenu} asChild>
                      <Link href="/profile/orders">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                      </Link>
                    </DropdownMenuItem>

                    {isCreator && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={closeMenu} asChild>
                          <Link href="/creator/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Creator Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={closeMenu} asChild>
                          <Link href="/creator/designs">
                            <Brush className="mr-2 h-4 w-4" />
                            <span>My Designs</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={closeMenu} asChild>
                          <Link href="/admin">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="default" size="sm" asChild>
                    <Link href="/login" onClick={closeMenu}>Login</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/register" onClick={closeMenu}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Auth Buttons & Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              {isAuthenticated ? (
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0" asChild>
                  <Link href="/profile" onClick={closeMenu}>
                    <Avatar className="h-8 w-8">
                      {user?.photoURL ? (
                        <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                      ) : (
                        <AvatarFallback>
                          {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Link>
                </Button>
              ) : (
                <Button variant="default" size="sm" className="h-8 px-3 py-1" asChild>
                  <Link href="/login" onClick={closeMenu}>Login</Link>
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
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-5 duration-200"
          >
            <div className="space-y-2 py-2">
              <form onSubmit={handleSearch} className="px-4 mb-4">
                <div className="flex gap-2">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={theme.inputClass}
                  />
                  <Button type="submit" size="icon" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
              
              <MobileNavLink href="/">Home</MobileNavLink>
              <MobileNavLink href="/shop">Shop</MobileNavLink>
              <MobileNavLink href="/create">Create</MobileNavLink>
              <MobileNavLink href="/sell">Sell</MobileNavLink>
              <MobileNavLink href="/about">About</MobileNavLink>

              <div className="flex items-center justify-between px-4 py-3 mt-2 border-t border-border">
                <div className="z-50">
                  <ThemeSwitcher />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" aria-label="Cart" asChild>
                    <Link href="/cart" onClick={closeMenu}>
                      <ShoppingCart className="h-5 w-5" />
                    </Link>
                  </Button>
                  
                  {isAuthenticated && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-red-500 opacity-100"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  )}
                </div>
              </div>

              {!isAuthenticated && (
                <div className="px-4 py-3 border-t border-border">
                  <Button variant="default" asChild className="w-full mb-2">
                    <Link href="/login" onClick={closeMenu}>Login</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/register" onClick={closeMenu}>Register</Link>
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