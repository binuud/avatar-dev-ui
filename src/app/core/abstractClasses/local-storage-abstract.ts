import { isPlatformBrowser } from "@angular/common";
import {
  inject,
  PLATFORM_ID,
  WritableSignal,
  Signal,
  signal,
  computed,
} from "@angular/core";

export abstract class LocalStorageAbstract<T extends object> {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private _state: WritableSignal<T>;

  /** Public read-only signal for components to consume */
  readonly state: Signal<T>;

  private userUUID: string = "";

  constructor(
    private readonly storageKey: string,
    private readonly initialState: T,
  ) {
    this._state = signal<T>(this.initialState);
    this.state = this._state.asReadonly();
    this.loadState();
  }

  setUser(uuid: string) {
    this.userUUID = uuid;
  }

  private getStorageKey(): string {
    return `${this.userUUID}-${this.storageKey}`;
  }

  /** Select a specific slice of state as a computed signal */
  protected select<K extends keyof T>(key: K): Signal<T[K]> {
    return computed<T[K]>(() => this._state()[key]);
  }

  /** Merge partial updates into the current state */
  protected patchState(partialState: Partial<T>): void {
    this._state.update((current) => ({
      ...current,
      ...partialState,
    }));
    this.saveState();
  }

  /** Replace the entire state */
  protected setState(newState: T): void {
    this._state.set(newState);
  }

  /** Reset state back to its initial values */
  resetState(): void {
    this._state.set(this.initialState);
  }

  /** Save current state to localStorage */
  saveState(): void {
    if (!this.isBrowser) return;

    try {
      const serialized = JSON.stringify(this._state());
      localStorage.setItem(this.getStorageKey(), serialized);
    } catch (error) {
      console.error(
        `Failed to save state for key "${this.getStorageKey()}":`,
        error,
      );
    }
  }

  /** Load state from localStorage and merge with initialState */
  loadState(): void {
    if (!this.isBrowser) return;

    try {
      const raw = localStorage.getItem(this.getStorageKey());
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<T>;
      this._state.set({
        ...this.initialState,
        ...parsed,
      });
    } catch (error) {
      console.error(
        `Failed to load state for key "${this.storageKey}":`,
        error,
      );
    }
  }

  /** Remove persisted state from localStorage */
  clearStorage(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.getStorageKey());
  }
}
