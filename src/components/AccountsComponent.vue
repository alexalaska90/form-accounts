<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import { useAccountsStore } from 'src/stores/accounts-store'
import type { INote, IAccount, IEvent } from 'src/models'

const options = reactive<string[]>(['Локальная', 'LDAP'])
const isPwd = ref<boolean>(true)

const accountsStore = useAccountsStore()

onBeforeMount((): void => {
  accountsStore.accounts.forEach((account) => (account.notesString = null))
})

const notesArrToString = (account: IAccount): void => {
  if (account.notes) {
    account.notesString = account.notes.map((note: INote) => note.text).join(';')
  }
}

const notesStringToArr = (account: IAccount): void => {
  if (account.notesString) {
    account.notes = account.notesString.split(';').map((value) => ({ text: value }))
    account.notes = account.notes.filter((note) => note.text)
  }
}

const updateNotesString = (account: IAccount, event: IEvent): void => {
  notesStringToArr(account)
  ;(account.notesString as IEvent) = event
}

const inputUnfocused = (account: IAccount): void => {
  if (!account.notesString) {
    account.notesString = null
    account.notes = null
  }
}
</script>

<template>
  <div class="row q-gutter-x-md items-center no-wrap q-mt-md">
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Метки</div>
    <div class="col-2 text-subtitle2 text-weight-bold text-grey-7">Тип записи</div>
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Логин</div>
    <div class="col text-subtitle2 text-weight-bold text-grey-7">Пароль</div>
  </div>
  <div
    v-for="(account, index) in accountsStore.accounts"
    :key="index"
    class="row q-gutter-x-md items-center no-wrap q-mt-md"
  >
    <div class="col-3">
      <q-input
        placeholder="Значение"
        outlined
        :model-value="account.notesString"
        @update:modelValue="updateNotesString(account, $event)"
        @vue:before-mount="notesArrToString(account)"
        @blur="inputUnfocused(account)"
        dense
      />
    </div>
    <div class="col-2">
      <q-select placeholder="Значение" outlined v-model="account.record" :options="options" dense />
    </div>
    <div class="col">
      <q-input placeholder="Значение" outlined v-model="account.login" dense />
    </div>
    <div class="col" v-if="account.record === 'Локальная'">
      <q-input placeholder="Значение" outlined v-model="account.password" dense :type="isPwd ? 'password' : 'text'">
        <template v-slot:append>
          <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
        </template>
      </q-input>
    </div>
    <q-btn flat color="negative" class="q-pa-xs" icon="delete" />
  </div>
</template>
