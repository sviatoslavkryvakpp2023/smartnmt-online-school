import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar.jsx';
import { courses, lessons, notifications, users, groups } from '../data/mockData.js';

function StudentCabinet({ currentUser, completedLessons, enrolledCourses, paidCourses, favoriteCourses, readNotifications, markNotificationRead }) {
  const myCourses = courses.filter((course) => enrolledCourses.includes(course.id));
  const favoriteList = courses.filter((course) => favoriteCourses.includes(course.id));
  const userNotifications = notifications.filter((item) => item.userId === currentUser?.id);
  const unreadCount = userNotifications.filter((n) => !readNotifications.includes(n.id) && n.status !== 'read').length;

  // Наступні доступні уроки (неоплачені курси — без уроків)
  const nextLessons = myCourses
    .filter((course) => paidCourses.includes(course.id))
    .flatMap((course) =>
      lessons
        .filter((lesson) => lesson.courseId === course.id)
        .map((lesson) => ({ ...lesson, courseTitle: course.title, courseId: course.id }))
    )
    .filter((lesson) => !completedLessons.includes(lesson.id))
    .slice(0, 4);

  return (
    <div className="dashboard-grid">
      {/* Мої курси */}
      <section className="panel large-panel">
        <div className="section-title row-title">
          <div><span className="eyebrow">Навчання</span><h2>Мої курси</h2></div>
          <Link to="/courses" className="text-link">Додати курс →</Link>
        </div>
        <div className="cabinet-course-list">
          {myCourses.map((course) => {
            const courseLessons = lessons.filter((lesson) => lesson.courseId === course.id);
            const completed = courseLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
            const progress = paidCourses.includes(course.id) && courseLessons.length
              ? (completed / courseLessons.length) * 100
              : 0;
            const isPaid = paidCourses.includes(course.id);
            return (
              <div key={course.id} className="cabinet-course">
                <div className="cabinet-course-header">
                  <strong>{course.title}</strong>
                  <span>{course.teacher} · {course.subject}</span>
                </div>
                {isPaid
                  ? <ProgressBar value={progress} />
                  : <div className="access-warning small-warning">🔒 Матеріали закриті до оплати.</div>
                }
                <div className="cabinet-actions">
                  <span className={isPaid ? 'status paid' : 'status pending'}>
                    {isPaid ? '✅ Оплачено' : '⏳ Очікує оплату'}
                  </span>
                  {isPaid && (
                    <span className="hint">{completed}/{courseLessons.length} уроків</span>
                  )}
                  <Link
                    className="secondary-btn small"
                    to={isPaid ? `/courses/${course.id}` : `/payment/${course.id}`}
                  >
                    {isPaid ? 'Відкрити' : 'Оплатити'}
                  </Link>
                </div>
              </div>
            );
          })}
          {!myCourses.length && (
            <div className="empty-state">
              <p>Ви ще не записані на курси.</p>
              <Link to="/courses" className="primary-btn small">Переглянути курси</Link>
            </div>
          )}
        </div>
      </section>

      {/* Сповіщення */}
      <aside className="panel">
        <div className="section-title row-title">
          <div>
            <span className="eyebrow">Сповіщення</span>
            <h2>🔔 Новини {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}</h2>
          </div>
        </div>
        <div className="notice-list">
          {userNotifications.length === 0 && (
            <div className="notice">Немає сповіщень.</div>
          )}
          {userNotifications.map((notice) => {
            const read = readNotifications.includes(notice.id) || notice.status === 'read';
            return (
              <button
                className={`notice notice-button ${read ? 'read' : 'new'}`}
                key={notice.id}
                onClick={() => markNotificationRead(notice.id)}
              >
                <span className="notice-msg">{notice.message}</span>
                <small>{read ? '✓ прочитано' : '• натисніть для позначення'}</small>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Найближчі уроки */}
      <aside className="panel">
        <span className="eyebrow">Навчальний план</span>
        <h2>📅 Наступні уроки</h2>
        <div className="notice-list">
          {nextLessons.map((lesson) => (
            <Link className="notice link-notice" key={lesson.id} to={`/lessons/${lesson.id}`}>
              <strong>{lesson.title}</strong>
              <small>{lesson.courseTitle} · {lesson.duration}</small>
            </Link>
          ))}
          {!nextLessons.length && (
            <div className="notice">
              {myCourses.filter(c => paidCourses.includes(c.id)).length === 0
                ? 'Оплатіть курс для доступу до уроків.'
                : 'Усі уроки з оплачених курсів виконано! 🎉'}
            </div>
          )}
        </div>
      </aside>

      {/* Обране */}
      <aside className="panel full-panel">
        <span className="eyebrow">Обране</span>
        <h2>★ Курси, які зацікавили</h2>
        <div className="mini-grid">
          {favoriteList.map((course) => (
            <Link key={course.id} className="mini-card" to={`/courses/${course.id}`}>
              <strong>{course.title}</strong>
              <span>{course.price.toLocaleString('uk-UA')} ₴</span>
            </Link>
          ))}
          {!favoriteList.length && (
            <div className="notice">
              Поки немає курсів в обраному. Натисніть ☆ на картці курсу.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function TeacherCabinet({ currentUser, readNotifications, markNotificationRead }) {
  const myCourses = courses.filter((course) => course.teacherId === currentUser.id);
  const teacherNotifications = notifications.filter((item) => item.userId === currentUser.id);
  const students = users.filter((user) => user.role === 'student');

  return (
    <div className="dashboard-grid">
      <section className="panel large-panel">
        <div className="section-title row-title">
          <div><span className="eyebrow">Викладач</span><h2>Мої навчальні курси</h2></div>
          <button className="secondary-btn small">➕ Додати матеріал</button>
        </div>
        <div className="cabinet-course-list">
          {myCourses.map((course) => {
            const courseLessons = lessons.filter((l) => l.courseId === course.id);
            return (
              <div key={course.id} className="cabinet-course">
                <div className="cabinet-course-header">
                  <strong>{course.title}</strong>
                  <span>{course.subject} · {course.students} учнів</span>
                </div>
                <div className="teacher-metrics">
                  <span>📖 Уроків: <strong>{courseLessons.length}</strong></span>
                  <span>📝 Відповідей на перевірку: <strong>2</strong></span>
                  <span className={course.status === 'active' ? 'status paid' : 'status pending'}>
                    {course.status === 'active' ? 'Активний' : 'Чернетка'}
                  </span>
                </div>
                <div className="cabinet-actions">
                  <Link className="secondary-btn small" to={`/courses/${course.id}`}>Переглянути курс</Link>
                  <button className="secondary-btn small">📋 Перевірити ДЗ</button>
                </div>
              </div>
            );
          })}
          {!myCourses.length && (
            <div className="empty-state">У вас ще немає курсів.</div>
          )}
        </div>
      </section>

      <aside className="panel">
        <span className="eyebrow">Групи</span>
        <h2>👥 Мої групи</h2>
        <div className="notice-list">
          {groups.map((group) => (
            <div className="notice" key={group.id}>
              <strong>{group.name}</strong>
              <br />
              <small>{group.students.length} учнів · куратор: {group.curator}</small>
            </div>
          ))}
        </div>
      </aside>

      <aside className="panel">
        <span className="eyebrow">Сповіщення</span>
        <h2>🔔 Для викладача</h2>
        <div className="notice-list">
          {teacherNotifications.length === 0 && (
            <div className="notice">Немає сповіщень.</div>
          )}
          {teacherNotifications.map((notice) => {
            const read = readNotifications.includes(notice.id) || notice.status === 'read';
            return (
              <button
                className={`notice notice-button ${read ? 'read' : 'new'}`}
                key={notice.id}
                onClick={() => markNotificationRead(notice.id)}
              >
                <span className="notice-msg">{notice.message}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <aside className="panel full-panel">
        <span className="eyebrow">Журнал</span>
        <h2>📋 Учні групи</h2>
        <div className="table-like">
          {students.map((student) => (
            <div key={student.id}>
              <div className="admin-user-info">
                <span className="avatar small-avatar">{student.avatar}</span>
                <div>
                  <span>{student.name}</span>
                  <small className="hint">{student.group || 'Без групи'}</small>
                </div>
              </div>
              <strong className="hint">{student.group || '—'}</strong>
              <button className="table-btn">Відкрити журнал</button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function AdminCabinetLink() {
  return (
    <div className="dashboard-grid">
      <section className="panel large-panel">
        <span className="eyebrow">Адміністратор</span>
        <h2>⚙️ Керування платформою</h2>
        <p className="hint">Адміністратор має окрему панель для статистики курсів, оплат, користувачів та дій у системі.</p>
        <br />
        <Link className="primary-btn" to="/admin">Відкрити адмін-панель</Link>
      </section>
    </div>
  );
}

export default function StudentCabinetPage(props) {
  const { currentUser } = props;
  return (
    <div className="page">
      {/* Профіль */}
      <section className="dashboard-hero">
        <div className="avatar xl">{currentUser.avatar}</div>
        <div>
          <span className="eyebrow">Особистий кабінет</span>
          <h1>{currentUser.name}</h1>
          <p>
            {currentUser.email} · роль: <strong>{currentUser.role}</strong>
            {currentUser.group ? ` · група: ${currentUser.group}` : ''}
          </p>
        </div>
        <div className="dashboard-hero-actions">
          <Link className="primary-btn small" to="/courses">📚 Перейти до курсів</Link>
          {currentUser.role === 'student' && <a className="secondary-btn small" href="#my-courses">▶ Продовжити навчання</a>}
          {currentUser.role === 'teacher' && <a className="secondary-btn small" href="#teacher-courses">👨‍🏫 Мої курси</a>}
          {currentUser.role === 'admin' && <Link className="secondary-btn small" to="/admin">⚙️ Адмін-панель</Link>}
        </div>
      </section>

      {/* Кабінет за роллю */}
      {currentUser.role === 'student' && <StudentCabinet {...props} />}
      {currentUser.role === 'teacher' && <TeacherCabinet {...props} />}
      {currentUser.role === 'admin' && <AdminCabinetLink />}
    </div>
  );
}
