import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 hook
import { Menu, X } from "lucide-react";
import { navItems } from "../constants";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0(); // Add logout and authentication states

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <span className="text-xl tracking-tight font-extralight">📦 Listify</span>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
          
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            {/* Check if user is authenticated */}
            {!isAuthenticated ? (
              <>
              {/*}  <a href="#" onClick={() => loginWithRedirect()} className="py-2 px-3 border rounded-md">
                  Sign In
                </a>
                <a
                  href="#"
                  onClick={() => loginWithRedirect({ screen_hint: "signup" })}
                  className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md"
                >
                  Create an account
                </a>*/}
              </>
            ) : (
              <div>
                <span>Welcome, {user.name}</span>
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="py-2 px-3 border rounded-md"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6">
              {!isAuthenticated ? (
                <>
                  <a
                    href="#"
                    onClick={() => loginWithRedirect()}
                    className="py-2 px-3 border rounded-md"
                  >
                    Sign In
                  </a>
                  <a
                    href="#"
                    onClick={() => loginWithRedirect({ screen_hint: "signup" })}
                    className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800"
                  >
                    Create an account
                  </a>
                </>
              ) : (
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="py-2 px-3 border rounded-md"
                >
                  Log out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
