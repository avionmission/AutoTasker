import { toggleTask, deleteTask, getTasks, updateTaskCategory } from "../api";
import { useState } from "react";

export default function KanbanBoard({ tasks, setTasks }) {
    const [draggedTask, setDraggedTask] = useState(null);
    const [dragOverCategory, setDragOverCategory] = useState(null);
    
    // Ensure all tasks have a category
    const tasksWithCategory = tasks.map(t => ({
      ...t,
      category: t.category || "Uncategorized"
    }));
    
    // Filter out empty categories
    const categories = [...new Set(tasksWithCategory.map(t => t.category))].filter(cat => 
      tasksWithCategory.some(task => task.category === cat)
    );
    
    const handleToggle = async (taskId) => {
      try {
        await toggleTask(taskId);
        const data = await getTasks();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error('Error toggling task:', error);
      }
    };
    
    const handleDelete = async (taskId) => {
      try {
        const result = await deleteTask(taskId);
        setTasks(result.tasks || []);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };
    
    const handleDragStart = (e, task) => {
      setDraggedTask(task);
      e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDragEnd = () => {
      setDraggedTask(null);
      setDragOverCategory(null);
    };
    
    const handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };
    
    const handleDragEnter = (category) => {
      setDragOverCategory(category);
    };
    
    const handleDragLeave = (e) => {
      // Only clear if we're leaving the column entirely
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setDragOverCategory(null);
      }
    };
    
    const handleDrop = async (e, targetCategory) => {
      e.preventDefault();
      
      if (draggedTask && draggedTask.category !== targetCategory) {
        try {
          await updateTaskCategory(draggedTask.id, targetCategory);
          const data = await getTasks();
          setTasks(data.tasks || []);
        } catch (error) {
          console.error('Error updating task category:', error);
        }
      }
      
      setDraggedTask(null);
      setDragOverCategory(null);
    };
    
    return (
      <div className="kanban">
        {categories.map(cat => (
          <div 
            key={cat} 
            className={`kanban-column ${dragOverCategory === cat ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(cat)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, cat)}
          >
            <h3>{cat}</h3>
            {tasksWithCategory.filter(t => t.category === cat).map((task) => (
              <div 
                key={task.id} 
                className={`kanban-task ${task.completed ? 'completed' : ''} ${draggedTask?.id === task.id ? 'dragging' : ''}`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, task)}
                onDragEnd={handleDragEnd}
              >
                <div className="task-content">
                  <span className={task.completed ? 'task-text-completed' : 'task-text'}>
                    {task.task}
                  </span>
                </div>
                <div className="task-actions">
                  <button 
                    onClick={() => handleToggle(task.id)}
                    className={`task-btn ${task.completed ? 'btn-uncheck' : 'btn-check'}`}
                    title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {task.completed ? '↶' : '✓'}
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="task-btn btn-delete"
                    title="Delete task"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {tasksWithCategory.filter(t => t.category === cat).length === 0 && dragOverCategory === cat && (
              <div className="drop-zone">Drop task here</div>
            )}
          </div>
        ))}
      </div>
    );
  }
  