import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard.jsx';
import { courses } from '../data/mockData.js';

const features = [
  {
    icon: '📚',
    title: 'Повноцінні курси НМТ',
    desc: 'Структуровані матеріали, відеоуроки та практичні завдання по кожній темі.'
  },
  {
    icon: '📈',
    title: 'Контроль прогресу',
    desc: 'Відстежуй виконання уроків, результати тестів і свій реальний рівень підготовки.'
  },
  {
    icon: '🧠',
    title: 'Тести як на НМТ',
    desc: 'Тренувальні завдання та симуляція іспиту допомагають підготуватися до реального формату НМТ.'
  },
  {
    icon: '💳',
    title: 'Зручна оплата',
    desc: 'Після оплати учень одразу отримує доступ до навчальних матеріалів обраного курсу.'
  },
];

export default function HomePage(props) {
  const popularCourses = courses.filter((c) => c.status === 'active').slice(0, 3);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-text">
          <span className="eyebrow">Підготовка до НМТ 2026</span>
          <h1>
            Готуйся до НМТ разом зі SmartNMT — онлайн-школою, яка реально дає результат
          </h1>
          <p>
            Сучасна платформа для підготовки до НМТ: структуровані курси,
            зрозумілі уроки, тестові завдання та повний контроль прогресу.
            Навчайся у зручному темпі, відстежуй свій результат і впевнено
            йди до високого балу.
          </p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/courses">Обрати курс</Link>
            <Link className="secondary-btn" to="/cabinet">Мій кабінет</Link>
          </div>
        </div>

        <div className="hero-panel">
          <h3>SmartNMT у цифрах</h3>
          <div className="stats-grid">
            <div>
              <strong>1000+</strong>
              <span>учнів навчаються</span>
            </div>
            <div>
              <strong>{courses.length}</strong>
              <span>курсів НМТ</span>
            </div>
            <div>
              <strong>4.8</strong>
              <span>середній рейтинг</span>
            </div>
            <div>
              <strong>85%</strong>
              <span>складають на 180+</span>
            </div>
          </div>

          <div className="hero-panel-info">
            <p>🎯 Практика максимально наближена до реального НМТ</p>
            <p>📊 Детальна аналітика прогресу</p>
            <p>📱 Доступ з будь-якого пристрою</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <span className="eyebrow">Можливості платформи</span>
          <h2>Все необхідне для ефективної підготовки</h2>
          <p>
            SmartNMT об’єднує навчальні матеріали, практику, тести,
            оплату та прогрес учня в одному зручному кабінеті.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title row-title">
          <div>
            <span className="eyebrow">Популярні курси</span>
            <h2>Найпопулярніші курси підготовки до НМТ</h2>
            <p>Обери предмет та почни підготовку вже сьогодні</p>
          </div>
          <Link to="/courses" className="text-link">Усі курси →</Link>
        </div>

        <div className="cards-grid">
          {popularCourses.map((course) => (
            <CourseCard key={course.id} course={course} {...props} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <span className="eyebrow">Для кого платформа</span>
          <h2>Окремі можливості для учнів, викладачів та адміністратора</h2>
          <p>
            Інтерфейс адаптується під роль користувача, щоб кожен бачив
            тільки потрібні йому інструменти.
          </p>
        </div>

        <div className="roles-grid">
          <div className="role-card role-student">
            <div className="role-icon">👩‍🎓</div>
            <h3>Учень</h3>
            <ul>
              <li>Доступ до курсів після оплати</li>
              <li>Проходження уроків та тестів</li>
              <li>Відстеження прогресу</li>
              <li>Отримання результатів</li>
            </ul>
            <Link className="primary-btn small" to="/courses">
              Переглянути курси
            </Link>
          </div>

          <div className="role-card role-teacher">
            <div className="role-icon">👨‍🏫</div>
            <h3>Викладач</h3>
            <ul>
              <li>Керування курсами</li>
              <li>Контроль успішності учнів</li>
              <li>Перегляд матеріалів</li>
              <li>Аналітика навчання</li>
            </ul>
            <Link className="secondary-btn small" to="/cabinet">
              Відкрити кабінет
            </Link>
          </div>

          <div className="role-card role-admin">
            <div className="role-icon">⚙️</div>
            <h3>Адміністратор</h3>
            <ul>
              <li>Повний контроль платформи</li>
              <li>Керування користувачами</li>
              <li>Контроль оплат</li>
              <li>Статистика системи</li>
            </ul>
            <Link className="ghost-btn small" to="/admin">
              Адмін-панель
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}