<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import RoleAwareContent from './RoleAwareContent.vue'
import * as authUtils from '@/utils/auth.utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const authStore = useAuthStore()

/**
 * Get main roles for display with appropriate styling
 */
const mainRoles = computed(() => {
  const roles = []

  if (authUtils.isSuperAdmin()) roles.push({
    key: 'super-admin',
    label: 'Super Admin',
    variant: 'destructive'
  })

  if (authUtils.isAdmin()) roles.push({
    key: 'admin',
    label: 'Admin',
    variant: 'default'
  })

  return roles
})

/**
 * Get all user roles
 */
const allRoles = computed(() => {
  if (!authStore.user || !authStore.user.roles) return []
  return authStore.user.roles
})

/**
 * Count roles by category
 */
const roleCategories = computed(() => {
  if (!authStore.user || !authStore.user.roles) return {}

  const categories = {
    admin: 0,
    sonata: 0,
    vgr: 0,
    other: 0
  }

  allRoles.value.forEach(role => {
    if (role.includes('ROLE_SONATA')) {
      categories.sonata++
    } else if (role.includes('ROLE_VGR')) {
      categories.vgr++
    } else if (['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'].includes(role)) {
      categories.admin++
    } else {
      categories.other++
    }
  })

  return categories
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Statut de l'utilisateur</CardTitle>
    </CardHeader>

    <CardContent>
      <div v-if="authStore.isAuthenticated">
        <!-- Basic information -->
        <div class="mb-4">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span class="font-medium">
                {{ authStore.user?.username.substring(0, 2).toUpperCase() }}
              </span>
            </div>
            <div>
              <p class="font-medium">{{ authStore.user?.username }}</p>
              <div class="flex flex-wrap gap-1 mt-1">
                <Badge
                    v-for="role in mainRoles"
                    :key="role.key"
                    :variant="role.variant"
                >
                  {{ role.label }}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Roles section -->
        <div class="border-t pt-3 mt-3">
          <p class="text-sm text-muted-foreground mb-2">Catégories de rôles</p>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-secondary/10 p-2 rounded flex items-center justify-between">
              <span class="text-xs">Admin</span>
              <Badge variant="outline" class="text-xs">{{ roleCategories.admin }}</Badge>
            </div>
            <div class="bg-secondary/10 p-2 rounded flex items-center justify-between">
              <span class="text-xs">Sonata</span>
              <Badge variant="outline" class="text-xs">{{ roleCategories.sonata }}</Badge>
            </div>
            <div class="bg-secondary/10 p-2 rounded flex items-center justify-between">
              <span class="text-xs">VGR</span>
              <Badge variant="outline" class="text-xs">{{ roleCategories.vgr }}</Badge>
            </div>
            <div class="bg-secondary/10 p-2 rounded flex items-center justify-between">
              <span class="text-xs">Autres</span>
              <Badge variant="outline" class="text-xs">{{ roleCategories.other }}</Badge>
            </div>
          </div>
        </div>

        <!-- Admin-only actions -->
        <RoleAwareContent required-role="ROLE_ADMIN" class="mt-4">
          <div class="border-t pt-3">
            <h4 class="text-sm font-medium mb-2">Actions administrateur</h4>
            <div class="grid grid-cols-2 gap-2">
              <button class="text-xs bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded">
                Gérer les utilisateurs
              </button>
              <button class="text-xs bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded">
                Voir les statistiques
              </button>
            </div>
          </div>
        </RoleAwareContent>

        <!-- Super admin-only actions -->
        <RoleAwareContent required-role="ROLE_SUPER_ADMIN" class="mt-4">
          <div class="border-t pt-3">
            <h4 class="text-sm font-medium mb-2">Actions super administrateur</h4>
            <div class="grid grid-cols-2 gap-2">
              <button class="text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive p-2 rounded">
                Configuration système
              </button>
              <button class="text-xs bg-destructive/10 hover:bg-destructive/20 text-destructive p-2 rounded">
                Gestion des rôles
              </button>
            </div>
          </div>
        </RoleAwareContent>
      </div>

      <div v-else class="text-center py-4">
        <p class="text-muted-foreground text-sm">Connectez-vous pour voir votre statut</p>
      </div>
    </CardContent>
  </Card>
</template>
