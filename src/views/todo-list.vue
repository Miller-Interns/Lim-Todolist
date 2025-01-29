<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import TaskModal from './task-modal.vue'
  import { useTodoStore } from '@/stores/todoStore'
  import { useCategory } from '@/composables/useCategory'
  import { useTask } from '@/composables/useTask'
  import { useFilterStatus } from '@/composables/useFilterStatus'
  import { FilterStatus } from '@/enums/FilterStatus'

  // Reactive state for editing
  const editingCategoryId = ref<number | null>(null)
  const editingTaskId = ref<number | null>(null)
  const tempCategoryTitle = ref('')
  const tempTaskTitle = ref('')

  const todoStore = useTodoStore()

  const selectedCategoryId = computed(() => todoStore.selectedCategoryId)
  const categories = computed(() => todoStore.categories)

  const { addCategory, selectCategory, updateCategory, deleteCategory, getCategoryName } =
    useCategory()
  const { addTask, updateTask, deleteTask, toggleTaskCompletion } = useTask()
  const {
    selectedStatus,
    changeStatus,
    filteredTasks,
    getHeaderTitle,
    getTaskCompletionSummary,
    getTotalTaskCount,
    getTotalTaskCountByStatus,
  } = useFilterStatus()

  //State
  const isModalOpen = ref(false)
  const isTaskInputVisible = ref(false)
  const newTask = ref('')

  const closeModal = () => {
    isModalOpen.value = false
  }

  const handleAddCategory = (newCategory: { title: string; tasks: string[] }) => {
    addCategory(newCategory)
    isModalOpen.value = false
  }

  // Edit Category
  const saveCategory = () => {
    if (editingCategoryId.value !== null && tempCategoryTitle.value.trim()) {
      updateCategory(editingCategoryId.value, tempCategoryTitle.value.trim())
    }
    exitCategoryInput()
  }

  const exitCategoryInput = () => {
    editingCategoryId.value = null
    tempCategoryTitle.value = ''
  }

  // Edit Task
  const editTask = (taskId: number, currentTitle: string) => {
    editingTaskId.value = taskId
    tempTaskTitle.value = currentTitle
  }

  const submitTask = () => {
    if (newTask.value.trim()) {
      addTask(newTask.value.trim()) // No need to pass categoryId
    }
    resetTaskInput()
  }

  const saveTask = () => {
    if (editingTaskId.value !== null && tempTaskTitle.value.trim()) {
      updateTask(editingTaskId.value, tempTaskTitle.value.trim())
    }
    exitTaskInput()
  }

  const exitTaskInput = () => {
    editingTaskId.value = null
    tempTaskTitle.value = ''
  }

  const showTaskInput = () => {
    isTaskInputVisible.value = true
  }

  const resetTaskInput = () => {
    isTaskInputVisible.value = false
    newTask.value = ''
  }
</script>

