// components/mark-done-button.tsx
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { markTaskDoneAction } from "@/app/dashboard/tasks/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MarkDoneButton({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await markTaskDoneAction(taskId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.success ?? "Marked as done");
      router.refresh(); // re-fetch the Server Component's data
    });
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "..." : "Mark Done"}
    </Button>
  );
}
