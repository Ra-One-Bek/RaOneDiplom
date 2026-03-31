import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { AuthProvider } from './features/auth/AuthContext';
import ChatWidget from './features/ai-assistant/ChatWidget';

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ChatWidget />
    </AuthProvider>
  );
};

export default App;