<template>
  <div class="todo-list">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="status">
        <div
          class="status-item"
          @click="changeStatus(FilterStatus.ALL)"
          :class="{ selected: selectedStatus === FilterStatus.ALL }"
        >
          <span class="status-icon">
            <font-awesome-icon :icon="['fas', 'clipboard-list']" />
          </span>
          <h3>All</h3>
          <span class="status-count">{{ getTotalTaskCount }}</span>
        </div>
        <div
          class="status-item"
          @click="changeStatus(FilterStatus.COMPLETED)"
          :class="{ selected: selectedStatus === FilterStatus.COMPLETED }"
        >
          <span class="status-icon">
            <font-awesome-icon :icon="['fas', 'square-check']" style="color: #18c335" />
          </span>
          <h3>Completed</h3>
          <span class="status-count">{{ getTotalTaskCountByStatus.completed }}</span>
        </div>
        <div
          class="status-item"
          @click="changeStatus(FilterStatus.PENDING)"
          :class="{ selected: selectedStatus === FilterStatus.PENDING }"
        >
          <span class="status-icon">
            <font-awesome-icon :icon="['fas', 'hourglass-end']" />
          </span>
          <h3>Pending</h3>
          <span class="status-count">{{ getTotalTaskCountByStatus.pending }}</span>
        </div>
      </div>
      <div class="category-list">
        <h3>My Lists</h3>
        <ul>
          <li
            v-for="category in categories"
            :key="category.id"
            :class="{ selected: category.id === selectedCategoryId }"
            class="category-item"
            @click="selectCategory(category.id)"
          >
            <div class="category-content">
              <div v-if="editingCategoryId === category.id">
                <input
                  type="text"
                  v-model="tempCategoryTitle"
                  @keyup.enter="saveCategory"
                  @keyup.esc="exitCategoryInput"
                  @blur="saveCategory"
                  class="edit-input"
                />
              </div>
              <div v-else>
                <span>{{ category.title }}</span>
              </div>
            </div>
            <div class="actions">
              <button
                @click.stop="
                  ((editingCategoryId = category.id), (tempCategoryTitle = category.title))
                "
                class="edit-btn"
              >
                <font-awesome-icon :icon="['fas', 'pen-to-square']" />
              </button>
              <button @click.stop="deleteCategory(category.id)" class="delete-btn">
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </aside>
    <!-- Main Content -->
    <main class="main-content">
      <header class="content-header">
        <h2>{{ getHeaderTitle() }}</h2>
        <button class="add-task-btn" @click="isModalOpen = true">
          <span class="add-icon">
            <font-awesome-icon icon="plus" />
          </span>
          Add Todo List
        </button>
      </header>
      <div class="completed-tasks">
        <h3>{{ getTaskCompletionSummary() }}</h3>
      </div>
      <div v-if="filteredTasks.length > 0">
        <ul class="task-list">
          <li
            v-for="task in filteredTasks"
            :key="task.id"
            :class="{ completed: task.completed }"
            class="task-item"
          >
            <!-- Show Category Name Only When Not Viewing by Category -->
            <div
              v-if="
                !selectedCategoryId &&
                (selectedStatus === FilterStatus.COMPLETED ||
                  selectedStatus === FilterStatus.PENDING ||
                  selectedStatus === FilterStatus.ALL)
              "
              class="task-header"
            >
              {{ getCategoryName(task.id) }}
            </div>

            <div class="task-body">
              <!-- Task Checkbox and Content -->
              <input
                type="checkbox"
                :checked="task.completed"
                @change="toggleTaskCompletion(task.id)"
                class="task-checkbox"
              />
              <!-- Task Name -->
              <div v-if="editingTaskId === task.id" class="task-content">
                <input
                  type="text"
                  v-model="tempTaskTitle"
                  @keyup.enter="saveTask"
                  @keyup.esc="exitTaskInput"
                  @blur="saveTask"
                  class="edit-input"
                />
              </div>
              <div v-else class="task-content">
                {{ task.description }}
              </div>
              <!-- Task Actions -->
              <div class="actions">
                <button @click="editTask(task.id, task.description)" class="edit-btn">
                  <font-awesome-icon :icon="['fas', 'pen-to-square']" />
                </button>
                <button @click="deleteTask(task.id)" class="delete-btn">
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        <span v-if="categories.length === 0">
          No categories available. Please create a category.
        </span>
        <span v-else-if="!selectedCategoryId"> Please select a category to view tasks. </span>
        <span v-else-if="filteredTasks.length === 0"> No tasks available. </span>
      </div>
      <div v-if="selectedCategoryId" class="add-task-container">
        <li v-if="isTaskInputVisible" class="add-task-input">
          <input
            type="text"
            v-model="newTask"
            placeholder="Enter new task..."
            @keyup.enter="submitTask"
            @blur="resetTaskInput"
            class="task-input"
          />
        </li>
        <li v-else class="add-task-button">
          <button @click="showTaskInput" class="add-task-btn">
            <font-awesome-icon :icon="['fas', 'plus']" />
            Add Task
          </button>
        </li>
      </div>
    </main>
  </div>
  <!-- Task Modal -->
  <TaskModal :isVisible="isModalOpen" @close="closeModal" @add-task="handleAddCategory" />
</template>

