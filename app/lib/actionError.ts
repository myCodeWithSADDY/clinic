
const ERROR_MESSAGES: Record<string, string> = {
  PHONE_ALREADY_EXISTS: "A record with this phone number already exists.",
  PATIENT_NOT_FOUND: "Patient not found.",
  PRESCRIPTION_NOT_FOUND: "Prescription not found.",
  APPOINTMENT_NOT_FOUND: "Appointment not found.",
  TASK_NOT_FOUND: "This task no longer exists.",
  UNAUTHORIZED: "You must be logged in to do this.",
  FORBIDDEN: "You don't have permission to do this.",
  TIME_SLOT_TAKEN: "This time slot is already booked.",
  INVALID_CREDENTIALS: "Invalid email or password.",
};

export function getActionError(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return ERROR_MESSAGES[error.message] ?? error.message ?? fallback;
  }
  return fallback;
}
