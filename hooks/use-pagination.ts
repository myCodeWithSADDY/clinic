
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type Options = {
  limit?: number;
};

export function usePaginatedResource<T>(endpoint: string, options?: Options) {
  const limit = options?.limit ?? 20;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    let ignore = false; 

    async function load() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search.trim()) {
          params.set("search", search.trim());
        }

        const res = await fetch(`${endpoint}?${params.toString()}`);

        if (res.status === 401) {
          redirect("/login");
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to load data");
        }

        const result: PaginatedResponse<T> = await res.json();
        if (ignore) return;

        setData(result.data);
        setPagination({
          total: result.meta.total,
          totalPages: result.meta.totalPages,
        });
      } catch (err) {
        if (ignore) return;
        console.error(err);
        setError("Failed to load data.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [endpoint, page, search, limit, refetchIndex]);


  function setSearch(value: string) {
    setSearchState(value);
    setPage(1);
  }


  function refetch() {
    setRefetchIndex((i) => i + 1);
  }

  return {
    data,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    pagination,
    refetch,
  };
}
