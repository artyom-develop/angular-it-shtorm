import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { Modal } from './shared/components/modal/modal';
import { ModalService } from './shared/services/modal-service';

@Component({
  selector: 'app-root',

  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet, Toast, Modal],
})
export class App {
  private modalService = inject(ModalService);
  isOpen = toSignal(this.modalService.isOpen$, { initialValue: false });
}
