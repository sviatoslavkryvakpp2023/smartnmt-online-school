export const users = [
  { id: 1, name: "Іван Петренко", email: "ivan@gmail.com", role: "student", avatar: "ІП", group: "NMT_2026_A" },
  { id: 2, name: "Марія Коваль", email: "maria@gmail.com", role: "student", avatar: "МК", group: "NMT_2026_A" },
  { id: 3, name: "Олег Сидоренко", email: "oleg@gmail.com", role: "teacher", avatar: "ОС", subject: "Математика" },
  { id: 4, name: "Адміністратор", email: "admin@smartnmt.ua", role: "admin", avatar: "AD" }
];

export const courses = [
  { id: 1, title: "Математика НМТ 2026", subject: "Математика", teacher: "Олег Сидоренко", teacherId: 3, duration: "6 місяців", price: 4000, level: "Середній", rating: 4.9, students: 128, status: "active", description: "Повний курс з алгебри та геометрії з тестами, домашніми завданнями і симуляцією НМТ.", color: "blue" },
  { id: 2, title: "Українська мова НМТ", subject: "Українська мова", teacher: "Анна Мельник", teacherId: 5, duration: "5 місяців", price: 3500, level: "Базовий", rating: 4.8, students: 94, status: "active", description: "Підготовка з граматики, правопису, лексики та тестових завдань формату НМТ.", color: "violet" },
  { id: 3, title: "Історія України НМТ", subject: "Історія України", teacher: "Тарас Бойко", teacherId: 6, duration: "4 місяці", price: 3200, level: "Середній", rating: 4.7, students: 76, status: "active", description: "Дати, персоналії, карти, візуальні джерела та тренувальні тести за програмою НМТ.", color: "green" },
  { id: 4, title: "Англійська мова НМТ", subject: "Англійська мова", teacher: "Олена Гнатюк", teacherId: 7, duration: "5 місяців", price: 3700, level: "B1–B2", rating: 4.9, students: 83, status: "active", description: "Читання, лексика, граматика, типові помилки та практика тестів для НМТ.", color: "cyan" }
];

export const lessons = [
  { id: 1, courseId: 1, number: 1, title: "Лінійні рівняння", theory: "Лінійне рівняння має вигляд ax + b = 0. Головна мета — ізолювати змінну x та виконати однакові дії з обома частинами рівняння.", duration: "45 хв", tasks: [{ id: 101, type: "test", question: "Розв'яжіть 2x + 4 = 10", options: ["2", "3", "4", "5"], answer: "3" }, { id: 102, type: "open", question: "Поясніть алгоритм розв’язання лінійного рівняння." }] },
  { id: 2, courseId: 1, number: 2, title: "Квадратні рівняння", theory: "Квадратне рівняння має вигляд ax² + bx + c = 0. Для розв’язання часто використовують дискримінант D = b² - 4ac.", duration: "50 хв", tasks: [{ id: 201, type: "test", question: "Якщо D > 0, скільки коренів має рівняння?", options: ["0", "1", "2", "Безліч"], answer: "2" }] },
  { id: 3, courseId: 1, number: 3, title: "Геометрія: трикутники", theory: "Сума кутів трикутника дорівнює 180°. Для розв’язання задач важливо правильно визначити тип трикутника.", duration: "40 хв", tasks: [{ id: 301, type: "test", question: "Сума кутів трикутника дорівнює", options: ["90°", "180°", "270°", "360°"], answer: "180°" }] },
  { id: 4, courseId: 2, number: 1, title: "Правопис префіксів", theory: "У темі розглядаються правила написання префіксів з-, с-, роз-, без-, пре-, при-, прі-.", duration: "35 хв", tasks: [{ id: 401, type: "test", question: "Оберіть правильне написання", options: ["зказати", "сказати", "сказатиь", "зсказати"], answer: "сказати" }] },
  { id: 5, courseId: 3, number: 1, title: "Київська Русь", theory: "Розділ охоплює становлення держави, князів, хрещення Русі та культурний розвиток.", duration: "45 хв", tasks: [{ id: 501, type: "test", question: "Хрещення Русі відбулося у", options: ["882", "988", "1036", "1240"], answer: "988" }] },
  { id: 6, courseId: 4, number: 1, title: "Reading strategies", theory: "Потрібно навчитися швидко знаходити ключові слова, головну думку та відповідність між текстом і питанням.", duration: "40 хв", tasks: [{ id: 601, type: "test", question: "Skimming is used to", options: ["read every detail", "get the main idea", "translate words", "check grammar"], answer: "get the main idea" }] }
];

export const payments = [
  { id: 1, userId: 1, courseId: 1, status: "paid", amount: 4000, date: "2026-03-01" },
  { id: 2, userId: 1, courseId: 2, status: "pending", amount: 3500, date: "2026-03-15" }
];

export const notifications = [
  { id: 1, userId: 1, type: "lesson", message: "Новий урок з математики вже доступний.", status: "new" },
  { id: 2, userId: 1, type: "payment", message: "Нагадування: потрібно оплатити курс української мови.", status: "new" },
  { id: 3, userId: 1, type: "progress", message: "Ви виконали 33% курсу з математики. Продовжуйте!", status: "read" },
  { id: 4, userId: 3, type: "teacher", message: "Потрібно перевірити 2 відкриті відповіді з математики.", status: "new" }
];

export const groups = [
  { id: 1, name: "NMT_2026_A", curator: "Олег Сидоренко", students: [1, 2], courseIds: [1, 2] }
];

export const adminActions = [
  { id: 1, action: "Створено курс Математика НМТ 2026", actor: "Адміністратор", date: "2026-02-24" },
  { id: 2, action: "Оновлено статус оплати Івана Петренка", actor: "Менеджер", date: "2026-03-01" }
];
