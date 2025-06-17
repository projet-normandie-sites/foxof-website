<script setup lang="ts">
import { ref } from 'vue'
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
import { useAuthStore } from '@/stores/auth'
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-vue-next'
import Spinner from '@/components/ui/Spinner.vue'

/**
 * LoginForm component using Shadcn Card UI
 * Handles user authentication with username/password
 */
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const authStore = useAuthStore()
const router = useRouter()

/**
 * Toggle password visibility between plain text and hidden
 */
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

/**
 * Handle login form submission
 * Authenticates user and redirects to home page on success
 */
const handleLogin = async () => {
  if (username.value && password.value) {
    const success = await authStore.login(username.value, password.value)
    if (success) {
      router.push('/')
    }
  }
}
</script>

<template>
  <Card class="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle class="text-2xl font-bold text-center">
        Connexion
      </CardTitle>
      <CardDescription class="text-center">
        Connectez-vous à votre compte pour continuer
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Error message -->
        <div v-if="authStore.getError" class="p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle class="h-5 w-5" />
          <span>{{ authStore.getError }}</span>
        </div>

        <!-- Username field -->
        <div class="space-y-2">
          <label for="username" class="text-sm font-medium">
            Nom d'utilisateur
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <User class="h-5 w-5" />
            </div>
            <Input
                id="username"
                v-model="username"
                placeholder="Entrez votre nom d'utilisateur"
                class="pl-10"
                :disabled="authStore.isLoading"
                autocomplete="username"
            />
          </div>
        </div>

        <!-- Password field -->
        <div class="space-y-2">
          <label for="password" class="text-sm font-medium">
            Mot de passe
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Lock class="h-5 w-5" />
            </div>
            <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Entrez votre mot de passe"
                class="pl-10"
                :disabled="authStore.isLoading"
                autocomplete="current-password"
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
        </div>

        <!-- Login button -->
        <Button
            type="submit"
            class="w-full"
            :disabled="authStore.isLoading || !username || !password"
        >
          <template v-if="authStore.isLoading">
            <Spinner color="text-white" size="md" :mr="true" />
            Connexion en cours...
          </template>
          <template v-else>
            Se connecter
          </template>
        </Button>
      </form>
    </CardContent>

    <CardFooter class="flex flex-col space-y-4">
      <RouterLink to="/forgot-password" class="text-primary text-sm hover:underline">
        Mot de passe oublié ?
      </RouterLink>

      <div class="w-full border-t pt-4">
        <p class="text-sm text-center text-muted-foreground">
          Vous n'avez pas de compte ?
          <RouterLink to="/register" class="text-primary hover:underline ml-1">
            S'inscrire
          </RouterLink>
        </p>
      </div>
    </CardFooter>
  </Card>
</template>
