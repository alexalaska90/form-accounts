<script setup lang="ts">
import AccountComponent from './AccountComponent.vue'
</script>

<template>
  <section class="main_section">
    <div class="row items-center q-gutter-x-md">
      <h5 class="text-weight-bold">Учётные записи</h5>
        <q-btn
          outline
          padding="md"
          color="primary"
          icon="add"
      />
    </div>
    <q-card flat class="row items-center q-gutter-x-sm bg-blue-grey-1">
      <q-icon name="help" color="dark" size="md" />
      <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
    </q-card>
    <AccountComponent />
  </section>
</template>

<style lang="scss">
.main_section {
  width: 100%;
  max-width: 768px;
}
</style>