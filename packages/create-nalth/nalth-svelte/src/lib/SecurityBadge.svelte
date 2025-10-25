<script lang="ts">
  export let score: number = 95

  $: scoreClass = score >= 90 ? 'excellent' : score >= 70 ? 'good' : 'needs-attention'
  $: statusLabel = score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Attention'
  $: statusIcon = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌'
</script>

<div class="nalth-security-badge">
  <span class="security-icon">🛡️</span>
  <div class="security-info">
    <span class="security-label">Security Score:</span>
    <span class="nalth-security-score {scoreClass}">{score}%</span>
    <span class="security-status">{statusLabel}</span>
  </div>
  <span class="status-icon {scoreClass}">{statusIcon}</span>
</div>

<style>
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
