<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ArrowRight } from 'lucide-vue-next'
import articleService, { type Article } from '@/services/article.service'
import Spinner from '@/components/ui/Spinner.vue'
import toastService from '@/services/toast.service'

const articles = ref<Article[]>([])
const loading = ref(false)

/**
 * Format date for display in French
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Fetch latest articles
 */
const fetchLatestArticles = async () => {
  loading.value = true
  try {
    articles.value = await articleService.getLatestArticles(5)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    toastService.error('Erreur', 'Échec du chargement des articles')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLatestArticles()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Derniers Articles</h2>
      <RouterLink
          to="/articles"
          class="text-primary hover:underline flex items-center gap-1"
      >
        Voir tout
        <ArrowRight class="h-4 w-4" />
      </RouterLink>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <Spinner size="lg" color="text-primary" />
    </div>

    <!-- Articles list -->
    <div v-else-if="articles.length > 0" class="grid gap-4">
      <RouterLink
          v-for="article in articles"
          :key="article.id"
          :to="{ name: 'ArticleDetail', params: { id: article.id, slug: article.slug }}"
          class="block transition-transform hover:scale-[1.01]"
      >
        <Card class="overflow-hidden hover:shadow-lg transition-shadow">
          <div class="md:flex">
            <!-- Article Image -->
            <div v-if="article.picture" class="md:w-1/3">
              <img
                  :src="article.picture"
                  :alt="article.title"
                  class="h-48 w-full object-cover md:h-full"
              />
            </div>

            <!-- Article Content -->
            <div class="flex-1">
              <CardHeader>
                <div class="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar class="h-4 w-4" />
                  <time :datetime="article.publishedAt">
                    {{ formatDate(article.publishedAt) }}
                  </time>
                </div>
                <CardTitle class="line-clamp-2">{{ article.title }}</CardTitle>
              </CardHeader>
            </div>
          </div>
        </Card>
      </RouterLink>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-8">
      <p class="text-muted-foreground">Aucun article disponible</p>
    </div>
  </div>
</template>
