import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/refernces/counter/counterSlice';
import loginReducer from '../features/modals/loginSlice'
import createAccountReducer from '../features/modals/createAccountSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    login: loginReducer,
    createAccount: createAccountReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
