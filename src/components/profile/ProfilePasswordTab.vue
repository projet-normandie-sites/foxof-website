
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { AlertCircle, KeyRound, EyeOff, Eye } from 'lucide-vue-next'
import toastService from '@/services/toast.service'
import passwordService from '@/services/password.service'
import Spinner from '@/components/ui/Spinner.vue'
import type { ApiError } from '@/types'

// Initialize stores
const authStore = useAuthStore()

// Form state
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

// Password visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Local reactive state for form values
const formValues = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Create form validation schema en français
const validationSchema = z.object({
  currentPassword: z.string()
      .min(1, 'Le mot de passe actuel est requis'),
  newPassword: z.string()
      .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Za-z]/, 'Le nouveau mot de passe doit contenir au moins une lettre')
      .regex(/[0-9]/, 'Le nouveau mot de passe doit contenir au moins un chiffre'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
})

/**
 * Toggle password visibility for current password
 */
const toggleCurrentPasswordVisibility = () => {
  showCurrentPassword.value = !showCurrentPassword.value
}

/**
 * Toggle password visibility for new password
 */
const toggleNewPasswordVisibility = () => {
  showNewPassword.value = !showNewPassword.value
}

/**
 * Toggle password visibility for confirm password
 */
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

/**
 * Check if passwords match
 */
const doPasswordsMatch = computed(() => {
  if (!formValues.value.confirmPassword) return true
  return formValues.value.newPassword === formValues.value.confirmPassword
})

/**
 * Check if form is valid
 */
const isFormValid = computed(() => {
  return formValues.value.currentPassword &&
      formValues.value.newPassword.length >= 8 &&
      doPasswordsMatch.value
})

/**
 * Reset form fields
 */
const resetForm = () => {
  formValues.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  error.value = null
  success.value = false
}

/**
 * Handle form submission
 */
const onSubmit = async (event: Event) => {
  event.preventDefault()

  if (!authStore.user?.id) return

  // Validate the form manually with Zod
  try {
    // Parse will throw an error if validation fails
    validationSchema.parse(formValues.value)

    loading.value = true
    error.value = null
    success.value = false

    try {
      await passwordService.changePassword({
        currentPassword: formValues.value.currentPassword,
        newPassword: formValues.value.newPassword
      })

      // Show success notification
      toastService.success('Mot de passe modifié', 'Votre mot de passe a été changé avec succès')

      // Update success state
      success.value = true

      // Reset form fields
      resetForm()
    } catch (err: unknown) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.message || 'Impossible de changer le mot de passe. Veuillez vérifier votre mot de passe actuel et réessayer.'
      toastService.error('Erreur', error.value)
    } finally {
      loading.value = false
    }
  } catch (validationError) {
    // Handle Zod validation errors
    if (validationError instanceof z.ZodError) {
      error.value = validationError.errors[0]?.message || 'Erreur de validation du mot de passe'
    } else {
      error.value = 'Erreur de validation du mot de passe'
    }
  }
}
</script>

<template>
  <div>
    <!-- Error display -->
    <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2 mb-6">
      <AlertCircle class="h-5 w-5 flex-shrink-0" />
      <p>{{ error }}</p>
    </div>

    <!-- Success message -->
    <div v-if="success" class="p-3 bg-green-50 text-green-700 rounded-md flex items-center gap-2 mb-6">
      <AlertCircle class="h-5 w-5 flex-shrink-0" />
      <p>Votre mot de passe a été changé avec succès</p>
    </div>

    <!-- Form -->
    <form @submit="onSubmit" class="space-y-6">
      <!-- Current password field -->
      <div class="space-y-2">
        <label for="currentPassword" class="text-sm font-medium">
          Mot de passe actuel
        </label>
        <div class="relative">
          <Input
              id="currentPassword"
              name="currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              v-model="formValues.currentPassword"
              placeholder="Entrez votre mot de passe actuel"
              class="pr-10"
              autocomplete="current-password"
          />
          <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              @click="toggleCurrentPasswordVisibility"
              :aria-label="showCurrentPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
          >
            <Eye v-if="showCurrentPassword" class="h-5 w-5" />
            <EyeOff v-else class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- New password field -->
      <div class="space-y-2">
        <label for="newPassword" class="text-sm font-medium">
          Nouveau mot de passe
        </label>
        <div class="relative">
          <Input
              id="newPassword"
              name="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              v-model="formValues.newPassword"
              placeholder="Entrez votre nouveau mot de passe"
              class="pr-10"
              autocomplete="new-password"
          />
          <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              @click="toggleNewPasswordVisibility"
              :aria-label="showNewPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
          >
            <Eye v-if="showNewPassword" class="h-5 w-5" />
            <EyeOff v-else class="h-5 w-5" />
          </button>
        </div>
        <p class="text-sm text-muted-foreground">
          Le mot de passe doit contenir au moins 8 caractères avec des lettres et des chiffres
        </p>
      </div>

      <!-- Confirm password field -->
      <div class="space-y-2">
        <label for="confirmPassword" class="text-sm font-medium">
          Confirmer le nouveau mot de passe
        </label>
        <div class="relative">
          <Input
              id="confirmPassword"
              name="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="formValues.confirmPassword"
              placeholder="Confirmez votre nouveau mot de passe"
              class="pr-10"
              :class="{ 'border-red-500': formValues.confirmPassword && !doPasswordsMatch }"
              autocomplete="new-password"
          />
          <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              @click="toggleConfirmPasswordVisibility"
              :aria-label="showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
          >
            <Eye v-if="showConfirmPassword" class="h-5 w-5" />
            <EyeOff v-else class="h-5 w-5" />
          </button>
        </div>
        <p v-if="formValues.confirmPassword && !doPasswordsMatch" class="text-sm text-red-500">
          Les mots de passe ne correspondent pas
        </p>
      </div>

      <!-- Submit button -->
      <Button
          type="submit"
          :disabled="loading || !isFormValid"
          class="w-full sm:w-auto"
      >
        <template v-if="loading">
          <Spinner color="text-white" size="sm" :mr="true" />
          Modification en cours...
        </template>
        <template v-else>
          <KeyRound class="mr-2 h-4 w-4" />
          Changer le mot de passe
        </template>
      </Button>
    </form>
  </div>
</template>
