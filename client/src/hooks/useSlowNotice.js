import { useEffect, useState } from "react";

const useSlowNotice = (active, delay = 4000) => {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!active) return undefined;
    const timer = setTimeout(() => setSlow(true), delay);
    return () => {
      clearTimeout(timer);
      setSlow(false);
    };
  }, [active, delay]);

  return active && slow;
};

export default useSlowNotice;