import { DestroyRef, inject, Service, signal } from "@angular/core";
import { SPINNER_VERBS } from "../models/spinner-verbs";

@Service()
export class SpinnerVerbSvc {
  private readonly destroyRef = inject(DestroyRef);
  // Internal writable signal initialized with a random string
  private readonly _randomString = signal<string>("Welcome");

  // Public read-only signal exposed to consumers
  readonly verb = this._randomString.asReadonly();

  static GetWord() {
    const randomIndex = Math.floor(Math.random() * SPINNER_VERBS.length);
    return SPINNER_VERBS[randomIndex];
  }

  constructor() {
    const intervalId = setInterval(() => {
      this._randomString.set(SpinnerVerbSvc.GetWord());
    }, 1000);

    // Automatically clear the timer if the service is ever destroyed
    this.destroyRef.onDestroy(() => clearInterval(intervalId));
  }
}
