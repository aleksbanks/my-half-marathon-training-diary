import './index.css'

import React from 'react'

import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { persistor, store } from './app/store/store.ts'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* PersistGate is used to persist the store in localStorage */}
      {/* Loading is null because we don't want to show anything while the store is loading */}
      {/* Maybe will add loader later */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
