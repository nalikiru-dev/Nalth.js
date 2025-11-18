<template>
  <div class="nalth-security-badge">
    <span class="security-icon">🛡️</span>
    <div class="security-info">
      <span class="security-label">Security Score:</span>
      <span :class="['nalth-security-score', scoreClass]">{{ score }}%</span>
      <span class="security-status">{{ statusLabel }}</span>
    </div>
    <span :class="['status-icon', scoreClass]">{{ statusIcon }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  score?: number
}

const props = withDefaults(defineProps<Props>(), {
  score: 95
})

const scoreClass = computed(() => {
  if (props.score >= 90) return 'excellent'
  if (props.score >= 70) return 'good'
  return 'needs-attention'
})

const statusLabel = computed(() => {
  if (props.score >= 90) return 'Excellent'
  if (props.score >= 70) return 'Good'
  return 'Needs Attention'
})

const statusIcon = computed(() => {
  if (props.score >= 90) return '✅'
  if (props.score >= 70) return '⚠️'
  return '❌'
})
</script>

<style scoped>
.security-icon {
  font-size: 1.25rem;
}

.security-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.security-label {
  font-size: 0.875rem;
  color: var(--nalth-text-muted);
}

.security-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  background: var(--nalth-bg-secondary);
  color: var(--nalth-text-muted);
}

.status-icon {
  font-size: 1.125rem;
}
</style>
