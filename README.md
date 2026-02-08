# יומן המשימות שלי

זו אפליקציית מנהל משימות פשוטה שנבנתה ב-React + Vite כפרויקט מסכם.
האפליקציה תומכת בהוספה/עריכה/סימון/מחיקה של משימות, סינון ותצוגת סטטוס, ושמירת נתונים ב-LocalStorage.

---

## הוראות ריצה מקומית

דרישות מקדימות: Node.js (מומלץ v18+) ו- npm.

בטרמינל, מתוך שורש הפרויקט הריצו:

```bash
npm install
npm run dev
```

השרת יפעל ב- `http://localhost:5173` (ברירת מחדל של Vite).

---

## תיאור קצר של האפליקציה

אפליקציה ברוח RTL (עברית) לניהול משימות עם המאפיינים הבאים:
- הוספת משימה חדשה (טקסט) עם תאריך יעד (`dueDate`), אחראי (`assignee`) וסטטוס (חדש/בתהליך/תקוע/הושלם)
- סימון משימות כהושלמו/לא הושלמו
- עריכת משימות קיימות (כולל שינוי תאריך/אחראי/סטטוס)
- מחיקה רכה (soft-delete) — משימה מסומנת כ"מוחקת" ונעלמת מהממשק אך נשמרת ב-LocalStorage
- סינון: הכל / פעיל / הושלם עם הדגשת הפילטר הנבחר
- מונה משימות פעילות ומשוואת סטטוס
- שמירה וטעינה מ-LocalStorage תחת המפתח `tasks_v1`

---

## מבנה קומפוננטות (והאחריות שלהן)

- `App.jsx`: רכיב השורש; מנהל state של המשימות, טעינה/שמירה ל-LocalStorage, מסנכרן לוגיקה של סטטוס/השלמה, ומעביר props ו-handlers לרכיבים התתיים.
- `components/TaskInput.jsx`: טופס הוספת משימות — מקבל טקסט, תאריך יעד, אחראי וסטטוס; מבצע ולידציה ומייצר משימה חדשה.
- `components/TaskList.jsx`: מציג את רשימת המשימות המסוננות; יוצר `TaskItem` לכל משימה.
- `components/TaskItem.jsx`: מציג פריט משימה יחיד; מספק toggle השלמה, עריכה inline של טקסט/דדליין/אחראי/סטטוס, והצגת מידע מטה (תאריך יצירה, זמן "באוויר", דגלים של פירוט).
- `components/FilterBar.jsx`: שולט בסינון (הכל / פעיל / הושלם) ומדגיש את הבחירה.
- `components/FooterStats.jsx`: מציג מונה משימות פעילות, סיכום לפי סטטוס וכפתור "נקה משימות שהושלמו" (soft-delete לקבוצת ההשלמות).

ניתן להרחיב את החלוקה לפי הצורך, אך לפחות ארבע הקומפוננטות המשמעותיות קיימות ומופרדות.

---

## מודל הנתונים

כל משימה מאוחסנת כאובייקט עם השדות:

```json
{
  "id": "<uuid>",
  "text": "תיאור המשימה",
  "completed": false,
  "deleted": false,
  "createdAt": "2026-02-03T...",
  "dueDate": "YYYY-MM-DD",
  "assignee": "שם אחראי",
  "status": "חדש|בתהליך|תקוע|הושלם",
  "completedAt": "<iso>" // אם הושלם
}
```

בעת טעינת האפליקציה מתבצעת נרמול (migration) כדי להבטיח שגרסאות ישנות יותר של משימות יקבלו שדות חסרים.

---

## דרכי שמירה ושחזור

- נתוני המשימות נשמרים ב-LocalStorage תחת המפתח `tasks_v1` כ-mapped JSON של המערך.
- ברגע שמשימה מסומנת כ"מחקה" (`deleted: true`) היא לא מוצגת, אך נשארת ב-LocalStorage (soft-delete).

---

## בדיקות (אם קיימות)

כרגע אין בדיקות יחידה מובנות בפרויקט. אפשר להוסיף Vitest + React Testing Library כנקודת בונוס.

---

## מגבלות או באגים ידועים

- התפריט של בחירת סטטוס פתוח בלחיצה; נדרשת שיפור בנגישות מקלדת (פתיחה/ניווט עם החצים ו-Escape לסגירה).
- אין בדיקות יחידה כלולות כברירת מחדל.
- מחיקה היא soft-delete בלבד — אם תרצו למחוק סופית, יש לנקות את ה-localStorage ידנית או להוסיף פונקציה להסרה פיזית.

---

## מה לכלול בהגשה ובמה להתכונן לביקורת

- ה-Repository צריך לכלול את כל קבצי המקור (`src/`) ואת `package.json`.
- בקובץ `README.md` זה — הסבר קצר, הוראות ריצה, רשימת קומפוננטות ותיאור קצר של כל אחת, רשימת מגבלות/באגים ידועים.
- בהגשה עצמית כדאי שתדעו להסביר בקצרה:
  - איפה נמצא ה-state הראשי ולמה הוא שם (`App.jsx`), ואיך זרימת האירועים עוברת מלמטה למעלה (child -> parent handlers).
  - איך מתבצע ה-persistence ל-LocalStorage ומדוע יש נרמול בטעינה.
  - החלטות סטטוס/השלמה (למשל: שינוי סטטוס ל'הושלם' מסמן `completed: true` וממלא `completedAt`).

---

## נקודות בונוס (מה כבר מוכן בפרויקט)

- כפתור `נקה משימות שהושלמו` שממלא את פונקציית הבונוס (soft-delete של המשימות המושלמות).
- יש מבנה קומפוננטות מסודר המאפשר הוספת בדיקות יחידה בקלות.

---

בהצלחה בהגשה! אם תרצה שאני אתאם עבורך גם קובץ `package.json` לדוגמא, או אוסיף תבניות בדיקה ל-Vitest — אשמח להמשיך ולעזור.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
