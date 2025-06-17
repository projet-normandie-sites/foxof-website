<script setup lang="ts">
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue';
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">Foxof</h1>
        <p class="mt-2 text-gray-600">Réinitialiser votre mot de passe</p>
      </div>

      <ForgotPasswordForm />
    </div>
  </div>
</template>
