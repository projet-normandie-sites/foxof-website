<script setup lang="ts">
import RegisterForm from '@/components/auth/RegisterForm.vue';
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">Foxof</h1>
        <p class="mt-2 text-gray-600">Créez votre compte</p>
      </div>

      <RegisterForm />
    </div>
  </div>
</template>
