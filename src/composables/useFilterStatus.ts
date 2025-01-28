import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import { useCategory } from '@/composables/useCategory'
import { FilterStatus } from '@/enums/FilterStatus'

export function useFilterStatus() {
  const todoStore = useTodoStore()
  const { clearSelectedCategory } = useCategory()

  // Reactive state for status
  const selectedStatus = ref<FilterStatus>(FilterStatus.ALL)

  // Function to change status
  const changeStatus = (status: FilterStatus) => {
    selectedStatus.value = status
    clearSelectedCategory()
  }

  const getAllTasks = () => {
    return todoStore.categories.flatMap((category) => category.items)
  }

  // Computed property to filter tasks based on status
  const filteredTasks = computed(() => {
    if (todoStore.selectedCategoryId !== null) {
      return (
        todoStore.categories.find((cat) => cat.id === todoStore.selectedCategoryId)?.items || []
      )
    }

    if (
      selectedStatus.value === FilterStatus.COMPLETED ||
      selectedStatus.value === FilterStatus.PENDING
    ) {
      const isCompleted = selectedStatus.value === FilterStatus.COMPLETED
      return todoStore.categories.flatMap((category) =>
        category.items.filter((task) => task.completed === isCompleted),
      )
    }
    return getAllTasks()
  })

  const getHeaderTitle = () => {
    if (todoStore.selectedCategoryId) {
      const selectedCategory = todoStore.categories.find(
        (cat) => cat.id === todoStore.selectedCategoryId,
      )
      return selectedCategory ? selectedCategory.title : 'All Tasks'
    } else {
      return selectedStatus.value !== FilterStatus.ALL
        ? `${selectedStatus.value} Tasks`
        : 'All Tasks'
    }
  }

  // Task completion summary
  const getTaskCompletionSummary = () => {
    const completedTasks = filteredTasks.value.filter((task) => task.completed).length
    const totalTasks = filteredTasks.value.length

    if (todoStore.selectedCategoryId || selectedStatus.value === FilterStatus.ALL) {
      return `${completedTasks} out of ${totalTasks} Tasks Completed`
    }

    const statusText = selectedStatus.value === FilterStatus.PENDING ? 'Pending' : 'Completed'
    const taskText = totalTasks === 1 ? 'Task' : 'Tasks'

    return `${totalTasks} ${taskText} ${statusText}`
  }

  const getTotalTaskCount = computed(() => {
    return todoStore.categories.reduce((total, category) => total + category.items.length, 0)
  })

  const getTotalTaskCountByStatus = computed(() => {
    return todoStore.categories.reduce(
      (totals, category) => {
        category.items.forEach((task) => {
          if (task.completed) {
            totals.completed += 1
          } else {
            totals.pending += 1
          }
        })
        return totals
      },
      { completed: 0, pending: 0 },
    )
  })

  return {
    selectedStatus,
    changeStatus,
    filteredTasks,
    getHeaderTitle,
    getTaskCompletionSummary,
    FilterStatus,
    getTotalTaskCount,
    getTotalTaskCountByStatus,
  }
}
