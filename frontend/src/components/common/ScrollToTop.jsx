import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { currentView, selectedRestaurantId } = useApp();

  useEffect(() => {
    // Scroll window to top on any page navigation or view switch
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname, currentView, selectedRestaurantId]);

  return null;
};
