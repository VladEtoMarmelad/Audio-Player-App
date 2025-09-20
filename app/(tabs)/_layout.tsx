import { Provider } from 'react-redux'
import { store } from '@/store';
import { StacksRoot } from "@/components/StacksRoot";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StacksRoot />
    </Provider>
  )
}
