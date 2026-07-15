"use client";

import { useEffect, useRef, useState } from "react";

type NavItem = { id: string; label: string };

export default function CarDetailNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const ticking = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const threshold = 120;
        for (let i = items.length - 1; i >= 0; i--) {
          const el = document.getElementById(items[i].id);
          if (el && el.getBoundingClientRect().top <= threshold) {
            setActive(items[i].id);
            break;
          }
        }
        ticking.current = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-none py-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`shrink-0 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                active === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
