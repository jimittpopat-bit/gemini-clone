import { useEffect, useState } from "react";

export default function useDebounce(value, delay = 300) {
  const [debounce, setDebounce] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounce;
}
