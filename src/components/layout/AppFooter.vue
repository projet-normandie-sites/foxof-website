<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <!-- Main footer component with legal links -->
  <footer class="border-t py-4 px-4 sm:px-6 w-full">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <!-- Copyright text -->
      <p>© 2025 Foxof. Tous droits réservés.</p>

      <!-- Legal links navigation -->
      <nav class="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        <!-- Legally required pages -->
        <RouterLink
            to="/legal"
            class="hover:underline hover:text-foreground transition-colors"
        >
          Mentions légales
        </RouterLink>

        <RouterLink
            to="/privacy"
            class="hover:underline hover:text-foreground transition-colors"
        >
          Confidentialité
        </RouterLink>

        <RouterLink
            to="/terms"
            class="hover:underline hover:text-foreground transition-colors"
        >
          Conditions d'utilisation
        </RouterLink>

        <!-- Important pages -->
        <RouterLink
            to="/contact"
            class="hover:underline hover:text-foreground transition-colors"
        >
          Contact
        </RouterLink>

        <RouterLink
            to="/rules"
            class="hover:underline hover:text-foreground transition-colors"
        >
          Règlement
        </RouterLink>

        <!-- Optional pages -->
        <RouterLink
            to="/about"
            class="hover:underline hover:text-foreground transition-colors"
        >
          À propos
        </RouterLink>
      </nav>
    </div>
  </footer>
</template>