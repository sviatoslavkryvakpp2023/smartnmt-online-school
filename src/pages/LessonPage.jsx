import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BackButton from '../components/BackButton.jsx';
import { courses, lessons } from '../data/mockData.js';

// ❗ ВИПРАВЛЕНО: всі useState хуки тепер ПЕРЕД будь-яким умовним return
// (порушення правил React Hooks — hooks не можна викликати після if/return)
export default function LessonPage({ currentUser, completedLessons, paidCourses, toggleLesson, showToast, submissions, saveSubmission }) {
  const { lessonId } = useParams();

  // ✅ Усі хуки оголошені безумовно на початку
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [openAnswer, setOpenAnswer] = useState('');

  const lesson = lessons.find((item) => item.id === Number(lessonId));

  // Рання перевірка — тільки ПІСЛЯ хуків
  if (!lesson) {
    return (
      <div className="page">
        <BackButton />
        <div className="empty-state">Урок не знайдено</div>
      </div>
    );
  }

  const course = courses.find((item) => item.id === lesson.courseId);
  const courseLessons = lessons.filter((item) => item.courseId === lesson.courseId);
  const currentIndex = courseLessons.findIndex((item) => item.id === lesson.id);
  const prevLesson = courseLessons[currentIndex - 1];
  const nextLesson = courseLessons[currentIndex + 1];
  const isStudent = currentUser?.role === 'student';
  const isTeacher = currentUser?.role === 'teacher';
  const isAdmin = currentUser?.role === 'admin';
  const isOwnTeacherCourse = isTeacher && course?.teacherId === currentUser.id;
  const isPaid = isStudent && paidCourses.includes(lesson.courseId);
  const prevDone = !prevLesson || completedLessons.includes(prevLesson.id);
  const canOpenLesson = (isPaid && prevDone) || isOwnTeacherCourse || isAdmin;
  const isDone = completedLessons.includes(lesson.id);
  const savedSubmission = submissions?.[lesson.id];

  useEffect(() => {
    setOpenAnswer(savedSubmission?.text || '');
  }, [lesson.id, savedSubmission?.text]);

  const testTasks = lesson.tasks.filter((task) => task.type === 'test');
  const openTasks = lesson.tasks.filter((task) => task.type === 'open');
  const correctCount = testTasks.filter((task) => answers[task.id] === task.answer).length;

  function checkTest() {
    setChecked(true);
    showToast(`Результат тесту: ${correctCount}/${testTasks.length}`);
  }

  // Доступ закритий
  if (!canOpenLesson) {
    return (
      <div className="page narrow">
        <BackButton />
        <div className="empty-state locked-page">
          <div className="locked-icon">🔒</div>
          <h2>Доступ до уроку закритий</h2>
          <p>
            {!isPaid
              ? 'Матеріали доступні тільки після оплати курсу.'
              : 'Спочатку потрібно виконати попередній урок.'}
          </p>
          <Link className="primary-btn" to={`/courses/${lesson.courseId}`}>
            Повернутися до курсу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <BackButton />

      {/* Хлібні крихти */}
      <nav className="breadcrumbs">
        <Link to="/courses">Курси</Link>
        <span>/</span>
        <Link to={`/courses/${course?.id}`}>{course?.title}</Link>
        <span>/</span>
        <span>{lesson.title}</span>
      </nav>

      {/* Картка уроку */}
      <section className="lesson-card">
        <div className="lesson-card-header">
          <span className="eyebrow">{course?.title}</span>
          <div className="lesson-badges">
            <span className="lesson-number-badge">Урок {lesson.number}</span>
            <span className="lesson-duration-badge">⏱ {lesson.duration}</span>
            {isDone && isStudent && <span className="status paid">✓ Виконано</span>}
          </div>
        </div>
        <h1>{lesson.title}</h1>
        <div className="lesson-theory">{lesson.theory}</div>

        {isStudent ? (
          <div className="lesson-actions">
            <button
              className={isDone ? 'warning-btn' : 'primary-btn'}
              onClick={() => toggleLesson(lesson.id)}
            >
              {isDone ? '↩ Повернути до режиму здачі' : '✓ Позначити як виконано'}
            </button>
            {nextLesson && !isDone && (
              <span className="hint">Позначте урок як виконаний, щоб перейти далі.</span>
            )}
            {nextLesson && isDone && (
              <Link className="secondary-btn" to={`/lessons/${nextLesson.id}`}>
                Наступний урок →
              </Link>
            )}
          </div>
        ) : (
          <div className="teacher-preview-box">
            👨‍🏫 Режим викладача: матеріали відкриті для перегляду й редагування, але прогрес і оплата не відображаються.
          </div>
        )}
      </section>

      {/* Завдання */}
      <section className="section">
        <div className="section-title">
          <span className="eyebrow">Практика</span>
          <h2>Завдання уроку</h2>
        </div>
        <div className="tasks-list">
          {lesson.tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-head">
                <strong>{task.type === 'test' ? '📝 Тестове питання' : '✏️ Відкрита відповідь'}</strong>
                <span className="task-id">#{task.id}</span>
              </div>
              <p>{task.question}</p>
              {task.type === 'test' ? (
                <div className="options-list">
                  {task.options.map((option) => (
                    <label
                      key={option}
                      className={[
                        'option',
                        answers[task.id] === option ? 'selected' : '',
                        checked && option === task.answer ? 'correct' : '',
                        checked && answers[task.id] === option && option !== task.answer ? 'wrong' : '',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name={`task-${task.id}`}
                        value={option}
                        checked={answers[task.id] === option}
                        onChange={() => setAnswers((prev) => ({ ...prev, [task.id]: option }))}
                        disabled={!isStudent || checked}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  placeholder="Введіть відповідь учня..."
                  rows="4"
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  disabled={!isStudent}
                />
              )}
            </div>
          ))}
        </div>

        {/* Кнопка перевірки тесту */}
        {isStudent && testTasks.length > 0 && (
          <div className="test-result-box">
            <button className="primary-btn" onClick={checkTest} disabled={checked}>
              {checked ? `✓ Перевірено` : 'Перевірити тест'}
            </button>
            {checked && (
              <div className="test-score">
                <strong>Результат: {correctCount}/{testTasks.length}</strong>
                <span className={correctCount === testTasks.length ? 'status paid' : correctCount > 0 ? 'status pending' : 'status locked'}>
                  {correctCount === testTasks.length ? 'Відмінно!' : correctCount > 0 ? 'Частково вірно' : 'Спробуйте ще'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Відкрита відповідь — збереження */}
        {isStudent && openTasks.length > 0 && (
          <div className="submission-box">
            <div className="submission-status">
              <strong>Статус відповіді:</strong>
              <span className={savedSubmission?.status === 'submitted' ? 'status paid' : 'status pending'}>
                {savedSubmission?.status === 'submitted' ? 'Відправлено' : 'Чернетка / не здано'}
              </span>
            </div>
            {savedSubmission?.updatedAt && (
              <small className="hint">Останнє оновлення: {savedSubmission.updatedAt}</small>
            )}
            <div className="lesson-actions">
              <button
                className="primary-btn"
                onClick={() => saveSubmission(lesson.id, openAnswer)}
              >
                💾 Зберегти / здати відповідь
              </button>
              <button
                className="warning-btn"
                onClick={() => {
                  setOpenAnswer('');
                  saveSubmission(lesson.id, '');
                }}
              >
                ↩ Очистити
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Навігація між уроками */}
      <div className="lesson-nav-footer">
        {prevLesson ? (
          <Link className="secondary-btn small" to={`/lessons/${prevLesson.id}`}>
            ← {prevLesson.title}
          </Link>
        ) : (
          <span />
        )}
        <Link className="secondary-btn small" to={`/courses/${course?.id}`}>
          📋 Програма курсу
        </Link>
        {nextLesson && isDone ? (
          <Link className="primary-btn small" to={`/lessons/${nextLesson.id}`}>
            {nextLesson.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