<style scoped>
  /* General Styles */
  h2,
  h3 {
    color: black;
  }

  .todo-list {
    display: flex;
    height: 100vh;
    width: 100vw;
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    margin-top: 40px;
  }

  /* Sidebar Styles */
  .sidebar {
    width: 25%;
    background-color: #fff;
    border-right: 1px solid #ddd;
    padding: 20px;
    box-sizing: border-box;
  }

  .status {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 16px;
    margin: 20px 0;
    padding: 16px;
    background-color: #f9f9f9;
    border-radius: 12px;
  }

  .status-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #e0e0e0;
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    height: 100px;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .status-item:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .status-icon {
    font-size: 2rem;
    margin-bottom: 5px;
    color: #555;
  }

  .status-item h3 {
    font-size: 0.9rem;
    margin: 0;
    color: #333;
  }

  .status-count {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: #007bff;
    color: white;
    font-size: 0.8rem;
    font-weight: bold;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Category List Styles */
  .category-list {
    margin-top: 20px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .category-list h3 {
    margin-bottom: 15px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    text-align: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
  }

  .category-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .category-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    margin-bottom: 8px;
    font-size: 1rem;
    background-color: #fff;
    color: black;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid transparent;
  }

  .category-item:hover {
    background-color: #e9ecef;
    transform: scale(1.02);
  }

  .category-item.selected {
    background-color: #007bff;
    color: #fff;
    font-weight: bold;
    border-color: #0056b3;
  }

  .category-item .actions .edit-btn {
    color: #007bff;
    transition: color 0.3s ease;
  }

  .category-item.selected .actions .edit-btn,
  .category-item.selected .actions .delete-btn {
    color: white;
  }

  .category-content {
    flex-grow: 1;
    text-align: left;
  }

  .category-details {
    color: #333;
    cursor: pointer;
  }

  .category-actions {
    display: flex;
    gap: 10px;
  }

  /* Main Content Styles */
  .main-content {
    flex: 1;
    padding: 20px;
    box-sizing: border-box;
  }

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .completed-tasks {
    border-bottom: 1px solid black;
    align-content: center;
    height: 30px;
    text-align: left;
  }

  /* Task List Styles */
  .task-list {
    list-style-type: none;
    margin: 0;
    margin-top: 20px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 8px;
    margin-left: -30px;
  }

  .task-list::-webkit-scrollbar {
    width: 8px;
  }

  .task-list::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }

  .task-list::-webkit-scrollbar-thumb:hover {
    background-color: #999;
  }

  .task-item {
    display: flex;
    flex-direction: column;
    padding: 15px;
    margin-bottom: 10px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid transparent;
    font-size: 1rem;
    color: #333;
    text-align: left;
    gap: 10px;
  }

  .task-item:hover {
    background-color: #f1f3f5;
    transform: translateY(-2px);
  }

  .task-header {
    font-size: 0.9rem;
    font-weight: bold;
    color: #007bff;
    border-bottom: 1px solid black;
  }

  .task-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .task-checkbox {
    margin-right: 10px;
    cursor: pointer;
  }

  .task-content {
    flex-grow: 1;
  }

  /* Add Task Input */
  .add-task-input {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
    margin-bottom: 10px;
    transition:
      background-color 0.3s ease,
      transform 0.2s ease;
  }

  .add-task-input:hover {
    background-color: #f9f9f9;
    transform: scale(1.02);
  }

  .task-input {
    flex-grow: 1;
    padding: 8px 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
    transition: border-color 0.2s ease;
  }

  .task-input:focus {
    border-color: #007bff;
  }

  /* Add Task Button */
  .add-task-button {
    text-align: center;
    margin-top: 10px;
  }

  .add-task-btn {
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.2s ease;
  }

  .add-task-btn:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  .add-task-btn:active {
    background-color: #003f7f;
    transform: scale(1);
  }

  /* Shared Actions */
  .actions button {
    padding: 5px 8px;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    background: transparent;
    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  .actions .edit-btn {
    color: #0056b3;
  }

  .actions .edit-btn:hover {
    color: #003f7f;
    transform: scale(1.1);
  }

  .actions .delete-btn {
    color: #ff6b6b;
  }

  .actions .delete-btn:hover {
    color: #dc3545;
    transform: scale(1.1);
  }

  /* Editable Input Styles */
  .edit-input {
    width: 100%;
    padding: 8px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .category-list {
      padding: 8px;
      box-shadow: none;
    }

    .category-item {
      font-size: 0.9rem;
      padding: 8px 10px;
    }

    .task-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .task-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
</style>
