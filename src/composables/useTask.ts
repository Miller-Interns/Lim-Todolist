import { useTodoStore } from '@/stores/todoStore'
import { showSuccessToast, showErrorToast } from '@/utils/toast'

export function useTask() {
  const todoStore = useTodoStore()

  const addTask = (taskDescription: string) => {
    if (todoStore.selectedCategoryId === null) {
      showErrorToast('Please select a category before adding a task.')
      return
    }

    const category = todoStore.categories.find((cat) => cat.id === todoStore.selectedCategoryId)

    if (category) {
      const isDuplicate = category.items.some(
        (item) => item.description.toLowerCase() === taskDescription.toLowerCase(),
      )

      if (isDuplicate) {
        showErrorToast('Task with the same description already exists in this category.')
        return
      }

      category.items.push({
        id: Date.now(),
        description: taskDescription,
        completed: false,
      })

      showSuccessToast('Task added successfully!')
    } else {
      showErrorToast('Category not found.')
    }
  }

  const updateTask = (taskId: number, newTitle: string) => {
    // Find the category that contains the task
    const category = todoStore.categories.find((cat) =>
      cat.items.some((item) => item.id === taskId),
    )

    if (category) {
      // Find the task within the category
      const task = category.items.find((item) => item.id === taskId)

      // Check for duplicate task description (excluding the current task)
      const isDuplicate = category.items.some(
        (item) => item.id !== taskId && item.description.toLowerCase() === newTitle.toLowerCase(),
      )

      if (isDuplicate) {
        showErrorToast('Task with the same title already exists in this category.')
        return
      }

      // Update the task title
      if (task) {
        task.description = newTitle
        showSuccessToast('Task updated successfully.')
      }
    }
  }

  const deleteTask = (taskId: number) => {
    // Find the category that contains the task
    const category = todoStore.categories.find((cat) =>
      cat.items.some((item) => item.id === taskId),
    )
    if (category) {
      category.items = category.items.filter((item) => item.id !== taskId)
      showSuccessToast('Task deleted successfully!')
    } else {
      showErrorToast('Task not found.')
    }
  }

  const toggleTaskCompletion = (taskId: number) => {
    todoStore.categories.forEach((category) => {
      const task = category.items.find((item) => item.id === taskId)
      if (task) {
        task.completed = !task.completed
      }
    })
  }

  return {
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  }
}
