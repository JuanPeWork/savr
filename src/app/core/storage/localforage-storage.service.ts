import { Injectable } from '@angular/core';
import localforage from 'localforage';
import { StoragePort } from './storage-port.interface';

@Injectable({ providedIn: 'root' })
export class LocalForageStorageService implements StoragePort {

  constructor() {
    localforage.config({
      name: 'finance-space',
      storeName: 'app',
      version: 1,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    return await localforage.getItem<T>(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await localforage.setItem(key, value);
  }

  async remove(key: string): Promise<void> {
    await localforage.removeItem(key);
  }
}
