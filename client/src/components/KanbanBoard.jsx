export default function KanbanBoard({ tasks }) {
    // Ensure all tasks have a category
    const tasksWithCategory = tasks.map(t => ({
      ...t,
      category: t.category || "Uncategorized"
    }));
    
    const categories = [...new Set(tasksWithCategory.map(t => t.category))];
    
    return (
      <div className="kanban">
        {categories.map(cat => (
          <div key={cat} className="kanban-column">
            <h3>{cat}</h3>
            {tasksWithCategory.filter(t => t.category === cat).map((task, i) => (
              <div key={i} className="kanban-task">
                {task.task}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  