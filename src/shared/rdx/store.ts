import { configureStore } from '@reduxjs/toolkit';

export interface IAppState {
}

export const store = configureStore<IAppState>({
    reducer: {
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;