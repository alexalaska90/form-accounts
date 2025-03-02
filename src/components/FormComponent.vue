<script setup lang="ts">
import AccountsComponent from './AccountsComponent.vue'
import { ref } from 'vue'

const accountsComponentRef = ref<InstanceType<typeof AccountsComponent>>()
const addAccount = (): void => {
  accountsComponentRef.value!.addAccount()
}
</script>

<template>
  <section class="main_section q-px-lg">
    <div class="row items-center q-gutter-x-md">
      <h5 class="text-weight-bold q-my-none">Учётные записи</h5>
      <q-btn @click="addAccount" outline padding="md" color="primary" icon="add" />
    </div>
    <q-card flat class="bg-blue-grey-1 q-mt-lg">
      <div class="row items-center q-gutter-x-sm no-wrap">
        <q-icon name="help" color="dark" size="md" />
        <span>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span>
      </div>
    </q-card>
    <AccountsComponent ref="accountsComponentRef" />
  </section>
</template>

<style lang="scss">
.main_section {
  width: 100%;
  max-width: 1024px;
}
</style>
