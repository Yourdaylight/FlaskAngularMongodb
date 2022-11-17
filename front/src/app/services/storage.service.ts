import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  getItem(key: string): string {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('GetValue error' + e);
      return null;
    }
  }
  setItem(key: string, value: string) {
    try {
      return localStorage.setItem(key, value);
    } catch (e) {
      return null;
    }
  }
  remove(key: string){
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Remove error' + e);
    }
  }
}
