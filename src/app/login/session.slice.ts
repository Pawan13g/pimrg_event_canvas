import { role, user } from '@prisma/client';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SessionState {
    user?: user

}

const initialState: SessionState = {
    user: undefined,
}

export const SessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<user>) => {
            state.user = action.payload
        },
        logoutUser: (state) => {
            state.user = undefined
        },
    },
})

export const { loginUser, logoutUser } = SessionSlice.actions;

export default SessionSlice.reducer;