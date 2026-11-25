import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { Navbar } from './components/navbar/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <main className="page-shell">
          <Navbar />
          <AppRoutes />
          <footer className="footer"><span>Northstar Banking</span><span>Secure connection to your banking API</span></footer>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
