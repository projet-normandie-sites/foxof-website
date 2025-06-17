<template>
  <div class="space-y-8">
    <!-- Header section -->
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        {{ t('home.welcome') }}
      </h1>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
        {{ t('home.description') }}
      </p>
    </div>

    <!-- Main layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left column - Articles -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Latest 5 articles section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">{{ t('articles.latest') }}</h2>
            <RouterLink
                to="/articles"
                class="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
            >
              {{ t('articles.viewAll') }}
              <ArrowRight class="h-4 w-4" />
            </RouterLink>
          </div>

          <!-- Loading state for articles -->
          <div v-if="articlesLoading" class="flex justify-center py-8">
            <Spinner size="lg" color="text-primary" />
          </div>

          <!-- List of 5 latest articles -->
          <div v-else-if="articles.length > 0" class="space-y-4">
            <RouterLink
                v-for="article in articles"
                :key="article.id"
                :to="{ name: 'ArticleDetail', params: { id: article.id, slug: article.slug }}"
                class="block transition-all hover:scale-[1.01]"
            >
              <Card class="overflow-hidden hover:shadow-lg transition-shadow">
                <div class="md:flex">
                  <!-- Article image -->
                  <div v-if="article.picture" class="md:w-80 flex-shrink-0">
                    <img
                        :src="article.picture"
                        :alt="article.title"
                        class="h-48 w-full object-cover md:h-full"
                    />
                  </div>

                  <!-- Article content -->
                  <div class="flex-1 min-w-0">
                    <CardHeader class="pb-4">
                      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar class="h-4 w-4" />
                        <time :datetime="article.publishedAt">
                          {{ formatDate(article.publishedAt) }}
                        </time>
                      </div>
                      <CardTitle class="line-clamp-2 text-lg md:text-xl leading-tight">
                        {{ article.title }}
                      </CardTitle>
                      <p v-if="article.excerpt" class="text-muted-foreground text-sm line-clamp-2 mt-2">
                        {{ article.excerpt }}
                      </p>
                    </CardHeader>
                  </div>
                </div>
              </Card>
            </RouterLink>
          </div>

          <!-- Empty state for articles -->
          <div v-else class="text-center py-8">
            <Card class="p-8">
              <div class="text-muted-foreground">
                <Calendar class="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{{ t('articles.noArticles') }}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <!-- Right column - Twitch Player -->
      <div class="space-y-6">
        <!-- Twitch section -->
        <Card class="overflow-hidden">
          <CardHeader class="pb-4">
            <CardTitle class="flex items-center gap-2">
              <div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
              </div>
              <span>Live Stream - foxof846</span>
            </CardTitle>
          </CardHeader>
          <CardContent class="p-0">
            <!-- Embedded Twitch player -->
            <div class="aspect-video">
              <iframe
                  src="https://player.twitch.tv/?channel=foxof846&parent=localhost&parent=127.0.0.1&parent=foxof.com&autoplay=false&muted=true"
                  width="100%"
                  height="100%"
                  frameborder="0"
                  scrolling="no"
                  allowfullscreen
                  class="w-full h-full"
              ></iframe>
            </div>

            <!-- Link to Twitch channel -->
            <div class="p-4 bg-muted/50">
              <a
                  href="https://www.twitch.tv/foxof846"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
              >
                <ExternalLink class="h-4 w-4" />
                Regarder sur Twitch
              </a>
            </div>
          </CardContent>
        </Card>

        <!-- Twitch Chat section (optional) -->
        <Card class="overflow-hidden">
          <CardHeader class="pb-4">
            <CardTitle class="text-lg">Chat en direct</CardTitle>
          </CardHeader>
          <CardContent class="p-0">
            <div class="h-96">
              <iframe
                  src="https://www.twitch.tv/embed/foxof846/chat?parent=localhost&parent=127.0.0.1&parent=foxof.com"
                  width="100%"
                  height="100%"
                  frameborder="0"
                  class="w-full h-full"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Features section -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card class="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <div class="p-2 bg-primary/10 rounded-lg">
              <Gamepad2 class="h-5 w-5 text-primary" />
            </div>
            {{ t('home.features.feature1.title') }}
          </CardTitle>
          <CardDescription>{{ t('home.features.feature1.description') }}</CardDescription>
        </CardHeader>
      </Card>

      <Card class="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <div class="p-2 bg-primary/10 rounded-lg">
              <Users class="h-5 w-5 text-primary" />
            </div>
            {{ t('home.features.feature2.title') }}
          </CardTitle>
          <CardDescription>{{ t('home.features.feature2.description') }}</CardDescription>
        </CardHeader>
      </Card>

      <Card class="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <div class="p-2 bg-primary/10 rounded-lg">
              <Trophy class="h-5 w-5 text-primary" />
            </div>
            {{ t('home.features.feature3.title') }}
          </CardTitle>
          <CardDescription>{{ t('home.features.feature3.description') }}</CardDescription>
        </CardHeader>
      </Card>
    </div>

    <!-- Video Games Records Banner -->
    <VgrBanner />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from '@/i18n'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  Calendar,
  ArrowRight,
  ExternalLink,
  Gamepad2,
  Users,
  Trophy
} from 'lucide-vue-next'
import articleService, { type Article } from '@/services/article.service'
import Spinner from '@/components/ui/Spinner.vue'
import toastService from '@/services/toast.service'
import VgrBanner from '@/components/ui/VgrBanner.vue'

const { t, locale } = useI18n()

// Articles state
const articles = ref<Article[]>([])
const articlesLoading = ref(false)

/**
 * Format date according to locale
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Fetch the 5 latest articles
 */
const fetchLatestArticles = async () => {
  articlesLoading.value = true
  try {
    articles.value = await articleService.getLatestArticles(5)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    toastService.error(t('articles.error.title'), t('articles.error.loadFailed'))
  } finally {
    articlesLoading.value = false
  }
}

// Load articles when component is mounted
onMounted(() => {
  fetchLatestArticles()
})
</script>

<style scoped>
/* Line clamp utilities for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation for cards */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style>
