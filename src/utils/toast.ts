import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Success Notification
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    pauseOnHover: true,
  })
}

// Error Notification
export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
    pauseOnHover: true,
  })
}
