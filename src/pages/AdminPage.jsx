import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { courses, lessons, users, payments, adminActions } from '../data/mockData.js';

function StatCard({ value, label, icon, color }) {
  return (
    <div className="admin-stat-card" style={{ borderTopColor: color }}>
      <div className="admin-stat-icon">{icon}</div>
      <strong className="admin-stat-value" style={{ color }}>{value}</strong>
      <span className="admin-stat-label">{label}</span>
    </div>
  );
}

const roleLabels = {
  student: 'Учень',
  teacher: 'Викладач',
  admin: 'Адмін',
};

const statusLabels = {
  active: 'Активний',
  draft: 'Чернетка',
  paid: 'Оплачено',
  pending: 'Очікує',
  blocked: 'Заблоковано',
};

export default function AdminPage({ showToast }) {
  const [coursesList, setCoursesList] = useState(courses);
  const [usersList, setUsersList] = useState(users.map((user) => ({ ...user, blocked: false })));
  const [paymentsList, setPaymentsList] = useState(payments);
  const [logs, setLogs] = useState(adminActions);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || null);
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    subject: 'Математика',
    teacher: 'Олег Сидоренко',
    duration: '4 місяці',
    price: 3000,
    level: 'Базовий',
  });

  function addLog(action) {
    const logItem = {
      id: Date.now(),
      action,
      actor: 'Адміністратор',
      date: new Date().toLocaleString('uk-UA'),
    };
    setLogs((prev) => [logItem, ...prev]);
    showToast?.(action);
  }

  function handleAddCourse(event) {
    event.preventDefault();
    const title = newCourse.title.trim();
    if (!title) {
      showToast?.('Введіть назву курсу');
      return;
    }

    const course = {
      id: Date.now(),
      title,
      subject: newCourse.subject,
      teacher: newCourse.teacher,
      teacherId: 3,
      duration: newCourse.duration,
      price: Number(newCourse.price) || 0,
      level: newCourse.level,
      rating: 4.7,
      students: 0,
      status: 'draft',
      description: `Новий курс з предмету ${newCourse.subject}. Опис можна деталізувати під час редагування.`,
      color: 'blue',
    };

    setCoursesList((prev) => [course, ...prev]);
    setSelectedCourseId(course.id);
    setNewCourse((prev) => ({ ...prev, title: '' }));
    addLog(`Додано курс «${course.title}»`);
  }

  function handleDeleteCourse(courseId) {
    const course = coursesList.find((item) => item.id === courseId);
    if (!course) return;
    if (!window.confirm(`Видалити курс «${course.title}»?`)) return;

    setCoursesList((prev) => prev.filter((item) => item.id !== courseId));
    setPaymentsList((prev) => prev.filter((payment) => payment.courseId !== courseId));
    if (selectedCourseId === courseId) setSelectedCourseId(coursesList[0]?.id || null);
    addLog(`Видалено курс «${course.title}»`);
  }

  function toggleCourseStatus(courseId) {
    setCoursesList((prev) => prev.map((course) => {
      if (course.id !== courseId) return course;
      const nextStatus = course.status === 'active' ? 'draft' : 'active';
      addLog(`Курс «${course.title}» переведено у статус «${statusLabels[nextStatus]}»`);
      return { ...course, status: nextStatus };
    }));
  }

  function updateCoursePrice(courseId, value) {
    const price = Number(value);
    setCoursesList((prev) => prev.map((course) => (
      course.id === courseId ? { ...course, price: Number.isNaN(price) ? 0 : price } : course
    )));
  }

  function saveCourseChanges(courseId) {
    const course = coursesList.find((item) => item.id === courseId);
    if (course) addLog(`Збережено зміни курсу «${course.title}»`);
  }

  function changeUserRole(userId, role) {
    const user = usersList.find((item) => item.id === userId);
    setUsersList((prev) => prev.map((item) => (
      item.id === userId ? { ...item, role } : item
    )));
    addLog(`Користувачу «${user?.name}» змінено роль на «${roleLabels[role]}»`);
  }

  function toggleUserBlock(userId) {
    const user = usersList.find((item) => item.id === userId);
    setUsersList((prev) => prev.map((item) => (
      item.id === userId ? { ...item, blocked: !item.blocked } : item
    )));
    addLog(`${user?.blocked ? 'Розблоковано' : 'Заблоковано'} користувача «${user?.name}»`);
  }

  function confirmPayment(paymentId) {
    const payment = paymentsList.find((item) => item.id === paymentId);
    setPaymentsList((prev) => prev.map((item) => (
      item.id === paymentId ? { ...item, status: 'paid', date: new Date().toISOString().slice(0, 10) } : item
    )));
    addLog(`Підтверджено оплату #${paymentId} на суму ${payment?.amount?.toLocaleString('uk-UA')} ₴`);
  }

  function cancelPayment(paymentId) {
    const payment = paymentsList.find((item) => item.id === paymentId);
    setPaymentsList((prev) => prev.map((item) => (
      item.id === paymentId ? { ...item, status: 'pending' } : item
    )));
    addLog(`Оплату #${paymentId} повернено у статус очікування (${payment?.amount?.toLocaleString('uk-UA')} ₴)`);
  }

  const students = usersList.filter((u) => u.role === 'student');
  const teachers = usersList.filter((u) => u.role === 'teacher');
  const paidPayments = paymentsList.filter((p) => p.status === 'paid');
  const pendingPayments = paymentsList.filter((p) => p.status === 'pending');
  const revenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const activeCourses = coursesList.filter((c) => c.status === 'active');

  const courseStats = useMemo(() => coursesList.map((course) => ({
    ...course,
    lessonCount: lessons.filter((l) => l.courseId === course.id).length,
    paymentCount: paymentsList.filter((p) => p.courseId === course.id).length,
  })), [coursesList, paymentsList]);

  const selectedCourse = coursesList.find((course) => course.id === selectedCourseId) || coursesList[0];
  const selectedUser = usersList.find((user) => user.id === selectedUserId) || usersList[0];

  return (
    <div className="page">
      <div className="section-title">
        <span className="eyebrow">Адміністративна панель</span>
        <h1>Керування онлайн-школою</h1>
        <p>Адміністратор може керувати курсами, користувачами, оплатами та бачити журнал змін у системі.</p>
      </div>

      <div className="admin-stats-row">
        <StatCard value={activeCourses.length} label="Активні курси" icon="📚" color="#2563eb" />
        <StatCard value={students.length} label="Учні" icon="👩‍🎓" color="#7c3aed" />
        <StatCard value={teachers.length} label="Викладачі" icon="👨‍🏫" color="#059669" />
        <StatCard value={`${revenue.toLocaleString('uk-UA')} ₴`} label="Виторг" icon="💰" color="#f59e0b" />
        <StatCard value={paidPayments.length} label="Оплачено" icon="✅" color="#22c55e" />
        <StatCard value={pendingPayments.length} label="Очікують" icon="⏳" color="#f97316" />
      </div>

      <div className="admin-grid">
        <section className="panel full-panel">
          <div className="section-title row-title">
            <div>
              <span className="eyebrow">Каталог</span>
              <h2>Керування курсами</h2>
            </div>
            <Link className="text-link" to="/courses">Відкрити каталог →</Link>
          </div>

          <form className="admin-form" onSubmit={handleAddCourse}>
            <input
              value={newCourse.title}
              onChange={(event) => setNewCourse((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Назва нового курсу"
            />
            <select
              value={newCourse.subject}
              onChange={(event) => setNewCourse((prev) => ({ ...prev, subject: event.target.value }))}
            >
              <option>Математика</option>
              <option>Українська мова</option>
              <option>Історія України</option>
              <option>Англійська мова</option>
            </select>
            <input
              type="number"
              min="0"
              value={newCourse.price}
              onChange={(event) => setNewCourse((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="Ціна"
            />
            <button className="primary-btn small" type="submit">➕ Додати курс</button>
          </form>

          <div className="table-like admin-table">
            {courseStats.map((course) => (
              <div key={course.id} className={selectedCourse?.id === course.id ? 'selected-row' : ''}>
                <div className="admin-course-info">
                  <strong>{course.title}</strong>
                  <small>{course.subject} · {course.lessonCount} уроків · {course.students} учнів · {course.price.toLocaleString('uk-UA')} ₴</small>
                </div>
                <span className={course.status === 'active' ? 'status paid' : 'status pending'}>
                  {course.status === 'active' ? 'Активний' : 'Чернетка'}
                </span>
                <button className="table-btn" onClick={() => setSelectedCourseId(course.id)}>Редагувати</button>
                <button className="table-btn" onClick={() => toggleCourseStatus(course.id)}>
                  {course.status === 'active' ? 'У чернетку' : 'Опублікувати'}
                </button>
                <button className="table-btn danger-btn" onClick={() => handleDeleteCourse(course.id)}>Видалити</button>
              </div>
            ))}
          </div>
        </section>

        {selectedCourse && (
          <section className="panel">
            <span className="eyebrow">Редагування</span>
            <h2>{selectedCourse.title}</h2>
            <div className="admin-edit-stack">
              <label>
                Ціна курсу
                <input
                  type="number"
                  min="0"
                  value={selectedCourse.price}
                  onChange={(event) => updateCoursePrice(selectedCourse.id, event.target.value)}
                />
              </label>
              <label>
                Опис курсу
                <textarea
                  rows="4"
                  value={selectedCourse.description}
                  onChange={(event) => setCoursesList((prev) => prev.map((course) => (
                    course.id === selectedCourse.id ? { ...course, description: event.target.value } : course
                  )))}
                />
              </label>
              <button className="primary-btn full" onClick={() => saveCourseChanges(selectedCourse.id)}>💾 Зберегти зміни</button>
              <Link className="secondary-btn full" to={`/courses/${selectedCourse.id}`}>👁 Переглянути сторінку курсу</Link>
            </div>
          </section>
        )}

        <section className="panel">
          <div className="section-title row-title">
            <div>
              <span className="eyebrow">Фінанси</span>
              <h2>Оплати</h2>
            </div>
          </div>
          <div className="table-like admin-table compact-table">
            {paymentsList.map((payment) => {
              const user = usersList.find((u) => u.id === payment.userId);
              const course = coursesList.find((c) => c.id === payment.courseId);
              return (
                <div key={payment.id}>
                  <div className="admin-payment-info">
                    <strong>{user?.name || 'Користувача видалено'}</strong>
                    <small>{course?.subject || 'Курс видалено'} · {payment.amount.toLocaleString('uk-UA')} ₴ · {payment.date}</small>
                  </div>
                  <span className={payment.status === 'paid' ? 'status paid' : 'status pending'}>
                    {payment.status === 'paid' ? 'Оплачено' : 'Очікує'}
                  </span>
                  {payment.status === 'paid' ? (
                    <button className="table-btn warning-table-btn" onClick={() => cancelPayment(payment.id)}>Скасувати</button>
                  ) : (
                    <button className="table-btn success-btn" onClick={() => confirmPayment(payment.id)}>Підтвердити</button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="hint" style={{ marginTop: 12 }}>
            Очікують оплати: {pendingPayments.length} · Загальний виторг: {revenue.toLocaleString('uk-UA')} ₴
          </p>
        </section>

        <section className="panel">
          <div className="section-title row-title">
            <div>
              <span className="eyebrow">Акаунти</span>
              <h2>Користувачі</h2>
            </div>
          </div>
          <div className="table-like admin-table compact-table">
            {usersList.map((user) => (
              <div key={user.id} className={selectedUser?.id === user.id ? 'selected-row' : ''}>
                <div className="admin-user-info">
                  <span className="avatar small-avatar">{user.avatar}</span>
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                </div>
                <span className={
                  user.blocked ? 'status locked' :
                  user.role === 'admin' ? 'status locked' :
                  user.role === 'teacher' ? 'status pending' : 'status paid'
                }>
                  {user.blocked ? 'Заблоковано' : roleLabels[user.role]}
                </span>
                <button className="table-btn" onClick={() => setSelectedUserId(user.id)}>Профіль</button>
                {user.role !== 'admin' && (
                  <button className="table-btn warning-table-btn" onClick={() => toggleUserBlock(user.id)}>
                    {user.blocked ? 'Розблокувати' : 'Блокувати'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {selectedUser && (
          <section className="panel">
            <span className="eyebrow">Профіль користувача</span>
            <h2>{selectedUser.name}</h2>
            <div className="profile-admin-card">
              <span className="avatar big">{selectedUser.avatar}</span>
              <div>
                <strong>{selectedUser.email}</strong>
                <p className="hint">Поточна роль: {roleLabels[selectedUser.role]}</p>
              </div>
            </div>
            {selectedUser.role !== 'admin' && (
              <div className="admin-edit-stack">
                <label>
                  Змінити роль
                  <select
                    value={selectedUser.role}
                    onChange={(event) => changeUserRole(selectedUser.id, event.target.value)}
                  >
                    <option value="student">Учень</option>
                    <option value="teacher">Викладач</option>
                  </select>
                </label>
                <button className="secondary-btn full" onClick={() => toggleUserBlock(selectedUser.id)}>
                  {selectedUser.blocked ? '✅ Розблокувати акаунт' : '🚫 Заблокувати акаунт'}
                </button>
              </div>
            )}
          </section>
        )}

        <section className="panel full-panel">
          <div className="section-title">
            <span className="eyebrow">Контент</span>
            <h2>Наповнення курсів</h2>
          </div>
          <div className="admin-bars">
            {courseStats.map((course) => {
              const maxLessons = Math.max(...courseStats.map((c) => c.lessonCount), 1);
              const percent = Math.round((course.lessonCount / maxLessons) * 100);
              return (
                <div key={course.id} className="admin-bar-row">
                  <span className="admin-bar-label">{course.title}</span>
                  <div className="progress-line admin-progress">
                    <span style={{ width: `${percent}%` }} />
                  </div>
                  <strong className="admin-bar-count">{course.lessonCount} ур.</strong>
                  <span className={course.status === 'active' ? 'status paid small-status' : 'status pending small-status'}>
                    {course.status === 'active' ? 'Активний' : 'Чернетка'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel full-panel">
          <div className="section-title row-title">
            <div>
              <span className="eyebrow">Системний журнал</span>
              <h2>Журнал дій</h2>
            </div>
            <button className="ghost-btn small" onClick={() => setLogs([])}>Очистити журнал</button>
          </div>
          <div className="notice-list admin-log-list">
            {logs.length === 0 && <div className="notice">Журнал порожній.</div>}
            {logs.map((item) => (
              <div className="notice admin-log-item" key={item.id}>
                <div className="admin-log-icon">⚙️</div>
                <div>
                  <strong>{item.action}</strong>
                  <br />
                  <small className="hint">{item.actor} · {item.date}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
