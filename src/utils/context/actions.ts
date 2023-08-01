import * as types from '@/utils/context/types';

import { GlobalState } from './appContext';

export function loginActiveSuccess(payload: GlobalState) {
  return {
    type: types.LOGIN_ACTIVE_SUCCESS,
    payload,
  };
}

export function registerActiveSuccess(payload: GlobalState) {
  return {
    type: types.REGISTER_ACTIVE_SUCCESS,
    payload,
  };
}
