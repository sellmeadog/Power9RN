import { AppState, AppStateStatus } from 'react-native';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { singleton } from 'tsyringe';

@singleton()
export class P9AppState {
  private appState$ = new BehaviorSubject(AppState.currentState);

  readonly active$ = this.appState$.pipe(map((status) => status === 'active'));

  get statusChanges(): Observable<AppStateStatus> {
    return this.appState$.asObservable();
  }

  constructor() {
    AppState.addEventListener('change', (status) => this.appState$.next(status));
  }
}
