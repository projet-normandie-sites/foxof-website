<script setup lang="ts">
import { Home, HelpCircle, Shield, Eye, FileText, Mail, Heart, Scale} from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSidebar } from '@/components/ui/sidebar'
import { useRouter, RouterLink } from 'vue-router'
import { watch } from 'vue'

const { setOpenMobile } = useSidebar()
const router = useRouter()

/**
 * Watch for route changes and close mobile sidebar
 * This handles cases where navigation happens programmatically
 */
watch(() => router.currentRoute.value.path, () => {
  setOpenMobile(false)
})
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink to="/">
                  <Home />
                  <span>Accueil</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Section Liens utiles -->
      <SidebarGroup class="mt-6">
        <SidebarGroupLabel>Liens utiles</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink to="/faq">
                  <HelpCircle />
                  <span>FAQ</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink to="/rules">
                  <Shield />
                  <span>Règlement</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink to="/privacy">
                  <Eye />
                  <span>Confidentialité</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink to="/terms">
                  <FileText />
                  <span>Conditions d'utilisation</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink to="/contact">
                  <Mail />
                  <span>Contact</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink to="/about">
                  <Heart />
                  <span>À propos</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink to="/legal">
                  <Scale />
                  <span>Mentions légales</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
