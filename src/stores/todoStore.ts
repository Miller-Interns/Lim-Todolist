import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { TodoCategory } from "@/types/TodoCategory";

export const useTodoStore = defineStore("todo", () => {
  // State
  const categories = ref<TodoCategory[]>([]);
  const selectedCategoryId = ref<number | null>(null);
  const currentFilter = ref<"All" | "Completed" | "Pending">("All");

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
  
  // Getters
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
    selectedCategoryTitle,
    getAllTasks,
    getSelectedCategoryTasks,
    getCompletedTaskCount,
    getTotalTaskCount,
    getTotalCompletedCount,
    getTotalPendingCount,
  };
});
