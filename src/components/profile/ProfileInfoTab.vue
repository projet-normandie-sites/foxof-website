<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { AlertCircle, Save } from 'lucide-vue-next'
import userService from '@/services/user.service'
import toastService from '@/services/toast.service'
import Spinner from '@/components/ui/Spinner.vue'
import type { ApiError } from '@/types'

// Initialize stores
const authStore = useAuthStore()

// Emit events with safeguard
const emit = defineEmits<{
  'profile-updated': []
}>()

// Form state
const loading = ref(false)
const error = ref<string | null>(null)

// Local reactive state for form values (plus de sélecteur de langue)
const formValues = ref({
  username: '',
  email: ''
})

// Create form validation schema en français
const validationSchema = z.object({
  username: z.string()
      .min(3, 'Le nom d\'utilisateur doit comporter au moins 3 caractères')
      .max(20, 'Le nom d\'utilisateur doit comporter au plus 20 caractères')
      .regex(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres et des underscores'),
  email: z.string()
      .email('Veuillez entrer une adresse email valide')
})

/**
 * Load user data
 */
const loadUserData = async () => {
  if (!authStore.user?.id) return

  loading.value = true
  try {
    const userData = await userService.getUserProfile(authStore.user.id)

    // Update our local form values (sans language)
    formValues.value = {
      username: userData.username || '',
      email: userData.email || ''
    }

    // Log the loaded data to verify
    console.log('Données utilisateur chargées:', userData)
    console.log('Valeurs du formulaire après mise à jour:', formValues.value)
  } catch (err) {
    console.error('Échec du chargement des données utilisateur:', err)
    error.value = 'Impossible de charger les données du profil'
  } finally {
    loading.value = false
  }
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

    try {
      await userService.updateUserProfile(authStore.user.id, {
        username: formValues.value.username,
        email: formValues.value.email
      })

      // Update auth store with new data
      if (typeof authStore.updateUserData === 'function') {
        authStore.updateUserData({
          ...authStore.user,
          username: formValues.value.username
        })
      }

      // Show success notification
      toastService.success('Profil mis à jour', 'Vos informations ont été sauvegardées avec succès')

      // Emit event to parent if defined
      if (typeof emit === 'function') {
        emit('profile-updated')
      }
    } catch (err: unknown) {
      const apiError = err as ApiError
      error.value = apiError.response?.data?.message || 'Impossible de mettre à jour le profil'
      toastService.error('Erreur', error.value)
    } finally {
      loading.value = false
    }
  } catch (validationError) {
    // Handle Zod validation errors
    if (validationError instanceof z.ZodError) {
      error.value = validationError.errors[0]?.message || 'Erreur de validation du formulaire'
    } else {
      error.value = 'Erreur de validation du formulaire'
    }
  }
}

// Load user data on component mount
onMounted(() => {
  loadUserData()
})
</script>

<template>
  <div>
    <!-- Error display -->
    <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2 mb-6">
      <AlertCircle class="h-5 w-5 flex-shrink-0" />
      <p>{{ error }}</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading && !formValues.username" class="flex justify-center py-8">
      <Spinner size="lg" color="text-primary" />
    </div>

    <!-- Form -->
    <form v-else @submit="onSubmit" class="space-y-6">
      <!-- Username field -->
      <div class="space-y-2">
        <label for="username" class="text-sm font-medium">Nom d'utilisateur</label>
        <Input
            id="username"
            name="username"
            v-model="formValues.username"
            placeholder="Entrez votre nom d'utilisateur"
            autocomplete="username"
        />
        <p class="text-sm text-muted-foreground">
          Votre nom d'utilisateur sera visible par les autres utilisateurs
        </p>
      </div>

      <!-- Email field -->
      <div class="space-y-2">
        <label for="email" class="text-sm font-medium">Adresse email</label>
        <Input
            id="email"
            name="email"
            type="email"
            v-model="formValues.email"
            placeholder="Entrez votre adresse email"
            autocomplete="email"
        />
        <p class="text-sm text-muted-foreground">
          Nous ne partagerons jamais votre email avec des tiers
        </p>
      </div>

      <!-- Submit button -->
      <Button
          type="submit"
          :disabled="loading"
          class="w-full sm:w-auto"
      >
        <template v-if="loading">
          <Spinner color="text-white" size="sm" :mr="true" />
          Sauvegarde...
        </template>
        <template v-else>
          <Save class="mr-2 h-4 w-4" />
          Sauvegarder les modifications
        </template>
      </Button>
    </form>
  </div>
</template>
