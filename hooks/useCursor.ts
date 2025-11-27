"use client";
import { useEffect } from "react";

export function useCursor() {
  useEffect(() => {
    const dot = document.querySelector(".cursor-dot") as HTMLElement;
    if (!dot) return;

    const moveCursor = (e: MouseEvent) => {
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    document.addEventListener("mousemove", moveCursor);

    // Add hover effect for links
    const handleMouseEnter = () => dot.classList.add("active");
    const handleMouseLeave = () => dot.classList.remove("active");

    // Re-attach listeners when DOM changes (simple approach for now)
    // Ideally we'd use a more robust way or a global context, but this works for basic static content
    const attachListeners = () => {
        const links = document.querySelectorAll("a, button, .grid-item, .modal-close");
        links.forEach((link) => {
            link.addEventListener("mouseenter", handleMouseEnter);
            link.addEventListener("mouseleave", handleMouseLeave);
        });
        return links;
    };

    let links = attachListeners();

    // MutationObserver to handle dynamic content (like modals opening)
    const observer = new MutationObserver(() => {
        // Clean up old listeners to avoid duplicates if re-running (though addEventListener handles dupes)
        // For simplicity, just re-query and re-add. 
        links = attachListeners();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      observer.disconnect();
      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleMouseEnter);
        link.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);
}
