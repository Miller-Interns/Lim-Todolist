import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { TodoCategory } from '@/types/TodoCategory'

export const useTodoStore = defineStore('todo', () => {
  // State
  const categories = ref<TodoCategory[]>([])
  const selectedCategoryId = ref<number | null>(null)

  // Load categories from localStorage on initialization
  const fetchData = () => {
    try {
      const storedCategories = localStorage.getItem('todoCategories')
      if (storedCategories) {
        categories.value = JSON.parse(storedCategories)
      }
    } catch (error) {
      console.error('Failed to load categories from localStorage:', error)
    }
  }

  fetchData()

  // Save categories to localStorage whenever they change
  watch(
    () => categories.value,
    (newCategories) => {
      localStorage.setItem('todoCategories', JSON.stringify(newCategories))
    },
    { deep: true },
  )

  return {
    categories,
    selectedCategoryId,
  }
})
