import { Service } from "@angular/core";

@Service()
export class LocalStorageService {

  private userUUID: string = "";


  constructor() {}

  setUser(uuid: string) {
    this.userUUID = uuid;
  }

  key(key:string): string {
    return this. userUUID + key;
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
