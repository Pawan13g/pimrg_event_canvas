import SessionReducer, { SessionState } from '@/app/login/session.slice';
import { configureStore } from '@reduxjs/toolkit';

export interface IAppState {
    session: SessionState;
}

export const store = configureStore<IAppState>({
    reducer: {
        session: SessionReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;