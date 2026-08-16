import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack" aria-live="polite" aria-atomic="true">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="app-toast" [class]="'app-toast--' + toast.kind" role="status">
          <i class="fa-solid" [class.fa-circle-check]="toast.kind === 'success'"
             [class.fa-circle-exclamation]="toast.kind === 'error'"
             [class.fa-circle-info]="toast.kind === 'info'"></i>
          <span>{{ toast.message }}</span>
          <button type="button" class="btn-close-toast" (click)="toastService.dismiss(toast.id)" aria-label="Dismiss">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed;
      top: 1rem;
      right: 1rem;
      left: 1rem;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
      max-width: 360px;
      margin-left: auto;
      pointer-events: none;
    }

    .app-toast {
      pointer-events: auto;
      width: 100%;
    }

    .app-toast {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem 1rem;
      border-radius: 5px;
      background: #ffffff;
      border: 1px solid #e7e3ee;
      box-shadow: 0 4px 16px rgba(26, 26, 26, 0.12);
      font-size: 0.9rem;
      animation: slide-in 0.2s ease;
    }

    .app-toast--success { border-left: 3px solid #1f8a55; i:first-child { color: #1f8a55; } }
    .app-toast--error { border-left: 3px solid #c0392b; i:first-child { color: #c0392b; } }
    .app-toast--info { border-left: 3px solid #5b2c8f; i:first-child { color: #5b2c8f; } }

    .btn-close-toast {
      margin-left: auto;
      border: none;
      background: none;
      color: #6b6b6b;
      cursor: pointer;
      padding: 0.15rem;
    }

    @keyframes slide-in {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .app-toast { animation: none; }
    }
  `],
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
}
