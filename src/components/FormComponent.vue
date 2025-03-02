<script setup lang="ts">
import AccountsComponent from './AccountsComponent.vue'
</script>

<template>
  <section class="main_section">
    <div class="row items-center q-gutter-x-md">
      <h5 class="text-weight-bold q-my-none">Учётные записи</h5>
      <q-btn outline padding="md" color="primary" icon="add" />
    </div>
    <q-card flat class="bg-blue-grey-1 q-mt-lg">
      <div class="row items-center q-gutter-x-sm no-wrap">
        <q-icon name="help" color="dark" size="md" />
        <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
      </div>
    </q-card>
    <AccountsComponent />
  </section>
</template>

<style lang="scss">
.main_section {
  width: 100%;
  max-width: 1368px;
  padding: 0 16px;
}
</style>
