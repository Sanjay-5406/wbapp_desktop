"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // Adjust path to your browser client helper
import { navStyles } from '@/mycss/styles';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  // 1. Listen to Supabase auth state changes in real-time
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    // Listen to sign-in / sign-out events across the browser tabs
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // 2. Handle the sign-out click action
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Tells Next.js server components to reload data
    router.push('/login'); // Sends user back to landing area
  };

  // 3. Define standard core links present for everyone
  const coreLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products'},
    { label: 'Cart', href: '/cart'},
    { label: 'Chat', href: '/chat' },
    { label: 'Files', href: '/myfiles' },
  ];

  return (
    <>
      <nav style={navStyles.navbar}>
        <h1 style={navStyles.siteName}>WBapp</h1>
        <div style={navStyles.rightContainer}>
          {/* Render regular links */}
          {coreLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                style={{ 
                  ...navStyles.linkDefault, 
                  ...(isActive ? navStyles.linkActive : {}) 
                }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* 4. Conditional Rendering: Switch UI if signed in */}
          {user ? (
            <button
              onClick={handleLogout}
              style={{
                ...navStyles.linkDefault,
                color: 'rgb(218, 74, 74)',          // Explicit bright red color text
                fontWeight: 'bold',    // Stands out as an action item
                background: 'none',    // Removes default button backgrounds
                border: 'none',        // Removes borders to match link layout
                cursor: 'pointer',
                fontFamily: 'inherit', // Retains your existing layout font settings
                fontSize: 'inherit',
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link 
                href="/login" 
                style={{ ...navStyles.linkDefault, ...(pathname === '/login' ? navStyles.linkActive : {}) }}
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                style={{ ...navStyles.linkDefault, ...(pathname === '/signup' ? navStyles.linkActive : {}) }}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
