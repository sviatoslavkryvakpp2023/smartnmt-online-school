import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton.jsx';

export default function NotFoundPage() {
  return (
    <div className="page narrow">
      <BackButton />
      <section className="not-found-card">
        <div className="not-found-code">404</div>
        <h1>Сторінку не знайдено</h1>
        <p>
          Можливо, сторінку було переміщено або адреса введена неправильно.
          Поверніться на головну або відкрийте каталог курсів SmartNMT.
        </p>
        <div className="hero-actions center-actions">
          <Link className="primary-btn" to="/">На головну</Link>
          <Link className="secondary-btn" to="/courses">До курсів</Link>
        </div>
      </section>
    </div>
  );
}
