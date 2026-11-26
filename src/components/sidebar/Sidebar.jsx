import { NavLink } from 'react-router-dom';

export function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Banking navigation">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Overview</NavLink>
      <NavLink to="/transfer" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Transfer</NavLink>
      <NavLink to="/activity" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Activity</NavLink>
      <NavLink to="/security/url-check" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Phishing & spam check</NavLink>
    </nav>
  );
}
