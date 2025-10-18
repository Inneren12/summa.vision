"use client";
import { useEffect, useState } from "react";
export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("dark");
  useEffect(() => {
    try {
      const t = localStorage.getItem("theme") || "dark";
      setTheme(t);
      document.documentElement.setAttribute("data-theme", t);
    } catch {}
  }, []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
    } catch {}
  }
  return (
    <button onClick={toggle} className="px-3 py-1 rounded border">
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
