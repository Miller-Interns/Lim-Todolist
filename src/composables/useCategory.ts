import { useTodoStore } from "@/stores/todoStore";

import { ref } from 'vue'
export function useCategory() {
  const todoStore = useTodoStore();

  const selectedStatus = ref<string>("All");

  const addCategory = (newCategory: { title: string; tasks: string[] }) => {
    const newTodoCategory = {
      id: Date.now(),
      title: newCategory.title,
      items: newCategory.tasks.map((task, index) => ({
        id: Date.now() + index,
        description: task,
        completed: false,
      })),
    };
    todoStore.categories.push(newTodoCategory);
  };

  const updateCategoryTitle = (categoryId: number, newTitle: string) => {
    const category = todoStore.categories.find((cat) => cat.id === categoryId);
    if (category) {
      category.title = newTitle;
    }
  };

  const deleteCategory = (categoryId: number) => {
    todoStore.categories = todoStore.categories.filter(cat => cat.id !== categoryId);
    if (todoStore.selectedCategoryId === categoryId) {
      todoStore.selectedCategoryId = null;
    }
  };


const selectCategory = (categoryId: number) => {
  const todoStore = useTodoStore();  // Ensure store instance is used
  todoStore.selectedCategoryId = categoryId;  // Update store state directly
  todoStore.currentFilter = "All";  // Reset the status filter
  selectedStatus.value = "All";  // Reset local filter state
};



  const clearSelectedCategory = () => {
    todoStore.selectedCategoryId = null;
  };

  return {
    addCategory,
    updateCategoryTitle,
    deleteCategory,
    selectCategory,
    clearSelectedCategory
  };
}
