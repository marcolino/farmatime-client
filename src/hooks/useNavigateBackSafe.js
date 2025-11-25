import { useNavigate } from "react-router-dom";

/**
 * Navigate back safely, being sure not to exit domain
 * 
 * @param {*} fallback 
 * @returns 
 */
export default function useNavigateBackSafe(fallback = "/") {
  const navigate = useNavigate();

  const safeBack = () => {
    // Case 1: A normal SPA navigation history exists
    if (window.history.length > 2) {
      navigate(-1);
      return;
    }

    // Case 2: No safe history → avoid exiting the domain
    navigate(fallback, { replace: true });
  };

  return safeBack;
}
