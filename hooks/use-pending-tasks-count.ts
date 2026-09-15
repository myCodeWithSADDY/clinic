// hooks/use-pending-tasks-count.ts
"use client";

import { useEffect, useState } from "react";

export function usePendingTasksCount(role: string | undefined) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!role) return;

    let cancelled = false;

    function load() {
      fetch(`/api/tasks/pending-count?role=${role}`)
        .then((res) => (res.ok ? res.json() : { count: 0 }))
        .then((data) => {
          if (!cancelled) setCount(data.count);
        })
        .catch(() => {});
    }

    load();
    // Poll every 30s so the badge updates without a full page reload
    const interval = setInterval(load, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [role]);

  return count;
}
