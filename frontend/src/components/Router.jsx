import { useEffect, useState } from "react";

/**
 * Navigate to a new route without reloading the page.
 */
export function navigate(path) {
  if (window.location.pathname === path) {
    return;
  }

  window.history.pushState({}, "", path);

  // Tell usePath() that the URL has changed.
  window.dispatchEvent(new PopStateEvent("popstate"));

  // Start the new page from the top.
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/**
 * Custom Link component.
 *
 * Works like an <a> tag but uses the History API
 * so the page does not fully reload.
 */
export function Link({
  to,
  children,
  onClick,
  ...props
}) {
  const handleClick = (event) => {
    // Allow normal browser behavior for:
    // Ctrl + Click
    // Cmd + Click
    // Middle mouse click
    // Shift + Click
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    // Run the custom click handler first.
    onClick?.(event);

    // Navigate to the new route.
    navigate(to);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Returns the current URL pathname.
 *
 * Example:
 *
 * /             → "/"
 * /explore      → "/explore"
 * /product/123  → "/product/123"
 */
export function usePath() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const updatePath = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener(
      "popstate",
      updatePath
    );

    return () => {
      window.removeEventListener(
        "popstate",
        updatePath
      );
    };
  }, []);

  return path;
}
