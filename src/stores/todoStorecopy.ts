import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { TodoCategory } from "@/types/TodoCategory";

export const useTodoStore = defineStore("todo", () => {
  // State
  const categories = ref<TodoCategory[]>([]);
  const selectedCategoryId = ref<number | null>(null);
  const currentFilter = ref<"All" | "Completed" | "Pending">("All");
  const selectedStatus = ref<string>("All");
  // Load categories from localStorage on initialization
  const loadFromLocalStorage = () => {
    try {
      const storedCategories = localStorage.getItem("todoCategories");
      if (storedCategories) {
        categories.value = JSON.parse(storedCategories);
      }
    } catch (error) {
      console.error("Failed to load categories from localStorage:", error);
    }
  };

  loadFromLocalStorage();

  // Save categories to localStorage whenever they change
  watch(
    () => categories.value,
    (newCategories) => {
      localStorage.setItem("todoCategories", JSON.stringify(newCategories));
    },
    { deep: true }
  );

  // Actions
  const addCategory = (newCategory: { title: string; tasks: string[] }) => {
    const newTodoCategory: TodoCategory = {
      id: Date.now(),
      title: newCategory.title,
      items: newCategory.tasks.map((task, index) => ({
        id: Date.now() + index,
        description: task,
        completed: false,
      })),
    };
    categories.value.push(newTodoCategory);
  };

  const selectCategory = (categoryId: number) => {
    selectedCategoryId.value = categoryId;
    currentFilter.value = "All"; // Reset the status filter to "All"
    selectedStatus.value = "All"; // Ensure status filter is reset
  };


  const clearSelectedCategory = () => {
    selectedCategoryId.value = null;
  };


  const updateCategoryTitle = (categoryId: number, newTitle: string) => {
    const category = categories.value.find(cat => cat.id === categoryId);
    if (category) {
      category.title = newTitle;
    }
  };

  const deleteCategory = (categoryId: number) => {
    categories.value = categories.value.filter(cat => cat.id !== categoryId);
    if (selectedCategoryId.value === categoryId) {
      selectedCategoryId.value = null; // Reset selected category if it's deleted
    }
  };

  const addTaskToCategory = (categoryId: number | null, taskDescription: string) => {
    const category = categories.value.find(cat => cat.id === categoryId);
    if (category) {
      category.items.push({
        id: Date.now(),
        description: taskDescription,
        completed: false,
      });
    }
  };

  const updateTaskTitle = (taskId: number, newTitle: string) => {
    for (const category of categories.value) {
      const task = category.items.find((item) => item.id === taskId);
      if (task) {
        task.description = newTitle; // Update the task description
        return;
      }
    }
  };

  const deleteTask = (taskId: number) => {
    for (const category of categories.value) {
      const taskIndex = category.items.findIndex((item) => item.id === taskId);
      if (taskIndex !== -1) {
        category.items.splice(taskIndex, 1); // Remove the task from the array
        return;
      }
    }
  };


const toggleTaskCompletion = (taskId: number) => {
  categories.value.forEach((category) => {
    const taskIndex = category.items.findIndex((item) => item.id === taskId);
    if (taskIndex !== -1) {
      category.items[taskIndex] = {
        ...category.items[taskIndex],
        completed: !category.items[taskIndex].completed,
      };
    }
  });
};

  const setFilter = (filter: "All" | "Completed" | "Pending") => {
    currentFilter.value = filter;
    clearSelectedCategory(); // Unselect category when a filter is applied
  };
  
  // Getters
  const getFilteredTasks = computed(() => {
    if (currentFilter.value === "All") {
      return categories.value.flatMap((category) => category.items);
    } else if (currentFilter.value === "Completed") {
      return categories.value.flatMap((category) =>
        category.items.filter((task) => task.completed)
      );
    } else if (currentFilter.value === "Pending") {
      return categories.value.flatMap((category) =>
        category.items.filter((task) => !task.completed)
      );
    }
    return [];
  });
  
  const selectedCategoryTitle = computed(() => {
    if (selectedCategoryId.value === null) {
      return currentFilter.value; // Show filter name if no category is selected
    }
    const category = categories.value.find(
      (category) => category.id === selectedCategoryId.value
    );
    return category ? category.title : "All Tasks";
  });

  const getAllTasks = () => {
    return categories.value.flatMap((category) => category.items);
  };
  const getSelectedCategoryTasks = computed(() => {
    const category = categories.value.find(cat => cat.id === selectedCategoryId.value);
    return category ? category.items : [];
  });

  const getCompletedTaskCount = computed(() => {
    return categories.value.reduce(
      (total, category) => total + category.items.filter((task) => task.completed).length,
      0
    );
  });


  const getTotalTaskCount = computed(() => {
    return categories.value.reduce((total, category) => total + category.items.length, 0);
  });

  const getTotalCompletedCount = computed(() => {
    return categories.value.reduce(
      (total, category) => total + category.items.filter(task => task.completed).length,
      0
    );
  });

  const getTotalPendingCount = computed(() => {
    return categories.value.reduce(
      (total, category) => total + category.items.filter(task => !task.completed).length,
      0
    );
  });

  
  return {
    categories,
    selectedCategoryId,
    currentFilter,
    addCategory,
    selectCategory,
    clearSelectedCategory,
    updateCategoryTitle,
    deleteCategory,
    addTaskToCategory,
    updateTaskTitle,
    deleteTask,
    toggleTaskCompletion,
    setFilter,
    selectedCategoryTitle,
    getAllTasks,
    getFilteredTasks,
    getSelectedCategoryTasks,
    getCompletedTaskCount,
    getTotalTaskCount,
    getTotalCompletedCount,
    getTotalPendingCount,
  };
});
