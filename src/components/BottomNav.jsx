import { NavLink } from 'react-router-dom';
import { Home, Lightbulb, Search, ShieldQuestion, ClipboardList } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Why', path: '/why-us', icon: Lightbulb },
    { name: 'Find', path: '/find', icon: Search },
    { name: 'Progress', path: '/progress', icon: ClipboardList },
    { name: 'Help', path: '/support', icon: ShieldQuestion },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon className="nav-icon" size={24} />
            <span className="nav-label">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
