import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton.jsx';
import { users } from '../data/mockData.js';

export default function LoginPage({ loginAs, currentUser }) {
  const navigate = useNavigate();

  function handleLogin(id) {
    loginAs(id);
    navigate('/cabinet');
  }

  return (
    <div className="page narrow">
      <BackButton />
      <div className="section-title center"><span className="eyebrow">Авторизація</span><h1>Вхід у навчальну платформу</h1><p>Оберіть профіль користувача, щоб переглянути інтерфейс учня, викладача або адміністратора.</p></div>
      <div className="login-grid">
        {users.map((user) => (
          <button key={user.id} className={`login-card ${currentUser?.id === user.id ? 'active' : ''}`} onClick={() => handleLogin(user.id)}>
            <span className="avatar big">{user.avatar}</span>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
            <span className="status paid">{user.role}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
