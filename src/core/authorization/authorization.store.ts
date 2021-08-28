import { produce } from 'immer';
import { User } from 'realm';
import { Observer } from 'rxjs';
import { singleton } from 'tsyringe';

import { Store } from '@datorama/akita';

import { P9UserAuthorization } from './auth-client';

export interface P9User extends User, SimpleObject {
  last_login: number;
}

export interface P9AuthorizationState extends Record<string, unknown> {
  authorization?: P9UserAuthorization;
  user?: User;
  profile?: SimpleObject;
}

@singleton()
export class P9AuthorizationStore
  extends Store<P9AuthorizationState>
  implements Observer<Partial<P9AuthorizationState>>
{
  constructor() {
    super({}, { name: 'my', producerFn: produce });
  }

  next = (state: Partial<P9AuthorizationState>) => {
    this.update((draft) => {
      Object.keys(state).forEach((key) => {
        draft[key] = state[key];
      });
    });
  };

  error = (error: unknown) => {
    this.setError(error);
    this.setLoading(false);
  };

  complete = () => {
    this.setLoading(false);
  };
}
