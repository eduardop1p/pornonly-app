/* eslint-disable no-fallthrough */
import { GlobalState } from './appContext';
import * as types from './types';

export default function reducer(
  state: unknown,
  action: { type: string; payload: GlobalState }
) {
  switch (action.type) {
    case types.LOGIN_ACTIVE_SUCCESS: {
      const newState: GlobalState = {
        loginActive: action.payload.loginActive,
        registerActive: action.payload.registerActive,
      };

      return newState;
    }
    case types.REGISTER_ACTIVE_SUCCESS: {
      const newState: GlobalState = {
        loginActive: action.payload.loginActive,
        registerActive: action.payload.registerActive,
      };

      return newState;
    }
    default: {
      return state;
    }
  }
}
