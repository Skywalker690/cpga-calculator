# 🎓 CGPA & Attendance Tracker

An all-in-one **CGPA Calculator + Attendance Tracker** built with **React** and **Vite**. Calculate your **SGPA/CGPA** and monitor **attendance** in real time with a clean, modern, responsive interface.

🔗 **Live Demo:** [https://skywalker690.github.io/CGPA\_Calculator/](https://skywalker690.github.io/CGPA_Calculator/)

---

## ✨ Features

### **CGPA Calculator**

* Input subjects with **credits** and **grades**
* **Live calculation** of SGPA and CGPA (instant updates)
* Dynamic grade-to-point conversion
* **Easy data management** - subjects configured in a single file
* **Component-based architecture** for maintainability

### **Attendance Tracker**

* Track **total** and **attended** classes per subject
* **Instant attendance percentage** calculation
* **Smart calculation** of extra classes needed
* Customizable target attendance percentage
* **Mobile-friendly & fully responsive** design

---

## 🚀 Quick Start

### **Development**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Adding/Editing Subjects**

All semester and subject data is centralized in `src/data/semesterData.js`. Simply edit this file to:
- Add new semesters
- Modify subject names
- Change default credits
- Update grade mappings

Example:
```javascript
{
  name: "New Subject Name",
  credit: 4,
  defaultGrade: 'F'
}
```

---

## 📊 Grade-to-Point Table

| Grade | Points |
| ----- | ------ |
| S     | 10.0   |
| A+    | 9.0    |
| A     | 8.5    |
| B+    | 8.0    |
| B     | 7.5    |
| C+    | 7.0    |
| C     | 6.5    |
| D     | 6.0    |
| P     | 5.5    |

---

## 🛠 Tech Stack

* **React 19** – UI Components
* **Vite** – Fast build tool and dev server
* **CSS3** – Modern styling with responsive design
* **JavaScript (ES6+)** – Logic & interactivity

---

## 📁 Project Structure

```
src/
├── components/         # React components
│   ├── GradeTable.jsx  # Grade reference table
│   ├── SemesterTable.jsx # Individual semester calculator
│   └── Attendance.jsx  # Attendance tracker
├── data/
│   └── semesterData.js # Centralized subject configuration
├── App.jsx            # Main application component
└── index.css          # Global styles
```

---

## 🎨 Design Highlights

* **Dark theme** - Easy on the eyes
* **Responsive design** - Works on all devices (mobile, tablet, desktop)
* **Card-based mobile layout** - Enhanced mobile UX
* **Clean UI** - Intuitive and user-friendly
* **Component reusability** - Easy to maintain and extend

---

## 🔮 Future Enhancements

* Light/Dark Mode toggle
* PDF Export for grades & attendance
* Local storage support for saving data
* More customizable grading systems
* Analytics and insights

---

## 🤝 Contributing

Want to improve this project? **Fork, modify, and PR!**

---

## 📝 License

See [LICENSE](LICENSE) file for details.
