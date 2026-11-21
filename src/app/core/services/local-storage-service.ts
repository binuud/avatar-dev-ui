import { isPlatformBrowser } from "@angular/common";
import {
  computed,
  inject,
  PLATFORM_ID,
  Service,
  signal,
  Signal,
  WritableSignal,
} from "@angular/core";

@Service()
export class LocalStorageService {
  private userUUID: string = "";

  constructor() {}

  setUser(uuid: string) {
    this.userUUID = uuid;
  }

  key(key: string): string {
    return this.userUUID + key;
  }

  // Set a value in local storage
  setItem(key: string, value: string): void {
    localStorage.setItem(this.key(key), value);
  }

  // Get a value from local storage
  getItem(key: string): string | null {
    return localStorage.getItem(this.key(key));
  }

  // Remove a value from local storage
  removeItem(key: string): void {
    localStorage.removeItem(this.key(key));
  }

  // Clear all items from local storage
  clear(): void {
    localStorage.clear();
  }
}

export abstract class SignalStateService<T extends object> {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private _state: WritableSignal<T>;

  /** Public read-only signal for components to consume */
  readonly state: Signal<T>;

  constructor(
    private readonly storageKey: string,
    private readonly initialState: T,
  ) {
    this._state = signal<T>(this.initialState);
    this.state = this._state.asReadonly();
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
      localStorage.setItem(this.storageKey, serialized);
    } catch (error) {
      console.error(
        `Failed to save state for key "${this.storageKey}":`,
        error,
      );
    }
  }

  /** Load state from localStorage and merge with initialState */
  loadState(): void {
    if (!this.isBrowser) return;

    try {
      const raw = localStorage.getItem(this.storageKey);
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
    localStorage.removeItem(this.storageKey);
  }
}
