<template>
  <section class="app-card"><slot /></section>
</template>

<style scoped lang="scss">
.app-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, rgb(255 255 255 / 95%), rgb(250 248 255 / 92%));
  border: 1px solid rgb(255 255 255 / 90%);
  border-radius: var(--radius-card);
  box-shadow:
    var(--shadow-card),
    0 0 0 1px rgb(236 231 247 / 65%);
}
:global(:root[data-theme='dark']) .app-card {
  background: linear-gradient(145deg, rgb(52 47 68 / 96%), rgb(43 39 58 / 94%));
  border-color: rgb(255 255 255 / 5%);
  box-shadow:
    var(--shadow-card),
    0 0 0 1px rgb(66 59 85 / 70%);
}
</style>
