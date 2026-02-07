import { Injectable, computed, inject } from '@angular/core';
import { Auth, user, authState } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, first, filter, timeout, catchError, of } from 'rxjs';
import {
  GoogleAuthProvider,
  linkWithPopup,
  signInAnonymously,
  signInWithPopup,
  signInWithCredential,
  signOut,
  AuthError
} from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly auth = inject(Auth);
  private readonly provider = new GoogleAuthProvider();

  private readonly user$ = user(this.auth);
  readonly user = toSignal(this.user$, { initialValue: null });

  readonly uid = computed(() => this.user()?.uid ?? null);
  readonly isAnonymous = computed(() => this.user()?.isAnonymous ?? false);
  readonly isLoggedIn = computed(() => !!this.user());

  get currentUid(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  async waitForAuthState() {
    return firstValueFrom(
      authState(this.auth).pipe(
        filter(user => user !== undefined),
        first(),
        timeout(3000),
        catchError(() => of(null))
      )
    );
  }

  async signInAnonymously() {
    await signInAnonymously(this.auth);
  }

  async signInWithGoogle() {
    const result = await signInWithPopup(this.auth, this.provider);
    return result.user;
  }

  private pendingCredential: any = null;

  async linkWithGoogle(): Promise<'linked' | 'needs-confirmation'> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('No user logged in');

    try {
      await linkWithPopup(currentUser, this.provider);
      return 'linked';
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/credential-already-in-use') {
        this.pendingCredential = GoogleAuthProvider.credentialFromError(authError);
        return 'needs-confirmation';
      }
      throw error;
    }
  }

  async confirmSwitchToExistingAccount(): Promise<void> {
    if (!this.pendingCredential) throw new Error('No pending credential');
    await signInWithCredential(this.auth, this.pendingCredential);
    this.pendingCredential = null;
  }

  async logout() {
    await signOut(this.auth);
  }
}
