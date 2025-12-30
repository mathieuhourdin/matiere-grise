<template>
  <div class="bg-slate-50 dark:bg-elevated z-10 border-r border-slate-200 dark:border-gray-700 transition-colors duration-200 w-full md:w-64">
    <nav class="py-2">
      <!-- Social Section -->
      <MenuSection
        title="Social"
        icon="UsersIcon"
        :is-expanded="isSectionExpanded('social')"
        :is-active="isActiveSection('social')"
        @toggle="toggleSection('social')"
      >
        <MenuItem
          to="/social/feed"
          title="Fil d'actu"
          icon="RssIcon"
          :is-active="isActiveRoute('/social/feed')"
        />
        <MenuItem
          to="/social/resources"
          title="Ressources"
          icon="BookOpenIcon"
          :is-active="isActiveRoute('/social/resources')"
        />
        <MenuItem
          to="/social/users"
          title="Utilisateurs"
          icon="UserGroupIcon"
          :is-active="isActiveRoute('/social/users')"
        />
      </MenuSection>

      <!-- Me Section -->
      <MenuSection
        title="Moi"
        icon="UserIcon"
        :is-expanded="isSectionExpanded('me')"
        :is-active="isActiveSection('me')"
        @toggle="toggleSection('me')"
      >
        <MenuItem
          to="/me/home"
          title="Accueil"
          icon="HomeIcon"
          :is-active="isActiveRoute('/me/home')"
        />
        <MenuItem
          to="/me/create-resource"
          title="Créer une ressource"
          icon="PlusCircleIcon"
          :is-active="isActiveRoute('/me/create-resource')"
        />
        <MenuItem
          to="/me/platform-presentation"
          title="À propos"
          icon="InformationCircleIcon"
          :is-active="isActiveRoute('/me/platform-presentation')"
        />
        <MenuItem
          to="/me/mission-choice"
          title="Choix de mission"
          icon="ClipboardDocumentCheckIcon"
          :is-active="isActiveRoute('/me/mission-choice')"
        />
        <MenuItem
          to="/me/mentor-choice"
          title="Choix de mentor"
          icon="AcademicCapIcon"
          :is-active="isActiveRoute('/me/mentor-choice')"
        />
      </MenuSection>

      <!-- App Section -->
      <MenuSection
        title="Application"
        icon="Cog6ToothIcon"
        :is-expanded="isSectionExpanded('app')"
        :is-active="isActiveSection('app')"
        @toggle="toggleSection('app')"
      >
        <MenuItem
          to="/app/trace"
          title="Laisser une trace"
          icon="PencilSquareIcon"
          :is-active="isActiveRoute('/app/trace')"
        />
        <MenuItem
          to="/app/writer"
          title="Éditeur"
          icon="DocumentTextIcon"
          :is-active="isActiveRoute('/app/writer')"
        />
      </MenuSection>

      <!-- Legacy Section (collapsed by default) -->
      <MenuSection
        title="Legacy"
        icon="ArchiveBoxIcon"
        :is-expanded="isSectionExpanded('legacy')"
        :is-active="isActiveSection('legacy')"
        @toggle="toggleSection('legacy')"
      >
        <MenuItem
          to="/legacy/spip-conversion"
          title="Conversion SPIP"
          icon="ArrowPathIcon"
          :is-active="isActiveRoute('/legacy/spip-conversion')"
        />
      </MenuSection>

      <!-- Dark Mode Toggle -->
      <div class="px-3 mt-4 pt-4 border-t border-slate-200 dark:border-gray-700">
        <DarkModeMenuItem />
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from '@/composables/useUser'
import MenuSection from '@/components/App/MenuSection.vue'
import MenuItem from '@/components/App/MenuItem.vue'
import DarkModeMenuItem from '@/components/App/DarkModeMenuItem.vue'
import {
  UserIcon,
  UsersIcon,
  UserGroupIcon,
  RssIcon,
  BookOpenIcon,
  HomeIcon,
  PlusCircleIcon,
  InformationCircleIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  ArchiveBoxIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const { user } = useUser()

const expandedSections = ref<Set<string>>(new Set(['social', 'me']))

const isSectionExpanded = (section: string) => expandedSections.value.has(section)

const toggleSection = (section: string) => {
  if (expandedSections.value.has(section)) {
    expandedSections.value.delete(section)
  } else {
    expandedSections.value.add(section)
  }
}

const isActiveSection = (section: string) => {
  return route.path.startsWith(`/${section}`)
}

const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Auto-expand section if active route is inside it
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/social')) {
    expandedSections.value.add('social')
  } else if (newPath.startsWith('/me')) {
    expandedSections.value.add('me')
  } else if (newPath.startsWith('/app')) {
    expandedSections.value.add('app')
  } else if (newPath.startsWith('/legacy')) {
    expandedSections.value.add('legacy')
  }
}, { immediate: true })
</script>
