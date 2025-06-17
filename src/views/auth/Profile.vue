<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth.ts';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Upload, KeyRound } from 'lucide-vue-next';
import ProfileInfoTab from '@/components/profile/ProfileInfoTab.vue';
import ProfileAvatarTab from '@/components/profile/ProfileAvatarTab.vue';
import ProfilePasswordTab from '@/components/profile/ProfilePasswordTab.vue';
import UserRoleStatus from '@/components/auth/UserRoleStatus.vue';
import UserAvatar from '@/components/user/UserAvatar.vue';

// Get stores
const authStore = useAuthStore();

// Current active tab/accordionItem
const activeTab = ref('info');
const activeAccordionItem = ref(['info']); // For accordion, need array of active items

// Track window width for responsive design
const windowWidth = ref(window.innerWidth);
const isMobileView = computed(() => windowWidth.value < 640); // 640px is the sm breakpoint in Tailwind

// Update window width on resize
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// Computed property to format token expiration date
const tokenExpirationDate = computed(() => {
  if (!authStore.tokenExpiration) return 'Non disponible';

  const date = new Date(authStore.tokenExpiration * 1000);
  return date.toLocaleString();
});

// Check if token is expired
const isTokenExpired = computed(() => {
  return authStore.isTokenExpired;
});

/**
 * Handle profile info update
 */
const handleProfileUpdate = () => {
  // Refresh user data if needed
  if (typeof authStore.refreshUserData === 'function') {
    authStore.refreshUserData();
  }
};

/**
 * Handle accordion item change
 */
const handleAccordionChange = (value) => {
  activeAccordionItem.value = value ? [value] : [];
  // If there's a selected item, update the active tab as well
  if (value) {
    activeTab.value = value;
  }
};

/**
 * Handle tab change
 */
const handleTabChange = (value) => {
  activeTab.value = value;
  // Synchronize accordion selection with tab
  activeAccordionItem.value = [value];
};

// Add event listener for resize on mount
onMounted(() => {
  window.addEventListener('resize', handleResize);
  // Initial check
  handleResize();
});

// Remove event listener on unmount
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Profil</h1>
        <p class="text-gray-500">Gérez vos informations personnelles et vos paramètres de compte</p>
      </div>
      <UserAvatar size="lg" bordered />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main content - tabs with responsive switching -->
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardContent class="pt-6">
            <!-- Mobile: Accordion interface -->
            <div v-if="isMobileView">
              <Accordion
                  type="single"
                  collapsible
                  :value="activeAccordionItem[0]"
                  @update:value="handleAccordionChange"
              >
                <AccordionItem value="info">
                  <AccordionTrigger>
                    <div class="flex items-center gap-2">
                      <User class="h-4 w-4" />
                      Informations personnelles
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ProfileInfoTab @profile-updated="handleProfileUpdate" />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="avatar">
                  <AccordionTrigger>
                    <div class="flex items-center gap-2">
                      <Upload class="h-4 w-4" />
                      Photo de profil
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ProfileAvatarTab />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="password">
                  <AccordionTrigger>
                    <div class="flex items-center gap-2">
                      <KeyRound class="h-4 w-4" />
                      Mot de passe
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ProfilePasswordTab />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <!-- Desktop: Tabs interface -->
            <div v-else>
              <Tabs :value="activeTab" @update:value="handleTabChange">
                <TabsList class="grid grid-cols-3 w-full">
                  <TabsTrigger value="info" class="flex items-center gap-2">
                    <User class="h-4 w-4" />
                    Informations personnelles
                  </TabsTrigger>
                  <TabsTrigger value="avatar" class="flex items-center gap-2">
                    <Upload class="h-4 w-4" />
                    Photo de profil
                  </TabsTrigger>
                  <TabsTrigger value="password" class="flex items-center gap-2">
                    <KeyRound class="h-4 w-4" />
                    Mot de passe
                  </TabsTrigger>
                </TabsList>

                <div class="mt-6">
                  <TabsContent value="info" class="space-y-0">
                    <ProfileInfoTab @profile-updated="handleProfileUpdate" />
                  </TabsContent>

                  <TabsContent value="avatar" class="space-y-0">
                    <ProfileAvatarTab />
                  </TabsContent>

                  <TabsContent value="password" class="space-y-0">
                    <ProfilePasswordTab />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Sidebar/Right column -->
      <div class="space-y-6">
        <!-- User status card -->
        <UserRoleStatus :user="authStore.user" />

        <!-- Session information -->
        <Card>
          <CardContent class="pt-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
              <KeyRound class="h-5 w-5" />
              Informations de session
            </h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-muted-foreground">Statut du token :</span>
                <span :class="isTokenExpired ? 'text-red-600' : 'text-green-600'">
                  {{ isTokenExpired ? 'Expiré' : 'Actif' }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-muted-foreground">Expiration :</span>
                <span>{{ tokenExpirationDate }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
