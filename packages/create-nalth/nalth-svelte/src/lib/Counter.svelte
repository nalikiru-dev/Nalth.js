<script lang="ts">
  let count: number = $state(0)
  const increment = () => {
    count += 1
  }
</script>

<div class="counter-display">
  <div class="nalth-counter-display">{count}</div>
  <button class="nalth-button" onclick={increment}>
    🚀 Increment Securely
  </button>
</div>

<style>
  .counter-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--nalth-space-md);
  }
</style>
