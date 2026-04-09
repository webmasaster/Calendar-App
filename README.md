# 📅 Modern Calendar App

A beautifully designed and interactive calendar application built with React.  
It supports note-taking, event management, drag-and-drop functionality, range selection, and dynamic themes.

---

## 🔗 Links

- 🚀 **Live Demo:** https://calendar-app-woad-five.vercel.app/  
- 💻 **GitHub Repository:** https://github.com/webmasaster/Calendar-App  

---

## ✨ Features

### 🗓️ Calendar Views
- Monthly calendar grid with smooth animations  
- Year overview (12-month quick selection)  
- Swipe & click navigation between months  
- Dynamic weekday alignment (Mon–Sun)

---

### 📝 Notes & Events System
- Add notes for:
  - Single date  
  - Date range  
  - Entire month  
- Edit and delete notes via modal interface  
- Mark notes as **events with emojis** (🎉, 📌, ✈️, etc.)  
- View saved notes in a structured panel  
- Notes persist using **localStorage**

---

### 🔁 Drag & Drop (Advanced Feature)
- Drag notes from the notes panel  
- Drop onto any date to reschedule  
- Automatically updates note date  
- Improves usability and workflow  

---

### 📆 Date Range Selection
- Click & drag across dates to create a range  
- Highlighted UI for selected range  
- Add notes specifically for selected ranges  

---

### 🎨 Dynamic Themes
- Month-based background images  
- Theme changes dynamically based on:
  - Current month  
  - Selected date  
- Smooth animated transitions  

---

### 🎉 Holidays (India Support)
- Built-in fallback holiday system  
- Highlights holidays directly on calendar  
- Displays holiday name 

---

### 📱 Responsive & Interactive UI
- Fully responsive design (mobile + desktop)  
- Smooth animations using **Framer Motion**  
- Clean modern UI with Tailwind CSS  
- Touch support for mobile devices  

---

### ⚙️ State Management
- Custom hook: `useCalendar`  
- Handles:
  - Month navigation  
  - Notes CRUD  
  - Drag interactions  
  - Theme logic  
  - Holiday data  

---

## 🏗️ Tech Stack

- **React (Vite)**
- **Tailwind CSS**
- **Framer Motion**
- **date-fns**
- **Lucide React Icons**

---

## 📂 Project Structure

```

├── src
│   ├── App.jsx
│   ├── components
│   │   ├── CalendarWidget.jsx
│   │   ├── DateGrid.jsx
│   │   ├── HeroSection.jsx
│   │   ├── MonthNavigation.jsx
│   │   ├── NotesPanel.jsx
│   │   └── useCalendar.jsx
│   └── utils
│       ├── dateUtils.js
│       └── themeUtils.js


```


---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/webmasaster/Calendar-App.git
```

### 2️⃣ Install dependencies
```bash
cd Calendar-App
npm install
```

### 3️⃣ Run the development server
```bash 
npm run dev

```

### 4️⃣ Open the app in your browser
```bash
http://localhost:5173
```

---


## 🧠 Design Decisions

### 🔧 Custom Hook (`useCalendar`)
Centralized logic → cleaner components and better scalability  

### 💾 LocalStorage Persistence
No backend needed → fast and simple  

### 🔁 Drag & Drop UX
More intuitive than traditional editing  

### 🗂️ Flexible Date Keys
- Single day → `yyyy-MM-dd`  
- Range → `start_end`  
- Month → `yyyy-MM`  

### 🎨 Dynamic Theme Engine
Enhances UI experience with visual changes  

---

## 👨‍💻 Author

**Nitin Kumar**