import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SessionState {
  colorScheme: "light"|"dark";
  cachedColorScheme: "light"|"dark"|"system"; // colorScheme stored in app cache
}
const initialState: SessionState = {
  colorScheme: "dark",
  cachedColorScheme: "system"
}

interface ChangeStatePayload {
  fieldName: keyof SessionState; 
  fieldValue: any;
}

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    changeSessionState: (state, action: PayloadAction<ChangeStatePayload>) => {
      const { fieldName, fieldValue } = action.payload
      state[fieldName] = fieldValue
    }
  }
})

export const { changeSessionState } = sessionSlice.actions
export default sessionSlice.reducer