import { Provider } from 'react-redux'
import { store } from '@/store';
import { SessionProvider } from '@/components/SessionProvider';
import { StacksRoot } from '@/components/StacksRoot';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SessionProvider>
        <StacksRoot />
      </SessionProvider>
    </Provider>
  )
}
