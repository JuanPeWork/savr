import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch
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
    const colRef = collection(this.firestore, this.collectionPath);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(this.firestore, this.collectionPath, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as T;
  }

  async create(item: T): Promise<void> {
    const docRef = doc(this.firestore, this.collectionPath, item.id);
    const { id, ...data } = item as any;
    await setDoc(docRef, data);
  }

  async createBatch(items: T[]): Promise<void> {
    if (items.length === 0) return;
    const batch = writeBatch(this.firestore);
    items.forEach(item => {
      const docRef = doc(this.firestore, this.collectionPath, item.id);
      const { id, ...data } = item as any;
      batch.set(docRef, data);
    });
    await batch.commit();
  }

  async update(item: T): Promise<void> {
    const docRef = doc(this.firestore, this.collectionPath, item.id);
    const { id, ...data } = item as any;
    await setDoc(docRef, data, { merge: true });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.firestore, this.collectionPath, id);
    await deleteDoc(docRef);
  }

  async deleteBatch(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const batch = writeBatch(this.firestore);
    ids.forEach(id => {
      const docRef = doc(this.firestore, this.collectionPath, id);
      batch.delete(docRef);
    });
    await batch.commit();
  }

  async clear(): Promise<void> {
    const colRef = collection(this.firestore, this.collectionPath);
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(this.firestore);
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }
}
