<template>
  <Card class="overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0">
    <CardContent class="p-0">
      <div class="relative">
        <!-- Background overlay for better text readability -->
        <div class="absolute inset-0 bg-black/20"></div>

        <div class="relative z-10 p-8 text-center">
          <div class="space-y-4">
            <!-- VGR Logo/Icon -->
            <div class="flex justify-center">
              <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Trophy class="h-8 w-8 text-white" />
              </div>
            </div>

            <!-- Main title -->
            <h3 class="text-2xl md:text-3xl font-bold">
              Video Games Records
            </h3>

            <!-- Subtitle -->
            <p class="text-lg text-white/90 max-w-2xl mx-auto">
              La référence mondiale du speedrun et des records de jeux vidéo
            </p>

            <!-- Description -->
            <p class="text-white/80 max-w-3xl mx-auto">
              Découvrez les meilleurs records mondiaux, suivez vos speedrunners préférés
              et participez à la plus grande communauté de joueurs compétitifs !
            </p>

            <!-- Call-to-action buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <a
                  href="https://www.videogamesrecords.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                <ExternalLink class="h-4 w-4" />
                Visiter VGR
              </a>

              <a
                  href="https://www.videogamesrecords.com/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <UserPlus class="h-4 w-4" />
                Rejoindre la communauté
              </a>
            </div>

            <!-- Statistics -->
            <div class="flex flex-wrap justify-center gap-6 mt-6 text-sm">
              <div class="text-center">
                <div class="font-bold text-lg">1.6M+</div>
                <div class="text-white/80">Scores</div>
              </div>
              <div class="text-center">
                <div class="font-bold text-lg">5K+</div>
                <div class="text-white/80">Joueurs</div>
              </div>
              <div class="text-center">
                <div class="font-bold text-lg">6K+</div>
                <div class="text-white/80">Jeux</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, ExternalLink, UserPlus } from 'lucide-vue-next'
</script>

<style scoped>
/* Additional animations for the banner */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

/* Hover effects for better interactivity */
.hover-scale:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease-in-out;
}
</style>
