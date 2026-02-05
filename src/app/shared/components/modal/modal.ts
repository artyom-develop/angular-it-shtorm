import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DefaultResponse } from '../../../types/defaultResponse.interface';
import { ModalType } from '../../../types/modal/modalRequest.interface';
import { OffersEnum } from '../../../types/offereEnum.enum';
import { status } from '../../../types/statusType';
import { ClickHide } from '../../directives/click-hide';
import { PhoneInputDeirective } from '../../directives/phone-input-deirective';
import { ModalService } from '../../services/modal-service';
import { ToastService } from '../../services/toast';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-modal',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PhoneInputDeirective,
    ClickHide,
    Loading,
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  isThanks = signal(false);
  isError = signal<null | string>(null);

  fb = inject(FormBuilder);
  modalService = inject(ModalService);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  isShowOffers = signal(false);
  offers: OffersEnum[] = [];
  loading = signal(false);
  offerValue = signal<OffersEnum>(OffersEnum.WEBSITE_CREATION);
  modalObj = toSignal(this.modalService.offer$, {
    initialValue: {
      offer: '',
      type: ModalType.order,
    },
  });

  private timeOut!: ReturnType<typeof setTimeout>;
  onHideOffers(value: boolean) {
    if (value) {
      this.isShowOffers.set(false);
    }
  }
  constructor() {
    this.offers = this.modalService.offers;

    effect(() => {
      if (this.isError()) {
        if (this.timeOut) {
          clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(() => {
          this.isError.set(null);
        }, 3000);
      }
    });

    // Автоматическая очистка таймаута при уничтожении компонента
    this.destroyRef.onDestroy(() => {
      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }
    });
  }
  isTypeOrder(): boolean {
    return this.modalObj().type === ModalType.order;
  }
  toggleShowOffers() {
    this.isShowOffers.set(!this.isShowOffers());
  }

  choiceOffer(offer: OffersEnum) {
    this.offerValue.set(offer);
    this.isShowOffers.set(false);
  }

  modalForm = this.fb.nonNullable.group({
    offer: [this.modalObj().offer, [Validators.required]],
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[А-ЯЁA-Z][a-zа-яё]+$/),
      ],
    ],
    phone: ['', [Validators.required]],
  });

  close() {
    this.modalService.close();
    this.isThanks.set(false);
    this.loading.set(false);
    this.isError.set(null);
    this.modalForm.reset();
  }
  clickHide(shouldClose: boolean) {
    if (shouldClose) {
      this.close();
    }
  }
  onSubmit() {
    if (
      this.modalForm.valid &&
      this.modalForm.value.name &&
      this.modalForm.value.phone &&
      this.modalForm.value.offer
    ) {
      const service = this.modalForm.value.offer;
      const name = this.modalForm.value.name;
      const phone = this.modalForm.value.phone;

      if (this.isTypeOrder()) {
        this.loading.set(true);
        this.modalService
          .createOrder({ name, phone, service, type: ModalType.order })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (data: DefaultResponse) => {
              if (data.error) {
                this.isError.set(
                  'произошла ошибка при отправке формы, попробуйте еще раз'
                );
                this.toastService.showToast(
                  status.error,
                  'Ошибка',
                  'произошла ошибка при отправке формы, попробуйте еще раз'
                );
                this.isThanks.set(false);
              } else {
                this.isThanks.set(true);
                this.toastService.showToast(
                  status.success,
                  'Успешно',
                  'Ваша заявка успешно отправлена.'
                );
              }
              this.loading.set(false);
            },
            error: err => {
              this.isError.set(
                'произошла ошибка при отправке формы, попробуйте еще раз'
              );
              this.toastService.showToast(
                status.error,
                'Ошибка',
                'произошла ошибка при отправке формы, попробуйте еще раз'
              );
              this.isThanks.set(false);
              this.loading.set(false);
            },
          });
      } else {
        this.loading.set(true);
        this.modalService
          .createOrder({ name, phone, type: ModalType.consultation })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (data: DefaultResponse) => {
              if (data.error) {
                this.isError.set(
                  'произошла ошибка при отправке формы, попробуйте еще раз'
                );
                this.toastService.showToast(
                  status.error,
                  'Ошибка',
                  'произошла ошибка при отправке формы, попробуйте еще раз'
                );
                this.isThanks.set(false);
              } else {
                this.toastService.showToast(
                  status.success,
                  'Успешно',
                  'Ваша заявка успешно отправлена.'
                );
                this.isThanks.set(true);
              }
              this.loading.set(false);
            },
            error: err => {
              this.isError.set(
                'произошла ошибка при отправке формы, попробуйте еще раз'
              );
              this.toastService.showToast(
                status.error,
                'Ошибка',
                'произошла ошибка при отправке формы, попробуйте еще раз'
              );
              this.isThanks.set(false);
              this.loading.set(false);
            },
          });
      }

      this.modalForm.reset();
    } else {
      this.modalForm.markAllAsTouched();
      return;
    }
  }
}
