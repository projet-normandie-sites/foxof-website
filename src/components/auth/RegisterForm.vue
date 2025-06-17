<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Lock, Mail, User, AlertCircle, Eye, EyeOff } from 'lucide-vue-next'
import Spinner from '@/components/ui/Spinner.vue'
import useRegisterService from '@/services/register.service'
import toastService from '@/services/toast.service'
import type { ApiError } from "@/types"

/**
 * RegisterForm component using Shadcn Card UI
 * Handles user registration with the API
 */

// Form data
const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const router = useRouter()
const registerService = useRegisterService()

/**
 * Toggle password visibility between plain text and hidden
 */
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

/**
 * Toggle confirm password visibility between plain text and hidden
 */
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

/**
 * Validate email format
 */
const isEmailValid = computed(() => {
  if (!email.value) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

/**
 * Validate username format (alphanumeric + underscores, 3-20 chars)
 */
const isUsernameValid = computed(() => {
  if (!username.value) return true
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username.value)
})

/**
 * Validate password strength (min 8 chars, at least 1 letter and 1 number)
 */
const isPasswordValid = computed(() => {
  if (!password.value) return true
  return password.value.length >= 8 &&
      /[A-Za-z]/.test(password.value) &&
      /[0-9]/.test(password.value)
})

/**
 * Check if passwords match
 */
const doPasswordsMatch = computed(() => {
  if (!confirmPassword.value) return true
  return password.value === confirmPassword.value
})

/**
 * Check if form is valid and can be submitted
 */
const isFormValid = computed(() => {
  return email.value &&
      username.value &&
      password.value &&
      confirmPassword.value &&
      isEmailValid.value &&
      isUsernameValid.value &&
      isPasswordValid.value &&
      doPasswordsMatch.value
})

/**
 * Handle registration form submission
 * Creates a new user account via API
 */
const handleRegister = async () => {
  if (!isFormValid.value) return

  loading.value = true
  error.value = null

  try {
    const userData = {
      username: username.value,
      email: email.value,
      plainPassword: password.value
    }

    await registerService.register(userData)

    // Show success notification
    toastService.success(
        'Inscription réussie',
        'Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.'
    )

    // Redirect to login page
    router.push('/login')
  } catch (err: unknown) {
    const apiError = err as ApiError
    error.value = apiError.response?.data?.message || 'Une erreur est survenue lors de l\'inscription'

    // Show error notification
    toastService.error(
        'Erreur d\'inscription',
        error.value
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Card class="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle class="text-2xl font-bold text-center">
        Créer un compte
      </CardTitle>
      <CardDescription class="text-center">
        Inscrivez-vous pour commencer votre aventure
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Error message -->
        <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle class="h-5 w-5" />
          <span>{{ error }}</span>
        </div>

        <!-- Email field -->
        <div class="space-y-2">
          <label for="email" class="text-sm font-medium">
            Adresse email <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Mail class="h-5 w-5" />
            </div>
            <Input
                id="email"
                type="email"
                v-model="email"
                placeholder="Entrez votre adresse email"
                class="pl-10"
                :disabled="loading"
                :class="{ 'border-red-500': email && !isEmailValid }"
                autocomplete="email"
                required
            />
          </div>
          <p v-if="email && !isEmailValid" class="text-sm text-red-500">
            Veuillez entrer une adresse email valide
          </p>
        </div>

        <!-- Username field -->
        <div class="space-y-2">
          <label for="username" class="text-sm font-medium">
            Nom d'utilisateur <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <User class="h-5 w-5" />
            </div>
            <Input
                id="username"
                v-model="username"
                placeholder="Choisissez un nom d'utilisateur"
                class="pl-10"
                :disabled="loading"
                :class="{ 'border-red-500': username && !isUsernameValid }"
                autocomplete="username"
                required
            />
          </div>
          <p v-if="username && !isUsernameValid" class="text-sm text-red-500">
            Le nom d'utilisateur doit contenir entre 3 et 20 caractères (lettres, chiffres et _ uniquement)
          </p>
        </div>

        <!-- Password field -->
        <div class="space-y-2">
          <label for="password" class="text-sm font-medium">
            Mot de passe <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Lock class="h-5 w-5" />
            </div>
            <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Créez un mot de passe sécurisé"
                class="pl-10"
                :disabled="loading"
                :class="{ 'border-red-500': password && !isPasswordValid }"
                autocomplete="new-password"
                required
            />
            <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
              <Eye v-if="!showPassword" class="h-5 w-5" />
              <EyeOff v-else class="h-5 w-5" />
            </button>
          </div>
          <p v-if="password && !isPasswordValid" class="text-sm text-red-500">
            Le mot de passe doit contenir au moins 8 caractères, incluant au moins une lettre et un chiffre
          </p>
        </div>

        <!-- Confirm Password field -->
        <div class="space-y-2">
          <label for="confirmPassword" class="text-sm font-medium">
            Confirmer le mot de passe <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Lock class="h-5 w-5" />
            </div>
            <Input
                id="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                placeholder="Confirmez votre mot de passe"
                class="pl-10"
                :disabled="loading"
                :class="{ 'border-red-500': confirmPassword && !doPasswordsMatch }"
                autocomplete="new-password"
                required
            />
            <button
                type="button"
                @click="toggleConfirmPasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
              <Eye v-if="!showConfirmPassword" class="h-5 w-5" />
              <EyeOff v-else class="h-5 w-5" />
            </button>
          </div>
          <p v-if="confirmPassword && !doPasswordsMatch" class="text-sm text-red-500">
            Les mots de passe ne correspondent pas
          </p>
        </div>

        <!-- Register button -->
        <Button
            type="submit"
            class="w-full"
            :disabled="loading || !isFormValid"
        >
          <template v-if="loading">
            <Spinner color="text-white" size="md" :mr="true" />
            Inscription en cours...
          </template>
          <template v-else>
            Créer mon compte
          </template>
        </Button>
      </form>
    </CardContent>

    <CardFooter class="flex justify-center">
      <p class="text-sm text-muted-foreground">
        Déjà un compte ?
        <RouterLink to="/login" class="text-primary hover:underline ml-1">
          Se connecter
        </RouterLink>
      </p>
    </CardFooter>
  </Card>
</template>
