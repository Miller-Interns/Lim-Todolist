import { useTodoStore } from "@/stores/todoStore";

export function useTask() {
  const todoStore = useTodoStore();

  const addTaskToCategory = (categoryId: number | null, taskDescription: string) => {
    if (!categoryId) {
      window.alert("Please select a category before adding a task.");
      return;
    }

    const category = todoStore.categories.find(cat => cat.id === categoryId);
    if (category) {
      // Check for duplicate task description (case insensitive)
      const isDuplicate = category.items.some(
        (item) => item.description.toLowerCase() === taskDescription.toLowerCase()
      );

      if (isDuplicate) {
        window.alert("Task with the same description already exists in this category.");
        return;
      }

      category.items.push({
        id: Date.now(),
        description: taskDescription,
        completed: false,
      });

      window.alert("Task added successfully.");
    } else {
      window.alert("Category not found.");
    }
  };

  const updateTaskTitle = (taskId: number, newTitle: string) => {
    for (const category of todoStore.categories) {
      const task = category.items.find((item) => item.id === taskId);
      if (task) {
        // Check for duplicate task description (excluding the current task)
        const isDuplicate = category.items.some(
          (item) => item.id !== taskId && item.description.toLowerCase() === newTitle.toLowerCase()
        );

        if (isDuplicate) {
          window.alert("Task with the same title already exists in this category.");
          return;
        }

        task.description = newTitle;
        window.alert("Task updated successfully.");
        return;
      }
    }

    window.alert("Task not found.");
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
