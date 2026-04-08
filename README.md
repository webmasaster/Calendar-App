# 📅 Wall Calendar App

A modern, interactive wall calendar built using **React + TailwindCSS + Framer Motion**.  
This project focuses on combining **aesthetic design with real-world usability**, inspired by physical wall calendars.

---

## ✨ Features

### 🖼️ Wall Calendar Aesthetic
- Large dynamic hero image for each month
- Image changes based on **month + day**
- Smooth transition animations (Framer Motion)
- Overlay, grain, and lighting effects for premium UI

---

### 📅 Day Range Selection
- Click & drag to select date ranges
- Visual states:
  - Start date
  - End date
  - Range highlight
- Fully works on:
  - Desktop (mouse)
  - Mobile (touch gestures)

---

### 📝 Notes System
- Add notes for:
  - Single day
  - Month
  - Selected date range
- Dynamic textarea resizing based on UI
- Clean UX with placeholders

---

### 🎉 Events System
- Add events with emojis
- Delete events easily
- Event indicators visible on calendar

---

### 🎯 Holiday Integration
- Built-in Indian public holidays
- Highlighted with:
  - Red color
  - Glow dot indicator
- Holiday banner inside notes panel

---

### 🎨 Dynamic Theme System
- Theme color changes per month
- Selected dates use theme color
- Today highlight uses theme ring
- Image + color sync for cohesive UI

---

### 🔄 Flip Animation
- Month transitions with 3D flip effect
- Smooth navigation experience

---

### 📱 Fully Responsive
- Desktop → Side-by-side layout
- Mobile → Stacked layout
- Notes panel moves below calendar on mobile
- Touch-friendly interactions

---

## 🧠 Tech Stack

- **React**
- **Tailwind CSS**
- **Framer Motion**
- **date-fns**

---

## 📂 Project Structure
src/
├── components/
│ ├── CalendarWidget.jsx
│ ├── HeroSection.jsx
│ ├── MonthNavigation.jsx
│ ├── DateGrid.jsx
│ ├── NotesPanel.jsx
│
├── hooks/
│ └── useCalendar.js
│
├── utils/
│ └── dateUtils.js


---

## 🚀 Getting Started

```bash
npm install
npm run dev