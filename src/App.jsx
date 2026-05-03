import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import CoursePage from './pages/CoursePage.jsx';
import LessonPage from './pages/LessonPage.jsx';
import StudentCabinetPage from './pages/StudentCabinetPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { users, payments } from './data/mockData.js';

// Ключі для LocalStorage — версіоновані щоб уникнути конфліктів
const storageKeys = {
  user: 'smartnmt_user_v3',
  progress: 'smartnmt_progress_by_user_v3',
  payments: 'smartnmt_payments_by_user_v3',
  enrolled: 'smartnmt_enrolled_by_user_v3',
  submissions: 'smartnmt_submissions_by_user_v3',
  favorites: 'smartnmt_favorites_by_user_v3',
  notificationsRead: 'smartnmt_notifications_read_v3',
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

// Початкові оплачені курси (з mockData)
const initialPaid = payments.reduce((acc, payment) => {
  if (payment.status === 'paid') {
    acc[payment.userId] = [...(acc[payment.userId] || []), payment.courseId];
  }
  return acc;
}, {});

// Початково записані курси (включає і оплачені, і в очікуванні)
const initialEnrolled = payments.reduce((acc, payment) => {
  acc[payment.userId] = [
    ...new Set([...(acc[payment.userId] || []), payment.courseId]),
  ];
  return acc;
}, { 1: [1, 2], 2: [] });

function getUserArray(source, userId) {
  return source?.[userId] || [];
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => readStorage(storageKeys.user, users[0]));
  const [completedByUser, setCompletedByUser] = useState(() => readStorage(storageKeys.progress, { 1: [1] }));
  const [paidByUser, setPaidByUser] = useState(() => readStorage(storageKeys.payments, initialPaid));
  const [enrolledByUser, setEnrolledByUser] = useState(() => readStorage(storageKeys.enrolled, initialEnrolled));
  const [submissionsByUser, setSubmissionsByUser] = useState(() => readStorage(storageKeys.submissions, {}));
  const [favoritesByUser, setFavoritesByUser] = useState(() => readStorage(storageKeys.favorites, {}));
  const [readNotifications, setReadNotifications] = useState(() => readStorage(storageKeys.notificationsRead, []));
  const [toast, setToast] = useState('');

  const userId = currentUser?.id;
  const completedLessons = getUserArray(completedByUser, userId);
  const paidCourses = getUserArray(paidByUser, userId);
  const enrolledCourses = getUserArray(enrolledByUser, userId);
  const submissions = submissionsByUser?.[userId] || {};
  const favoriteCourses = getUserArray(favoritesByUser, userId);

  // Зберігаємо зміни у LocalStorage
  useEffect(() => localStorage.setItem(storageKeys.user, JSON.stringify(currentUser)), [currentUser]);
  useEffect(() => localStorage.setItem(storageKeys.progress, JSON.stringify(completedByUser)), [completedByUser]);
  useEffect(() => localStorage.setItem(storageKeys.payments, JSON.stringify(paidByUser)), [paidByUser]);
  useEffect(() => localStorage.setItem(storageKeys.enrolled, JSON.stringify(enrolledByUser)), [enrolledByUser]);
  useEffect(() => localStorage.setItem(storageKeys.submissions, JSON.stringify(submissionsByUser)), [submissionsByUser]);
  useEffect(() => localStorage.setItem(storageKeys.favorites, JSON.stringify(favoritesByUser)), [favoritesByUser]);
  useEffect(() => localStorage.setItem(storageKeys.notificationsRead, JSON.stringify(readNotifications)), [readNotifications]);

  // Toast-повідомлення
  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(''), 2600);
  }

  // Авторизація (імітація)
  function loginAs(userId) {
    const user = users.find((item) => item.id === Number(userId));
    if (user) {
      setCurrentUser(user);
      showToast(`Вхід виконано: ${user.name} (${user.role})`);
    }
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem(storageKeys.user);
    showToast('Ви вийшли з акаунта');
  }

  // Позначення уроку як виконаного / повернення
  function toggleLesson(lessonId) {
    if (!currentUser || currentUser.role !== 'student') {
      showToast('Позначати виконання може тільки учень');
      return;
    }
    setCompletedByUser((prev) => {
      const list = prev[currentUser.id] || [];
      const exists = list.includes(Number(lessonId));
      showToast(exists ? 'Урок повернено до режиму здачі' : '✅ Урок позначено як виконаний');
      return {
        ...prev,
        [currentUser.id]: exists
          ? list.filter((id) => id !== Number(lessonId))
          : [...list, Number(lessonId)],
      };
    });
  }

  // Запис на курс
  function enrollCourse(courseId) {
    if (!currentUser) {
      showToast('Спочатку увійдіть в акаунт учня');
      return;
    }
    if (currentUser.role !== 'student') {
      showToast('Запис на курс доступний тільки для учня');
      return;
    }
    setEnrolledByUser((prev) => {
      const list = prev[currentUser.id] || [];
      if (list.includes(Number(courseId))) return prev;
      return { ...prev, [currentUser.id]: [...list, Number(courseId)] };
    });
    showToast('📋 Курс додано до кабінету. Для доступу потрібно оплатити.');
  }

  // Оплата курсу (симуляція)
  function payCourse(courseId) {
    if (!currentUser || currentUser.role !== 'student') {
      showToast('Оплата доступна тільки для учня');
      return;
    }
    setPaidByUser((prev) => {
      const list = prev[currentUser.id] || [];
      return {
        ...prev,
        [currentUser.id]: list.includes(Number(courseId)) ? list : [...list, Number(courseId)],
      };
    });
    setEnrolledByUser((prev) => {
      const list = prev[currentUser.id] || [];
      return {
        ...prev,
        [currentUser.id]: list.includes(Number(courseId)) ? list : [...list, Number(courseId)],
      };
    });
    showToast('✅ Оплату успішно проведено! Матеріали курсу відкрито.');
  }

  // Збереження відкритої відповіді
  function saveSubmission(lessonId, text) {
    if (!currentUser || currentUser.role !== 'student') return;
    setSubmissionsByUser((prev) => ({
      ...prev,
      [currentUser.id]: {
        ...(prev[currentUser.id] || {}),
        [lessonId]: {
          text,
          status: text?.trim() ? 'submitted' : 'draft',
          updatedAt: new Date().toLocaleString('uk-UA'),
        },
      },
    }));
    showToast(text?.trim() ? '💾 Відповідь збережено та відправлено' : 'Чернетку очищено');
  }

  // Додавання/видалення з обраного
  function toggleFavorite(courseId) {
    if (!currentUser || currentUser.role !== 'student') {
      showToast('Обране доступне тільки для учня');
      return;
    }
    setFavoritesByUser((prev) => {
      const list = prev[currentUser.id] || [];
      const exists = list.includes(Number(courseId));
      showToast(exists ? 'Курс прибрано з обраного' : '★ Курс додано в обране');
      return {
        ...prev,
        [currentUser.id]: exists
          ? list.filter((id) => id !== Number(courseId))
          : [...list, Number(courseId)],
      };
    });
  }

  // Позначення сповіщення прочитаним
  function markNotificationRead(notificationId) {
    setReadNotifications((prev) =>
      prev.includes(notificationId) ? prev : [...prev, notificationId]
    );
  }


  const context = useMemo(
    () => ({
      currentUser,
      completedLessons,
      paidCourses,
      enrolledCourses,
      submissions,
      favoriteCourses,
      readNotifications,
      loginAs,
      logout,
      toggleLesson,
      enrollCourse,
      payCourse,
      saveSubmission,
      toggleFavorite,
      markNotificationRead,
      showToast,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, completedLessons, paidCourses, enrolledCourses, submissions, favoriteCourses, readNotifications]
  );

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Header {...context} />

      {/* Toast повідомлення */}
      {toast && <div className="toast">{toast}</div>}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage {...context} />} />
          <Route path="/login" element={<LoginPage {...context} />} />
          <Route path="/courses" element={<CoursesPage {...context} />} />
          <Route path="/courses/:courseId" element={<CoursePage {...context} />} />
          <Route path="/lessons/:lessonId" element={<LessonPage {...context} />} />
          <Route
            path="/cabinet"
            element={currentUser ? <StudentCabinetPage {...context} /> : <Navigate to="/login" />}
          />
          <Route path="/payment/:courseId" element={<PaymentPage {...context} />} />
          <Route
            path="/admin"
            element={
              currentUser?.role === 'admin'
                ? <AdminPage {...context} />
                : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
