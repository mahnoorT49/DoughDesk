import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mainLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/materials', label: 'Materials' },
  { to: '/products', label: 'Products' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/costing', label: 'Costing' },
  { to: '/prices', label: 'Price comparison' },
];
const bottomLinks = [
  { to: '/profile', label: 'Profile' },
  { to: '/settings', label: 'Settings' },
  { to: '/help', label: 'Help' },
];

// NavLink adds the class "active" to the link of the current page automatically
export default function Sidebar({ open, onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <aside className={'sidebar' + (open ? ' open' : '')} onClick={onNavigate}>
      <div className="logo">DoughDesk</div>
      <nav>
        {mainLinks.map((l) => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="user-name">Signed in as {user.name}</div>
        {bottomLinks.map((l) => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
        <button className="sidebar-link" onClick={logout}>Log out</button>
      </div>
    </aside>
  );
}