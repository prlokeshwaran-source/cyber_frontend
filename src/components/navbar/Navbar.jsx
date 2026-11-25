import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { credentials, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/login', { replace: true });
  }

  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="Northstar Banking home">
        <span className="brand-mark" aria-hidden="true">N</span>
        <span>northstar<span className="brand-light"> / banking</span></span>
      </Link>
      <div className="navbar-actions">
        <span className="environment-label"><span className="status-dot" /> BANKING</span>
        {credentials && <button className="text-button" type="button" onClick={handleSignOut}>Sign out</button>}
      </div>
    </header>
  );
}
