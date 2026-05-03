import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';
import { lessons } from '../data/mockData.js';

export default function CourseCard({ course, currentUser, completedLessons = [], enrolledCourses = [], paidCourses = [], favoriteCourses = [], toggleFavorite }) {
  const isStudent = currentUser?.role === 'student';
  const isTeacher = currentUser?.role === 'teacher';
  const isOwnTeacherCourse = isTeacher && course.teacherId === currentUser.id;
  const courseLessons = lessons.filter((lesson) => lesson.courseId === course.id);
  const completed = courseLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
  const progress = courseLessons.length ? (completed / courseLessons.length) * 100 : 0;
  const isEnrolled = enrolledCourses.includes(course.id);
  const isPaid = paidCourses.includes(course.id);
  const isFavorite = favoriteCourses.includes(course.id);

  return (
    <article className={`course-card ${course.color}`}>
      <div className="course-badges">
        <span>{course.subject}</span>
        <span>{course.level}</span>
        {course.status === 'draft' && <span className="draft-badge">Чернетка</span>}
      </div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="course-info">
        <span>👨‍🏫 {course.teacher}</span>
        <span>⏱ {course.duration}</span>
        <span>⭐ {course.rating}</span>
        <span>👥 {course.students} учнів</span>
      </div>
      {isStudent && isEnrolled && <ProgressBar value={isPaid ? progress : 0} />}
      <div className="card-footer">
        <strong>{course.price} грн</strong>
        {isStudent ? (
          <span className={isPaid ? 'status paid' : isEnrolled ? 'status pending' : 'status locked'}>
            {isPaid ? 'Оплачено' : isEnrolled ? 'Очікує оплату' : 'Немає доступу'}
          </span>
        ) : isOwnTeacherCourse ? (
          <span className="status paid">Мій курс</span>
        ) : (
          <span className="status locked">Перегляд</span>
        )}
      </div>
      <div className="card-actions-row">
        {isStudent && <button className="ghost-btn small" onClick={() => toggleFavorite(course.id)}>{isFavorite ? '★ В обраному' : '☆ Обране'}</button>}
        <Link className="primary-btn full" to={`/courses/${course.id}`}>Детальніше</Link>
      </div>
    </article>
  );
}
