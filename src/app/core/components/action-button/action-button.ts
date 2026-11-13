import { Component, input, output, signal } from "@angular/core";

@Component({
  imports: [],
  selector: "app-action-button",
  styleUrl: "./action-button.scss",
  templateUrl: "./action-button.html",
})
export class ActionButton<T = unknown> {
  
  // Accepts any zero-argument function returning a Promise
  action = input.required<() => Promise<T>>();
  
  buttonClass = input<string>('');

  loadingText = input<string>('Processing...');
  disabled = input<boolean>(false);

  // Emits the resolved result or caught error back to the parent
  completed = output<T>();
  failed = output<unknown>();

  isLoading = signal(false);

  async executeAction(): Promise<void> {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    try {
      const result = await this.action()();
      this.completed.emit(result);
    } catch (error) {
      this.failed.emit(error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
