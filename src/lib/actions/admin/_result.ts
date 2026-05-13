/**
 * Standard return shape for admin server actions.
 *
 * Always exhaustive: every action returns either { success: true, data }
 * or { success: false, error }. Client components branch on `.success`
 * to drive Sonner toasts.
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
