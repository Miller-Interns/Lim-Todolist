<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

defineProps({
  isVisible: Boolean,
});

const emit = defineEmits(['close', 'add-task']);

const categoryTitle = ref('');
const taskDescriptions = ref('');

const emitClose = () => {
  emit('close');
};

const handleAddTask = () => {
  if (!categoryTitle.value.trim() || !taskDescriptions.value.trim()) {
    alert('Please provide both a category and tasks.');
    return;
    
  }

  const tasks = taskDescriptions.value
    .split('\n') // Split tasks by newlines
    .map(task => task.trim())
    .filter(task => task); // Remove empty tasks

  if (tasks.length === 0) {
    alert('Please enter at least one task.');
    return;
  }

  const newCategory = {
    title: categoryTitle.value,
    tasks,
  };

  emit('add-task', newCategory);
  emitClose();

  // Reset modal fields
  categoryTitle.value = '';
  taskDescriptions.value = '';
};
</script>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">Add New Task</h2>
      <form @submit.prevent="handleAddTask">
        <div class="form-group">
          <label for="category-title" class="form-label">Category Title:</label>
          <input
            id="category-title"
            type="text"
            v-model="categoryTitle"
            class="form-input"
            placeholder="Enter category title"
            required
          />
        </div>
        <div class="form-group">
          <label for="task-desc" class="form-label">List of Tasks:</label>
          <textarea
            id="task-desc"
            v-model="taskDescriptions"
            class="form-textarea"
            placeholder="Enter each task on a new line"
            rows="5"
            required
          ></textarea>
        </div>
        <div class="modal-actions">
          <button type="submit" class="modal-btn save-btn">Save</button>
          <button type="button" class="modal-btn cancel-btn" @click="emitClose">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>



<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Content */
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 30px 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
  border-bottom: 1px solid black;
}

/* Form Group */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #555;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-family: sans-serif;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  resize: none; /* Disable resizing */
}

.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.modal-btn {
  flex: 1;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.modal-btn:hover {
  transform: translateY(-2px);
}

.modal-btn:active {
  transform: translateY(0);
}

.save-btn {
  background-color: #007bff;
  color: white;
}

.save-btn:hover {
  background-color: #0056b3;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
}

.cancel-btn:hover {
  background-color: #b21f2d;
}
</style>
