<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue';
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">Foxof</h1>
        <p class="mt-2 text-gray-600">Connectez-vous à votre compte</p>
      </div>

      <LoginForm />
    </div>
  </div>
</template>