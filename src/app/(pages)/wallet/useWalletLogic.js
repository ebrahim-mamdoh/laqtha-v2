"use client";
import { useState, useEffect } from "react";

export default function useWalletLogic() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/dashboard.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Wallet fetch error:", err));
  }, []);

  return { data };
}
    