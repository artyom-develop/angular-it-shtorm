import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { status } from '../../types/statusType';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}
  showToast(status: status, summary: string, message: string, life?: number): void {
    this.messageService.add({
      severity: status,
      summary: summary,
      detail: message,
      life: life || 4000,
    });
  }

  error(summary: string, message: string, life?: number): void {
    this.showToast(status.error, summary, message, life);
  }
  success(summary: string, message: string, life?: number): void {
    this.showToast(status.success, summary, message, life);
  }
  info(summary: string, message: string, life?: number): void {
    this.showToast(status.info, summary, message, life);
  }
  warn(summary: string, message: string, life?: number): void {
    this.showToast(status.warn, summary, message, life);
  }
}
