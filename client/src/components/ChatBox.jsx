import { useState } from "react";
import { addTask, getTasks } from "../api";

export default function ChatBox({ setTasks }) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;
    
    try {
      await addTask(message);
      const data = await getTasks();
      setTasks(data.tasks || []);
      setMessage("");
      
      // Poll for updates every 2 seconds for up to 30 seconds to catch AI categorization
      let pollCount = 0;
      const maxPolls = 15; // 30 seconds total
      
      const pollForUpdates = async () => {
        if (pollCount < maxPolls) {
          setTimeout(async () => {
            try {
              const updatedData = await getTasks();
              setTasks(updatedData.tasks || []);
              pollCount++;
              
              // Check if there are still "Processing..." tasks
              const hasProcessingTasks = updatedData.tasks.some(task => task.category === "Processing...");
              if (hasProcessingTasks) {
                pollForUpdates();
              }
            } catch (error) {
              console.error('Error polling for updates:', error);
            }
          }, 2000);
        }
      };
      
      pollForUpdates();
      
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Error adding task. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-box">
      <input 
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Add a task (e.g., Fix login bug)"
      />
      <button onClick={handleSend}>
        Add
      </button>
    </div>
  );
}
