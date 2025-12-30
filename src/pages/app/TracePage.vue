<template>
  <div class="p-4 md:p-6 max-w-4xl mx-auto">
    <QuickCreateResourceContent
      :show-cancel="false"
      :reset-on-mount="true"
      @created="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
import QuickCreateResourceContent from '@/components/Resource/QuickCreateResourceContent.vue'

const handleCreated = (resourceId: string) => {
  // Resource creation is handled by the content component (redirects to resource page)
  // This handler is here for potential future use
}
</script>
