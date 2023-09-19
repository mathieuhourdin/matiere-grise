<template>
  <div class="w-full flex h-12 bg-slate-300 rounded-t border-b border-b-slate-400 shadow">
    <Bars3Icon @click="toggleMenuOpen" class="p-1 md:p-2" />
    <BaseLink class="md:ml-4 my-auto mr-auto text-xs md:text-base">🫀 Matiere Grise</BaseLink>
    <router-link class="my-auto mr-1 md:mr-4 text-xs md:text-base" to="/platform-presentation">A Propos</router-link>
    <UserManagement class="mr-1 md:mr-4 my-auto" />
  </div>
</template>

<script setup>
import UserManagement from '@/components/UserManagement.vue'
import BaseLink from '@/components/Ui/BaseLink.vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useMenu } from '@/composables/useMenu.ts'
const { toggleMenuOpen } = useMenu()
</script>
