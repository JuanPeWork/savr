import { inject, InjectionToken, Provider } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { CollectionPort } from './collection-port.interface';
import { FirestoreCollectionService } from './firestore-collection.service';
import { AuthService } from '@core/auth/auth.service';
import { Salary } from '@domain/finance/interfaces/salary.interface';
import { Movement } from '@domain/finance/interfaces/movements.interface';

export const SALARY_COLLECTION = new InjectionToken<CollectionPort<Salary>>('SALARY_COLLECTION');
export const MOVEMENT_COLLECTION = new InjectionToken<CollectionPort<Movement>>('MOVEMENT_COLLECTION');

export function provideFirestoreCollection<T extends { id: string }>(
  token: InjectionToken<CollectionPort<T>>,
  collectionName: string
): Provider {
  return {
    provide: token,
    useFactory: () => new FirestoreCollectionService<T>(
      inject(Firestore),
      inject(AuthService),
      collectionName
    )
  };
}
