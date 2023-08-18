import { useContext } from 'react';

import { Context } from './appContextUser/appContext';
import { GlobalState } from './appContextUser/appContext';

interface UseState {
  state: GlobalState;
  dispatch: any;
}

export default function useGlobalContext() {
  const { state, dispatch } = useContext(Context) as UseState;

  return { state, dispatch };
}
