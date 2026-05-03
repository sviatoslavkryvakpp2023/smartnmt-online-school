import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton.jsx';
import { courses } from '../data/mockData.js';

const plans = [
  { id: 'basic', label: 'Базовий', desc: 'Записи уроків + тести', multiplier: 0.75 },
  { id: 'standard', label: 'Стандарт', desc: 'Записи + вебінари + перевірка ДЗ', multiplier: 1.0 },
  { id: 'premium', label: 'Преміум', desc: 'Все + індивідуальні консультації', multiplier: 1.35 },
];

const paymentMethods = [
  { id: 'card', label: 'Банківська картка', icon: '💳' },
  { id: 'mono', label: 'Monobank', icon: '🏦' },
  { id: 'liqpay', label: 'LiqPay', icon: '🟢' },
];

export default function PaymentPage({ currentUser, paidCourses, enrolledCourses, payCourse, enrollCourse }) {
  const { courseId } = useParams();
  const course = courses.find((item) => item.id === Number(courseId));
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [method, setMethod] = useState('card');
  const [step, setStep] = useState(1);
  const [receipt, setReceipt] = useState(null);

  const orderNumber = useMemo(() => `SNMT-${Date.now().toString().slice(-6)}`, []);

  if (!course) {
    return (
      <div className="page">
        <BackButton />
        <div className="empty-state">Курс не знайдено</div>
      </div>
    );
  }

  const isStudent = currentUser?.role === 'student';
  const isPaid = isStudent && paidCourses.includes(course.id);
  const isEnrolled = isStudent && enrolledCourses.includes(course.id);
  const plan = plans.find((p) => p.id === selectedPlan);
  const paymentMethod = paymentMethods.find((item) => item.id === method);
  const finalPrice = Math.round(course.price * plan.multiplier);

  if (!isStudent) {
    return (
      <div className="page narrow">
        <BackButton />
        <div className="empty-state locked-page">
          <div className="locked-icon">💳</div>
          <h2>Оплата недоступна для цієї ролі</h2>
          <p>Викладач або адміністратор не купує курси. Для перевірки оплати увійдіть як учень.</p>
          <Link className="primary-btn" to="/login">Увійти як учень</Link>
        </div>
      </div>
    );
  }

  function handlePay() {
    if (!isEnrolled) enrollCourse(course.id);
    payCourse(course.id);
    setReceipt({
      orderNumber,
      date: new Date().toLocaleString('uk-UA'),
      method: paymentMethod.label,
      amount: finalPrice,
      plan: plan.label,
    });
    setStep(3);
  }

  return (
    <div className="page narrow">
      <BackButton />

      <nav className="breadcrumbs">
        <Link to="/courses">Курси</Link>
        <span>/</span>
        <Link to={`/courses/${course.id}`}>{course.title}</Link>
        <span>/</span>
        <span>Оплата</span>
      </nav>

      {!isPaid && step !== 3 && (
        <div className="payment-steps">
          <div className={`payment-step ${step >= 1 ? 'active' : ''}`}><span>1</span> Тариф</div>
          <div className="payment-step-line" />
          <div className={`payment-step ${step >= 2 ? 'active' : ''}`}><span>2</span> Підтвердження</div>
          <div className="payment-step-line" />
          <div className={`payment-step ${step >= 3 ? 'active' : ''}`}><span>3</span> Доступ</div>
        </div>
      )}

      {(isPaid || step === 3) && (
        <div className="payment-card payment-success-card">
          <div className="payment-success-icon">✅</div>
          <h1>Доступ до курсу відкрито</h1>
          <p>Оплату підтверджено. Тепер ви можете проходити уроки курсу «{course.title}».</p>
          <div className="payment-lines">
            <div><span>Номер замовлення</span><strong>{receipt?.orderNumber || orderNumber}</strong></div>
            <div><span>Курс</span><strong>{course.title}</strong></div>
            <div><span>Тариф</span><strong>{receipt?.plan || 'Стандарт'}</strong></div>
            <div><span>Спосіб оплати</span><strong>{receipt?.method || 'Оплачено раніше'}</strong></div>
            <div><span>Статус</span><strong className="green-text">✅ Підтверджено</strong></div>
            {receipt?.date && <div><span>Дата операції</span><strong>{receipt.date}</strong></div>}
          </div>
          <Link className="primary-btn full" to={`/courses/${course.id}`}>📚 Перейти до матеріалів</Link>
          <Link className="secondary-btn full" to="/cabinet">👤 Мій кабінет</Link>
        </div>
      )}

      {!isPaid && step === 1 && (
        <div className="payment-card">
          <span className="eyebrow">Оплата курсу</span>
          <h1>{course.title}</h1>
          <p className="hint">Оберіть тарифний план, що підходить для вашої підготовки.</p>

          <div className="plans-grid">
            {plans.map((p) => (
              <button
                key={p.id}
                className={`plan-card ${selectedPlan === p.id ? 'plan-card--active' : ''}`}
                onClick={() => setSelectedPlan(p.id)}
              >
                <strong className="plan-name">{p.label}</strong>
                <span className="plan-price">{Math.round(course.price * p.multiplier).toLocaleString('uk-UA')} ₴</span>
                <small className="plan-desc">{p.desc}</small>
                {p.id === 'standard' && <span className="plan-badge">Популярний</span>}
              </button>
            ))}
          </div>

          <button className="primary-btn full" onClick={() => setStep(2)}>Продовжити →</button>
          <p className="hint" style={{ textAlign: 'center' }}>Це frontend-симуляція. Реального списання коштів не відбувається.</p>
        </div>
      )}

      {!isPaid && step === 2 && (
        <div className="payment-card">
          <span className="eyebrow">Підтвердження оплати</span>
          <h1>Перевірте деталі замовлення</h1>

          <div className="payment-methods">
            {paymentMethods.map((item) => (
              <button
                key={item.id}
                className={`payment-method ${method === item.id ? 'payment-method--active' : ''}`}
                onClick={() => setMethod(item.id)}
              >
                <span>{item.icon}</span>
                <strong>{item.label}</strong>
              </button>
            ))}
          </div>

          <div className="payment-lines">
            <div><span>Номер замовлення</span><strong>{orderNumber}</strong></div>
            <div><span>Курс</span><strong>{course.title}</strong></div>
            <div><span>Тариф</span><strong>{plan.label}</strong></div>
            <div><span>Включено</span><strong>{plan.desc}</strong></div>
            <div><span>Тривалість</span><strong>{course.duration}</strong></div>
            <div><span>Спосіб оплати</span><strong>{paymentMethod.icon} {paymentMethod.label}</strong></div>
            <div><span>Запис на курс</span><strong className={isEnrolled ? 'green-text' : 'orange-text'}>{isEnrolled ? '✅ Так' : '⏳ Буде виконано автоматично'}</strong></div>
            <div className="payment-total-line"><span>До сплати</span><strong className="payment-total">{finalPrice.toLocaleString('uk-UA')} ₴</strong></div>
          </div>

          <button className="primary-btn full" onClick={handlePay}>✅ Підтвердити оплату</button>
          <button className="secondary-btn full" onClick={() => setStep(1)}>← Змінити тариф</button>
          <p className="hint" style={{ textAlign: 'center' }}>У демо-версії оплата імітується без платіжного шлюзу.</p>
        </div>
      )}
    </div>
  );
}
