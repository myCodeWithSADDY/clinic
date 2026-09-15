// hooks/use-current-user.ts
"use client";

import { useEffect, useState } from "react";

type CurrentUser = { userId: string; email: string; role: string } | null;

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
