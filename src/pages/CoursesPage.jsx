import { useMemo, useState } from 'react';
import CourseCard from '../components/CourseCard.jsx';
import { courses } from '../data/mockData.js';

const subjects = ['Усі', ...new Set(courses.map((course) => course.subject))];

export default function CoursesPage(props) {
  const [subject, setSubject] = useState('Усі');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => subject === 'Усі' || course.subject === subject)
      .filter((course) => `${course.title} ${course.description} ${course.teacher}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => sort === 'price' ? a.price - b.price : b.students - a.students);
  }, [subject, search, sort]);

  return (
    <div className="page">
      <div className="section-title"><span className="eyebrow">Каталог</span><h1>Курси для підготовки до НМТ</h1><p>Знайдіть потрібний курс за предметом, викладачем або назвою.</p></div>
      <div className="toolbar">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Пошук курсу..." />
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>{subjects.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="popular">За популярністю</option><option value="price">Спочатку дешевші</option></select>
      </div>
      <div className="cards-grid">
        {filteredCourses.map((course) => <CourseCard key={course.id} course={course} {...props} />)}
      </div>
      {!filteredCourses.length && <div className="empty-state">Курсів за таким запитом не знайдено.</div>}
    </div>
  );
}
