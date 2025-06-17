<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowLeft } from 'lucide-vue-next'
import articleService, { type Article } from '@/services/article.service'
import Spinner from '@/components/ui/Spinner.vue'
import toastService from '@/services/toast.service'
import CommentForm from '@/components/article/CommentForm.vue'
import CommentList from '@/components/article/CommentList.vue'

const route = useRoute()
const article = ref<Article | null>(null)
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
 * Handle comment added event to refresh comments list
 */
const handleCommentAdded = () => {
  // Refresh comments
  if (commentListRef.value && typeof commentListRef.value.loadComments === 'function') {
    console.log('Actualisation de la liste des commentaires...')

    commentListRef.value.loadComments(1, true)
  } else {
    console.warn('Référence CommentList ou méthode loadComments non disponible')
  }
}

// Reference to the CommentList component for method calls
const commentListRef = ref(null)

/**
 * Fetch article details
 */
const fetchArticle = async () => {
  const id = route.params.id as string

  if (!id) {
    toastService.error('Erreur', 'ID d\'article invalide')
    return Promise.reject(new Error('Invalid article ID'))
  }

  loading.value = true
  try {
    article.value = await articleService.getArticle(parseInt(id))
    return article.value
  } catch (error) {
    console.error('Échec du chargement de l\'article:', error)
    toastService.error('Erreur', 'Impossible de charger l\'article')
    return Promise.reject(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticle().then(() => {
    setTimeout(() => {
      if (commentListRef.value && typeof commentListRef.value.loadComments === 'function') {
        commentListRef.value.loadComments(1)
      }
    }, 100)
  })
})
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-8">
    <!-- Back button -->
    <RouterLink
        to="/"
        class="inline-flex items-center gap-2 text-primary hover:underline mb-6"
    >
      <ArrowLeft class="h-4 w-4" />
      Retour à l'accueil
    </RouterLink>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <Spinner size="lg" color="text-primary" />
    </div>

    <!-- Article content -->
    <article v-else-if="article">
      <!-- Article header -->
      <div class="mb-8">
        <div class="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div class="flex items-center gap-2">
            <Calendar class="h-4 w-4" />
            <time :datetime="article.publishedAt">
              {{ formatDate(article.publishedAt) }}
            </time>
          </div>
        </div>

        <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ article.title }}</h1>
      </div>

      <!-- Article image -->
      <div v-if="article.picture" class="mb-8">
        <img
            :src="article.picture"
            :alt="article.title"
            class="w-full rounded-lg shadow-lg"
        />
      </div>

      <!-- Article content -->
      <Card>
        <CardContent class="prose dark:prose-invert max-w-none p-6">
          <div v-html="article.content"></div>
        </CardContent>
      </Card>

      <!-- Comments section -->
      <div class="mt-8 space-y-6">
        <!-- Comment form -->
        <CommentForm
            :article-iri="article?.['@id'] || `/api/articles/${route.params.id}`"
            @comment-added="handleCommentAdded"
        />

        <!-- Comments list -->
        <CommentList
            ref="commentListRef"
            :article-id="parseInt(route.params.id as string)"
        />
      </div>
    </article>

    <!-- Error state -->
    <div v-else class="text-center py-12">
      <Card>
        <CardContent class="p-8">
          <h2 class="text-xl font-semibold mb-2">Article introuvable</h2>
          <p class="text-muted-foreground mb-4">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button asChild>
            <RouterLink to="/">
              Retourner à l'accueil
            </RouterLink>
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.prose {
  color: inherit;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  color: inherit;
}

.prose :deep(a) {
  color: var(--primary);
  text-decoration: underline;
}

.prose :deep(a:hover) {
  color: var(--primary);
  opacity: 0.8;
}

.prose :deep(img) {
  border-radius: 0.5rem;
}

.prose :deep(p) {
  margin-bottom: 1rem;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
}
</style>
