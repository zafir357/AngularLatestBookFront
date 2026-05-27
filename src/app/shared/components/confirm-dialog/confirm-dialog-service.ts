import { Injectable, signal } from '@angular/core';

export interface DialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  isOpen = signal(false);
  config = signal<DialogConfig>({
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    danger: true
  });

  private resolveCallback: ((value: boolean) => void) | null = null;

  open(config: DialogConfig): Promise<boolean> {
    this.config.set({
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      danger: true,
      ...config
    });
    this.isOpen.set(true);

    return new Promise((resolve) => {
      this.resolveCallback = resolve;
    });
  }

  confirm() {
    this.isOpen.set(false);
    this.resolveCallback?.(true);
  }

  cancel() {
    this.isOpen.set(false);
    this.resolveCallback?.(false);
  }
}
