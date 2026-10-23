import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Theme {

   private _theme = signal<'light' | 'dark'>('light');
  
  // Computed signal to apply to document
  readonly currentTheme = computed(() => this._theme());

  constructor() {
    // Initialize from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      this._theme.set(savedTheme);
      this.applyTheme(this._theme());
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const preferredTheme = prefersDark ? 'dark' : 'light';
      this.setTheme(preferredTheme);
    }
    
  }

  setTheme(theme: 'light' | 'dark') {
    this._theme.set(theme);
    localStorage.setItem('theme', theme);
    console.log("Theme changed ", theme);
    this.applyTheme(theme);
  }

  toggleTheme() {
    this.setTheme(this._theme() === 'light' ? 'dark' : 'light');
  }

  private applyTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
  
}
