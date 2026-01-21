import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Global Error Handler
 * 
 * Catches all unhandled errors in the application and provides
 * consistent error handling and logging.
 * 
 * Features:
 * - Catches runtime errors
 * - Logs errors for debugging
 * - Prevents app crashes
 * - Can integrate with error monitoring services (Sentry, etc.)
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private router = inject(Router);

  handleError(error: Error | any): void {
    // Log error to console
    console.error('Global error caught:', error);

    // Extract error message
    const errorMessage = error?.message || error?.toString() || 'An unexpected error occurred';
    
    // Log stack trace in development
    if (error?.stack) {
      console.error('Stack trace:', error.stack);
    }

    // TODO: Send error to monitoring service (e.g., Sentry)
    // this.sendToMonitoring(error);

    // Show user-friendly error message
    // You can implement a toast/snackbar service here
    this.showErrorToUser(errorMessage);

    // Optionally navigate to error page for critical errors
    // if (this.isCriticalError(error)) {
    //   this.router.navigate(['/error']);
    // }
  }

  private showErrorToUser(message: string): void {
    // TODO: Implement toast/snackbar notification
    // For now, just log to console
    console.warn('User-facing error:', message);
  }

  private isCriticalError(error: any): boolean {
    // Define what constitutes a critical error
    return error?.status === 500 || error?.name === 'ChunkLoadError';
  }

  // private sendToMonitoring(error: any): void {
  //   // Example: Send to Sentry
  //   // Sentry.captureException(error);
  // }
}
