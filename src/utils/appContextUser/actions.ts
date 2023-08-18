import * as types from '@/utils/appContextUser/types';

import { GlobalState } from './appContext';

export function dataSuccess(payload: GlobalState) {
  return {
    type: types.DATA_SUCCESS,
    payload,
  };
}

export function dataFailure(payload: GlobalState) {
  return {
    type: types.DATA_FAILURE,
    payload,
  };
}
