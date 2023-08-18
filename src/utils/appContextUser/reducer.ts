/* eslint-disable no-fallthrough */
import { GlobalState } from './appContext';
import * as types from './types';

const initialState: GlobalState = {
  email: '',
  password: '',
};

export default function reducer(
  state: unknown,
  action: { type: string; payload: GlobalState }
) {
  switch (action.type) {
    case types.DATA_SUCCESS: {
      const newState: GlobalState = {
        email: action.payload.email,
        password: action.payload.password,
      };

      return newState;
    }
    case types.DATA_FAILURE: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
