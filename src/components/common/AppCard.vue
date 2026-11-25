<template>
  <section class="app-card"><slot /></section>
</template>

<style scoped lang="scss">
.app-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}
</style>
