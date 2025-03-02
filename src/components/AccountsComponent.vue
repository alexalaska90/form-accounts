<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAccountsStore } from 'src/stores/accounts-store'

const text = ref<string>('')
const record = ref<string>('Локальная')
const options = reactive<string[]>(['Локальная', 'LDAP'])
const isPwd = ref<boolean>(true)

const accountsStore = useAccountsStore()
</script>

<template>
  <div class="row q-gutter-x-md items-center no-wrap q-mt-md">
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Метки</div>
    <div class="col-2 text-subtitle2 text-weight-bold text-grey-7">Тип записи</div>
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Логин</div>
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Пароль</div>
  </div>
  <div v-for="(account, index) in accountsStore.accounts" :key="index" class="row q-gutter-x-md items-center no-wrap q-mt-md">
    <div class="col-3">
      <q-input placeholder="Значение" outlined v-model="text" dense />
    </div>
    <div class="col-2">
      <q-select placeholder="Значение" outlined v-model="record" :options="options" dense />
    </div>
    <div :class="account.record === 'Локальная' ? 'col-3' : 'col-6'">
      <q-input placeholder="Значение" outlined v-model="account.login" dense />
    </div>
    <div class="col-3" v-if="account.record === 'Локальная'">
      <q-input placeholder="Значение" outlined v-model="account.password" dense :type="isPwd ? 'password' : 'text'">
        <template v-slot:append>
          <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
        </template>
      </q-input>
    </div>
    <q-btn flat color="negative" class="q-pa-xs" icon="delete" />
  </div>
</template>
