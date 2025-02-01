import { useState, useEffect } from "react";

const useFetch = <T,>(url: string, intervalMs?: number) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network response was not ok");
        const json = await res.json();
        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    let intervalId: number;
    if (intervalMs) {
      intervalId = window.setInterval(fetchData, intervalMs);
    }
    return () => {
      isMounted = false;
      if (intervalMs) clearInterval(intervalId);
    };
  }, [url, intervalMs]);

  return { data, error, loading };
};

export default useFetch;
