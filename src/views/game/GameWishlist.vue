<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Jeux Recherchés</h1>
      <p class="text-muted-foreground">
        Découvrez les jeux que vous souhaitez acquérir pour votre collection
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <Alert v-else-if="error" variant="destructive" class="mb-6">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Erreur</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>

    <!-- Empty State -->
    <div v-else-if="games.length === 0" class="text-center py-12">
      <Search class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold mb-2">Aucun jeu en recherche</h3>
      <p class="text-muted-foreground">
        Vous n'avez encore aucun jeu dans votre liste de recherche.
      </p>
    </div>

    <!-- Games Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
      <Card
          v-for="game in games"
          :key="game.id"
          class="overflow-hidden hover:shadow-lg transition-all duration-200"
      >
        <div class="aspect-[3/4] relative overflow-hidden">
          <!-- Game Cover -->
          <img
              :src="getGameCoverUrl(game.id)"
              :alt="`Cover de ${game.name}`"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
              @error="handleImageError"
          />
        </div>

        <!-- Game Info -->
        <CardContent class="p-3">
          <h3 class="font-semibold text-sm mb-1 line-clamp-2 transition-colors">
            {{ game.name }}
          </h3>
          <div class="flex items-center gap-1 text-xs text-muted-foreground">
            <Monitor class="h-3 w-3 flex-shrink-0" />
            <span class="truncate">{{ game.platform.name }}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Stats -->
    <div v-if="games.length > 0" class="text-center text-sm text-muted-foreground">
      {{ games.length }} jeu{{ games.length > 1 ? 'x' : '' }} recherché{{ games.length > 1 ? 's' : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Search,
  Monitor,
  AlertCircle
} from 'lucide-vue-next'
import gameService, { type Game } from '@/services/game.service'

// Reactive state
const games = ref<Game[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Methods
const fetchSearchedGames = async () => {
  try {
    loading.value = true
    error.value = null

    games.value = await gameService.getSearchedGames()

  } catch (err) {
    console.error('Erreur lors du chargement des jeux:', err)
    error.value = 'Impossible de charger les jeux recherchés'
  } finally {
    loading.value = false
  }
}

const getGameCoverUrl = (gameId: number) => {
  return gameService.getGameCoverUrl(gameId)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/default-game-cover.jpg'
}

// Lifecycle
onMounted(() => {
  fetchSearchedGames()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>