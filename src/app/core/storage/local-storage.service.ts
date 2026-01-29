import { Injectable } from '@angular/core';
import { StoragePort } from './storage-port.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements StoragePort{

  async get<T>(key: string): Promise<T | null> {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    console.log('Guardamos localstorage')
    localStorage.setItem(key, JSON.stringify(value))
  }

  async remove(key: string): Promise<void> {
    return localStorage.removeItem(key);
  }


}
