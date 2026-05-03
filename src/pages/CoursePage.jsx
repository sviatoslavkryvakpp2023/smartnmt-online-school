import { Link, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { courses, lessons } from '../data/mockData.js';

export default function CoursePage({ currentUser, completedLessons, enrolledCourses, paidCourses, favoriteCourses, enrollCourse, toggleFavorite, showToast }) {
  const { courseId } = useParams();
  const course = courses.find((item) => item.id === Number(courseId));
  if (!course) {
    return (
      <div className="page">
        <BackButton />
        <div className="empty-state">Курс не знайдено</div>
      </div>
    );
  }

  const courseLessons = lessons.filter((lesson) => lesson.courseId === course.id);
  const completedCount = courseLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
  const progress = courseLessons.length ? (completedCount / courseLessons.length) * 100 : 0;
  const isStudent = currentUser?.role === 'student';
  const isTeacher = currentUser?.role === 'teacher';
  const isAdmin = currentUser?.role === 'admin';
  const isOwnTeacherCourse = isTeacher && course.teacherId === currentUser.id;
  const isEnrolled = isStudent && enrolledCourses.includes(course.id);
  const isPaid = isStudent && paidCourses.includes(course.id);
  const canOpenMaterials = isPaid || isOwnTeacherCourse || isAdmin;
  const isFavorite = favoriteCourses.includes(course.id);

  return (
    <div className="page">
      <BackButton />

      {/* Хлібні крихти */}
      <nav className="breadcrumbs">
        <Link to="/courses">Курси</Link>
        <span>/</span>
        <span>{course.title}</span>
      </nav>

      {/* Хедер курсу */}
      <section className={`course-hero course-hero-${course.color}`}>
        <div>
          <span className="eyebrow">{course.subject}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="course-info wide">
            <span>👨‍🏫 {course.teacher}</span>
            <span>⏱ {course.duration}</span>
            <span>⭐ {course.rating}</span>
            <span>👥 {course.students} учнів</span>
            <span>📊 {course.level}</span>
          </div>

          {/* Попередження про доступ */}
          {isStudent && !isPaid && (
            <div className="access-warning">
              🔒 {isEnrolled
                ? 'Матеріали відкриються після оплати курсу.'
                : 'Запишіться та оплатіть курс для доступу до матеріалів.'}
            </div>
          )}
          {isTeacher && !isOwnTeacherCourse && (
            <div className="access-warning">
              ℹ️ Ви переглядаєте курс іншого викладача. Редагування недоступне.
            </div>
          )}
          {isAdmin && (
            <div className="access-warning info-warning">
              ⚙️ Режим адміністратора — повний доступ до перегляду матеріалів.
            </div>
          )}
        </div>

        {/* Картка запису / оплати */}
        <aside className="buy-card">
          {isStudent ? (
            <>
              <strong className="price">{course.price.toLocaleString('uk-UA')} ₴</strong>
              <span className={isPaid ? 'status paid' : isEnrolled ? 'status pending' : 'status locked'}>
                {isPaid ? '✅ Доступ відкрито' : isEnrolled ? '⏳ Потрібна оплата' : '🔒 Ще не записано'}
              </span>

              {isPaid && <ProgressBar value={progress} />}
              {isPaid && (
                <p className="hint">{completedCount} з {courseLessons.length} уроків виконано</p>
              )}

              {isEnrolled ? (
                <Link className="primary-btn full" to={`/payment/${course.id}`}>
                  {isPaid ? '💳 Переглянути оплату' : '💳 Оплатити курс'}
                </Link>
              ) : (
                <button className="primary-btn full" onClick={() => enrollCourse(course.id)}>
                  📋 Записатися на курс
                </button>
              )}

              <button className="secondary-btn full" onClick={() => toggleFavorite(course.id)}>
                {isFavorite ? '★ Прибрати з обраного' : '☆ Додати в обране'}
              </button>
            </>
          ) : (
            <>
              <strong className="price">
                {isOwnTeacherCourse ? 'Мій курс' : isAdmin ? 'Адмін-перегляд' : 'Перегляд'}
              </strong>
              <span className={isOwnTeacherCourse || isAdmin ? 'status paid' : 'status locked'}>
                {isOwnTeacherCourse || isAdmin ? '✅ Матеріали доступні' : '🔒 Обмежений доступ'}
              </span>
              {(isOwnTeacherCourse || isAdmin) && (
                <div className="teacher-tools">
                  <button className="secondary-btn full" onClick={() => showToast?.('Відкрито режим редагування опису курсу')}>
                    ✏️ Редагувати опис
                  </button>
                  <button className="secondary-btn full" onClick={() => showToast?.('Форма додавання уроку буде доступна після підключення backend')}>
                    ➕ Додати урок
                  </button>
                  <Link className="secondary-btn full" to="/cabinet">
                    📋 Переглянути відповіді
                  </Link>
                </div>
              )}
            </>
          )}
        </aside>
      </section>

      {/* Програма курсу */}
      <section className="section">
        <div className="section-title row-title">
          <div>
            <span className="eyebrow">Програма</span>
            <h2>Уроки курсу</h2>
          </div>
          {isStudent && isPaid && (
            <p className="hint">{completedCount}/{courseLessons.length} виконано</p>
          )}
        </div>

        {courseLessons.length === 0 ? (
          <div className="empty-state">Уроки ще не додані до цього курсу.</div>
        ) : (
          <div className="lesson-list">
            {courseLessons.map((lesson, index) => {
              const prevLesson = courseLessons[index - 1];
              const sequenceLocked = isStudent && isPaid && index > 0 && !completedLessons.includes(prevLesson.id);
              const accessLocked = !canOpenMaterials;
              const locked = accessLocked || sequenceLocked;
              const done = completedLessons.includes(lesson.id) && isStudent;
              return (
                <div key={lesson.id} className={`lesson-row ${done ? 'done' : ''} ${locked ? 'locked-row' : ''}`}>
                  <div className="lesson-row-info">
                    <div className="lesson-number-circle">{done ? '✓' : lesson.number}</div>
                    <div>
                      <strong>{lesson.title}</strong>
                      <span>{lesson.duration} · {lesson.tasks.length} завд.</span>
                    </div>
                  </div>
                  <div className="lesson-row-action">
                    {locked ? (
                      <span className="status locked">
                        {accessLocked ? '🔒 Потрібна оплата' : '⏳ Спочатку попередній'}
                      </span>
                    ) : (
                      <Link
                        className="secondary-btn small"
                        to={`/lessons/${lesson.id}`}
                      >
                        {done && isStudent ? '🔁 Повторити' : isTeacher || isAdmin ? '👁 Переглянути' : '▶ Відкрити'}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
