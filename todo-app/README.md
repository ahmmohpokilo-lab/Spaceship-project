# 📝 To-Do List Application

A beautiful, fully-functional to-do list app with local storage persistence, built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

### Core Functionality
- ✅ **Add Tasks** - Create new tasks with a simple input field
- ✅ **Complete Tasks** - Mark tasks as done with a checkbox
- ✅ **Delete Tasks** - Remove tasks individually
- ✅ **Filter Tasks** - View All, Active, or Completed tasks
- ✅ **Clear Completed** - Remove all completed tasks at once
- ✅ **Live Statistics** - Total, Active, and Completed task counts

### Local Storage
- 💾 **Persistent Storage** - All tasks are saved to browser's local storage
- 🔄 **Auto-Save** - Changes are saved automatically
- 🚀 **Instant Load** - Tasks reload when you refresh or reopen

### User Experience
- 🎨 **Beautiful Design** - Modern gradient UI with smooth animations
- 📱 **Responsive** - Works perfectly on desktop, tablet, and mobile
- ⌨️ **Keyboard Support** - Press Enter to add tasks
- 🔒 **Security** - XSS protection with HTML escaping
- ⚡ **Fast** - No dependencies, pure vanilla JavaScript

## 🚀 Getting Started

### Installation
Simply open `index.html` in your web browser. That's it!

No server, no dependencies, no build process required.

### File Structure
```
todo-app/
├── index.html      # Main HTML structure
├── styles.css      # Styling and animations
├── script.js       # All functionality
└── README.md       # This file
```

## 💻 How to Use

1. **Add a Task**: Type in the input field and click "Add Task" or press Enter
2. **Complete a Task**: Click the checkbox next to a task
3. **Delete a Task**: Click the "Delete" button
4. **Filter Tasks**: Use the filter buttons to view All, Active, or Completed tasks
5. **Clear Completed**: Click "Clear Completed" to remove all finished tasks
6. **View Stats**: Check the statistics at the top for total, active, and completed counts

## 🛠️ Technical Details

### Local Storage
- **Key**: `todos_app_tasks`
- **Format**: JSON array of task objects
- **Capacity**: ~5-10MB per domain (varies by browser)

### Task Object Structure
```javascript
{
  id: 1234567890,           // Unique timestamp ID
  text: "Buy groceries",    // Task description (escaped)
  completed: false,         // Completion status
  createdAt: "Jan 1, 2:30 PM" // Creation date/time
}
```

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported (uses modern JavaScript)

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary: #667eea;        /* Main color */
    --secondary: #764ba2;      /* Gradient color */
    --success: #48bb78;        /* Checkbox color */
    --danger: #f56565;         /* Delete button color */
    /* ... more variables ... */
}
```

### Max Tasks
Default is unlimited. To add a limit, modify in `script.js`:
```javascript
if (tasks.length >= 50) {
    alert('Maximum 50 tasks allowed');
    return;
}
```

### Task Text Limit
Currently set to 100 characters. Change in `script.js`:
```javascript
if (text.length > 100) {  // Change this number
```

## 🔒 Security

- **XSS Protection**: All user input is escaped before displaying
- **Input Validation**: Empty tasks and excessive lengths are rejected
- **No External Scripts**: No third-party dependencies or CDNs

## 📊 Local Storage API

The app uses the Web Storage API:
```javascript
// Save data
localStorage.setItem(key, value);

// Load data
const value = localStorage.getItem(key);

// Remove all data (manual cleanup)
localStorage.removeItem(key);
```

To clear all tasks manually in browser console:
```javascript
localStorage.removeItem('todos_app_tasks');
location.reload();
```

## 🐛 Troubleshooting

**Tasks not saving?**
- Check if localStorage is enabled in your browser
- Try clearing browser cache
- Check browser console for errors (F12)

**Tasks disappear on refresh?**
- Verify localStorage is not disabled
- Check if you're in private/incognito mode (data may not persist)

**App looks broken?**
- Clear browser cache
- Try a different browser
- Open Developer Tools (F12) and check for errors

## 📈 Future Enhancements

Possible features for v2:
- 🏷️ Task categories/tags
- 🔔 Notifications and reminders
- 📅 Due dates
- 🎯 Task priorities
- 📤 Export/Import functionality
- ☁️ Cloud sync across devices
- 🌙 Dark mode toggle

## 📄 License

Free to use and modify for personal or commercial projects.

## 👨‍💻 Author

Created as a demonstration of vanilla JavaScript and local storage capabilities.

---

**Happy Task Management! 🚀**
