import { toggleTask, deleteTask, getTasks } from "../api";

export default function KanbanBoard({ tasks, setTasks }) {
    // Ensure all tasks have a category
    const tasksWithCategory = tasks.map(t => ({
      ...t,
      category: t.category || "Uncategorized"
    }));
    
    const categories = [...new Set(tasksWithCategory.map(t => t.category))];
    
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
    
    return (
      <div className="kanban">
        {categories.map(cat => (
          <div key={cat} className="kanban-column">
            <h3>{cat}</h3>
            {tasksWithCategory.filter(t => t.category === cat).map((task) => (
              <div key={task.id || task.task} className={`kanban-task ${task.completed ? 'completed' : ''}`}>
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
          </div>
        ))}
      </div>
    );
  }
  