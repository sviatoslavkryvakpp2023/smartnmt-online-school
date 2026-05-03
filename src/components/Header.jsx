import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const roleNames = { student: 'учень', teacher: 'викладач', admin: 'адміністратор' };

export default function Header({ currentUser, logout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Головна', end: true },
    { to: '/courses', label: 'Курси' },
    { to: '/cabinet', label: 'Кабінет' },
    ...(currentUser?.role === 'admin' ? [{ to: '/admin', label: 'Адмін' }] : []),
  ];

  return (
    <header className="header">
      <Link to="/" className="logo" onClick={() => setMobileOpen(false)}>
        <span className="logo-mark"><GraduationCap size={24} /></span>
        <div>
          <strong>SmartNMT</strong>
          <small>онлайн-школа</small>
        </div>
      </Link>

      {/* Десктопна навігація */}
      <nav className="nav desktop-nav">
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Блок користувача (десктоп) */}
      <div className="user-box desktop-user">
        {currentUser ? (
          <>
            <span className="avatar">{currentUser.avatar}</span>
            <div className="user-meta">
              <strong>{currentUser.name}</strong>
              <small>{roleNames[currentUser.role] || currentUser.role}</small>
            </div>
            <button className="ghost-btn" onClick={logout}>Вийти</button>
          </>
        ) : (
          <Link className="primary-btn small" to="/login">Увійти</Link>
        )}
      </div>

      {/* Гамбургер — тільки мобайл */}
      <button
        className={`burger-btn ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Відкрити меню"
      >
        <span /><span /><span />
      </button>

      {/* Мобільне меню */}
      {mobileOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mobile-user">
            {currentUser ? (
              <>
                <span className="avatar">{currentUser.avatar}</span>
                <div className="user-meta">
                  <strong>{currentUser.name}</strong>
                  <small>{roleNames[currentUser.role]}</small>
                </div>
                <button
                  className="ghost-btn"
                  onClick={() => { logout(); setMobileOpen(false); }}
                >
                  Вийти
                </button>
              </>
            ) : (
              <Link
                className="primary-btn small"
                to="/login"
                onClick={() => setMobileOpen(false)}
              >
                Увійти
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
