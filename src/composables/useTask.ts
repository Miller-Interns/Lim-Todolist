import { useTodoStore } from "@/stores/todoStore";

export function useTask() {
  const todoStore = useTodoStore();

  const addTaskToCategory = (categoryId: number | null, taskDescription: string) => {
    const category = todoStore.categories.find(cat => cat.id === categoryId);
    if (category) {
      category.items.push({
        id: Date.now(),
        description: taskDescription,
        completed: false,
      });
    }
  };

  const updateTaskTitle = (taskId: number, newTitle: string) => {
    for (const category of todoStore.categories) {
      const task = category.items.find((item) => item.id === taskId);
      if (task) {
        task.description = newTitle;
        return;
      }
    }
  };

  const deleteTask = (taskId: number) => {
    for (const category of todoStore.categories) {
      const taskIndex = category.items.findIndex((item) => item.id === taskId);
      if (taskIndex !== -1) {
        category.items.splice(taskIndex, 1);
        return;
      }
    }
  };

  const toggleTaskCompletion = (taskId: number) => {
    todoStore.categories.forEach((category) => {
      const task = category.items.find((item) => item.id === taskId);
      if (task) {
        task.completed = !task.completed;
      }
    });
  };

  return {
    addTaskToCategory,
    updateTaskTitle,
    deleteTask,
    toggleTaskCompletion
  };
}
