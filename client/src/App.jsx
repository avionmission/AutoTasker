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

  useEffect(() => {
    getTasks().then(data => setTasks(data.tasks || []));
  }, []);

  return (
    <div className="container">
      <h1>🧠 AutoTasker</h1>
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
