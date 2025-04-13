
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useForumStore } from "@/lib/store";
import { LogIn, LogOut, Menu, User, UserPlus } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const { currentUser, logout } = useForumStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-2xl">Crimson Echo</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full mr-2 ${currentUser.avatarColor} flex items-center justify-center text-white font-bold`}
                  >
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-foreground">{currentUser.username}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="ml-4"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background text-foreground">
                <SheetHeader>
                  <SheetTitle className="text-primary">Crimson Echo Forums</SheetTitle>
                  <SheetDescription>
                    {currentUser ? `Welcome, ${currentUser.username}!` : "Join the conversation"}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {currentUser ? (
                    <>
                      <div className="flex items-center py-2">
                        <div 
                          className={`w-8 h-8 rounded-full mr-2 ${currentUser.avatarColor} flex items-center justify-center text-white font-bold`}
                        >
                          {currentUser.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-foreground">{currentUser.username}</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        asChild
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link to="/login">
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Link>
                      </Button>
                      <Button
                        variant="default"
                        className="w-full"
                        asChild
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link to="/register">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Register
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
