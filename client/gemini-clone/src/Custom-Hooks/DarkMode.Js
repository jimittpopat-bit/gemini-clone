import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // 👇 MUST be inside the hook
  const toggleDarkMode = async () => {
    const token = localStorage.getItem("token");
    const newTheme = dark ? "light" : "dark";

    // UI update
    setDark(!dark);

    // backend sync
    try {
      await fetch("http://localhost:8000/api/user/theme", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (e) {
      console.error("Theme sync failed");
    }
  };

  // 👇 return from inside the hook
  return [dark, toggleDarkMode];
}
