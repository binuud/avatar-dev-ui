import { Service, signal } from "@angular/core";


export interface ToastMessage {
  id: number;
  title?: string;
  body: string;
  type: 'success' | 'danger' | 'warning' | 'info' | 'primary';
  delay: number;
}

@Service()
export class ToastSrv {
  private counter = 0;
  readonly toasts = signal<ToastMessage[]>([]);

  show(
    body: string,
    options: {
      title?: string;
      type?: ToastMessage['type'];
      delay?: number;
    } = {}
  ): void {
    const id = ++this.counter;
    const delay = options.delay ?? 5000;

    const newToast: ToastMessage = {
      id,
      title: options.title,
      body,
      type: options.type ?? 'info',
      delay,
    };

    this.toasts.update((current) => [...current, newToast]);

    if (delay > 0) {
      setTimeout(() => this.remove(id), delay);
    }
  }

  remove(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }

  notifyInfo(msg: string): void {
    this.show(msg, {
      title: 'Info',
      type: 'info',
      delay: 4000,
    });
  }

  notifySuccess(msg: string): void {
    this.show(msg, {
      type: 'success',
      delay: 4000,
    });
  }

  notifyError(msg: string): void {
    this.show(msg, {
      type: 'danger',
      delay: 6000,
    });
  }

}
