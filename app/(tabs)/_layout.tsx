import { Provider } from 'react-redux'
import { store } from '@/store';
import { SessionProvider } from '@/components/SessionProvider';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SessionProvider>
        <Stack screenOptions={{headerShown: false, animation: "slide_from_bottom"}}/>
      </SessionProvider>
    </Provider>
  )
}
