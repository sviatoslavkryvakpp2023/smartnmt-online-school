export function calculateProgress(completedLessons, totalLessons) {
  if (totalLessons <= 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}

export function isCoursePaid(payments, userId, courseId) {
  return payments.some(
    (payment) =>
      payment.userId === userId &&
      payment.courseId === courseId &&
      payment.status === 'paid'
  );
}

export function canAccessLesson({ isPaid, role, lessonIndex, completedLessons }) {
  if (role === 'teacher' || role === 'admin') return true;
  if (!isPaid) return false;
  if (lessonIndex === 0) return true;
  return completedLessons >= lessonIndex;
}

export function calculateRevenue(payments) {
  return payments
    .filter((payment) => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
}

export function filterCourses(courses, searchText, subject) {
  return courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchText.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchText.toLowerCase());

    const matchesSubject =
      subject === 'all' || course.subject === subject;

    return matchesSearch && matchesSubject;
  });
}

export function getRoleLabel(role) {
  const labels = {
    student: 'Учень',
    teacher: 'Викладач',
    admin: 'Адміністратор'
  };

  return labels[role] || 'Невідома роль';
}

export function getPaymentStatusLabel(status) {
  if (status === 'paid') return 'Оплачено';
  if (status === 'pending') return 'Очікує оплати';
  return 'Невідомий статус';
}