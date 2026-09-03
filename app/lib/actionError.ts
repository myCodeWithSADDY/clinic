export function getActionError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (process.env.NODE_ENV === "development") {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }

  return fallback;
}
