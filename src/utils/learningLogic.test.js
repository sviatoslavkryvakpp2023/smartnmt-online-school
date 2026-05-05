import { describe, expect, it } from 'vitest';
import {
  calculateProgress,
  isCoursePaid,
  canAccessLesson,
  calculateRevenue,
  filterCourses,
  getRoleLabel,
  getPaymentStatusLabel
} from './learningLogic';

describe('SmartNMT business logic', () => {
  it('calculates course progress correctly', () => {
    expect(calculateProgress(3, 6)).toBe(50);
  });

  it('returns 0 progress when course has no lessons', () => {
    expect(calculateProgress(0, 0)).toBe(0);
  });

  it('checks whether course is paid by user', () => {
    const payments = [
      { userId: 1, courseId: 101, status: 'paid', amount: 2500 },
      { userId: 2, courseId: 102, status: 'pending', amount: 2200 }
    ];

    expect(isCoursePaid(payments, 1, 101)).toBe(true);
    expect(isCoursePaid(payments, 2, 102)).toBe(false);
  });

  it('blocks student access to unpaid lesson', () => {
    const result = canAccessLesson({
      isPaid: false,
      role: 'student',
      lessonIndex: 0,
      completedLessons: 0
    });

    expect(result).toBe(false);
  });

  it('allows teacher to access course materials without payment', () => {
    const result = canAccessLesson({
      isPaid: false,
      role: 'teacher',
      lessonIndex: 3,
      completedLessons: 0
    });

    expect(result).toBe(true);
  });

  it('calculates total revenue only from paid payments', () => {
    const payments = [
      { status: 'paid', amount: 2500 },
      { status: 'pending', amount: 1500 },
      { status: 'paid', amount: 3000 }
    ];

    expect(calculateRevenue(payments)).toBe(5500);
  });

  it('filters courses by search text and subject', () => {
    const courses = [
      { title: 'Математика НМТ', subject: 'Математика' },
      { title: 'Українська мова НМТ', subject: 'Українська мова' },
      { title: 'Історія України', subject: 'Історія України' }
    ];

    const result = filterCourses(courses, 'математика', 'Математика');

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Математика НМТ');
  });

  it('returns correct user role label', () => {
    expect(getRoleLabel('student')).toBe('Учень');
    expect(getRoleLabel('teacher')).toBe('Викладач');
    expect(getRoleLabel('admin')).toBe('Адміністратор');
  });

  it('returns correct payment status label', () => {
    expect(getPaymentStatusLabel('paid')).toBe('Оплачено');
    expect(getPaymentStatusLabel('pending')).toBe('Очікує оплати');
  });
});