import { useTodoStore } from '@/stores/todoStore'
import { showSuccessToast, showErrorToast } from '@/utils/toast'

export function useCategory() {
  const todoStore = useTodoStore()

  const addCategory = (newCategory: { title: string; tasks: string[] }) => {
    // Check for duplicate category title (case insensitive)
    const isDuplicate = todoStore.categories.some(
      (cat) => cat.title.toLowerCase() === newCategory.title.toLowerCase(),
    )

    if (isDuplicate) {
      showErrorToast('A category with the same title already exists.')
      return
    }

    const newTodoCategory = {
      id: Date.now(),
      title: newCategory.title,
      items: newCategory.tasks.map((task, index) => ({
        id: Date.now() + index,
        description: task,
        completed: false,
      })),
    }

    todoStore.categories.push(newTodoCategory)
    showSuccessToast('Category added successfully.')
  }

  const updateCategory = (categoryId: number, newTitle: string) => {
    const category = todoStore.categories.find((cat) => cat.id === categoryId)

    if (!category) {
      showErrorToast('Category not found.')
      return
    }

    // Check for duplicate category title (excluding the current category)
    const isDuplicate = todoStore.categories.some(
      (cat) => cat.id !== categoryId && cat.title.toLowerCase() === newTitle.toLowerCase(),
    )

    if (isDuplicate) {
      showErrorToast('A category with the same title already exists.')
      return
    }

    category.title = newTitle
    showSuccessToast('Category title updated successfully.')
  }

  const deleteCategory = (categoryId: number) => {
    const categoryExists = todoStore.categories.some((cat) => cat.id === categoryId)

    if (categoryExists) {
      todoStore.categories = todoStore.categories.filter((cat) => cat.id !== categoryId)

      if (todoStore.selectedCategoryId === categoryId) {
        todoStore.selectedCategoryId = null
      }

      showSuccessToast('Category deleted successfully!')
    } else {
      showErrorToast('Category not found.')
    }
  }

  const selectCategory = (categoryId: number) => {
    todoStore.selectedCategoryId = categoryId
  }

  const clearSelectedCategory = () => {
    todoStore.selectedCategoryId = null
  }

  const getCategoryName = (taskId: number): string => {
    const category = todoStore.categories.find((cat) =>
      cat.items.some((task) => task.id === taskId),
    )
    return category ? category.title : 'Unknown'
  }

  return {
    addCategory,
    updateCategory,
    deleteCategory,
    selectCategory,
    clearSelectedCategory,
    getCategoryName,
  }
}
