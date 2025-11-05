import "./App.css";
import { useState, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import KanbanBoard from "./components/KanbanBoard";
import SummaryModal from "./components/SummaryModal";
import { getTasks } from "./api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    getTasks().then(data => setTasks(data.tasks || []));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🧠 AutoTasker</h1>
        <button 
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>
      <ChatBox setTasks={setTasks} />
      <KanbanBoard tasks={tasks} setTasks={setTasks} />
      <button 
        onClick={() => setShowModal(true)} 
        className="generate-btn">
        Generate Summary
      </button>
      <SummaryModal 
        show={showModal} 
        setShow={setShowModal} 
        summary={summary} 
        setSummary={setSummary} />
    </div>
  );
}
