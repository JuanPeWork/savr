import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  DocumentData
} from '@angular/fire/firestore';
import { CollectionPort } from './collection-port.interface';
import { AuthService } from '@core/auth/auth.service';

export class FirestoreCollectionService<T extends { id: string }> implements CollectionPort<T> {

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private collectionName: string
  ) { }

  private get collectionPath(): string {
    const uid = this.authService.currentUid;
    if (!uid) throw new Error('User not authenticated');
    return `users/${uid}/${this.collectionName}`;
  }

  async getAll(): Promise<T[]> {
    try {
      const colRef = collection(this.firestore, this.collectionPath);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
      console.error(`[Firestore] Error getting ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(this.firestore, this.collectionPath, id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return { id: snapshot.id, ...snapshot.data() } as T;
    } catch (error) {
      console.error(`[Firestore] Error getting ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }

  async create(item: T): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionPath, item.id);
      const { id: _, ...data } = item as { id: string } & DocumentData;
      await setDoc(docRef, data);
    } catch (error) {
      console.error(`[Firestore] Error creating in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async createBatch(items: T[]): Promise<void> {
    if (items.length === 0) return;
    try {
      const batch = writeBatch(this.firestore);
      items.forEach(item => {
        const docRef = doc(this.firestore, this.collectionPath, item.id);
        const { id: _, ...data } = item as { id: string } & DocumentData;
        batch.set(docRef, data);
      });
      await batch.commit();
    } catch (error) {
      console.error(`[Firestore] Error batch creating in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(item: T): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionPath, item.id);
      const { id: _, ...data } = item as { id: string } & DocumentData;
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error(`[Firestore] Error updating in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionPath, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`[Firestore] Error deleting ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }

  async deleteBatch(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    try {
      const batch = writeBatch(this.firestore);
      ids.forEach(id => {
        const docRef = doc(this.firestore, this.collectionPath, id);
        batch.delete(docRef);
      });
      await batch.commit();
    } catch (error) {
      console.error(`[Firestore] Error batch deleting in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const colRef = collection(this.firestore, this.collectionPath);
      const snapshot = await getDocs(colRef);
      const batch = writeBatch(this.firestore);
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    } catch (error) {
      console.error(`[Firestore] Error clearing ${this.collectionName}:`, error);
      throw error;
    }
  }
}
