import { inject, InjectionToken, Provider } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { CollectionPort } from './collection-port.interface';
import { FirestoreCollectionService } from './firestore-collection.service';
import { AuthService } from '@core/auth/auth.service';
import { SalaryDTO } from './mappers/salary.mapper';
import { MovementDTO } from './mappers/movement.mapper';

export const SALARY_COLLECTION = new InjectionToken<CollectionPort<SalaryDTO>>('SALARY_COLLECTION');
export const MOVEMENT_COLLECTION = new InjectionToken<CollectionPort<MovementDTO>>('MOVEMENT_COLLECTION');

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
