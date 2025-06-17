<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-16rem)]">
    <div class="text-center max-w-2xl px-6">
      <div class="mb-8">
        <div class="flex justify-center mb-6">
          <div class="relative">
            <div class="text-[10rem] font-extrabold text-primary opacity-10 leading-none select-none">
              404
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-4xl md:text-5xl font-bold text-primary">
                Introuvable
              </span>
            </div>
          </div>
        </div>
        <h2 class="text-2xl font-semibold mb-6">
          Page non trouvée
        </h2>
        <p class="text-muted-foreground mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été supprimée. Vérifiez l'URL ou retournez à la page d'accueil.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button @click="goBack" class="cursor-pointer">
            Retour
          </Button>
          <Button asChild variant="outline">
            <RouterLink to="/">
              Accueil
            </RouterLink>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
