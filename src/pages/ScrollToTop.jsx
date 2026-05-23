import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // This forces the browser to instantly jump to the top left (x: 0, y: 0)
    window.scrollTo(0, 0);
  }, [pathname]); // It triggers every time the URL path changes

  return null; // It renders absolutely nothing to the screen
}