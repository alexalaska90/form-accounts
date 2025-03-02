<script setup lang="ts">
import { reactive } from 'vue'
import { useAccountsStore } from 'src/stores/accounts-store'
import type { INote, IEvent, IAccountWrapper, IAccount } from 'src/models'

const accountsStore = useAccountsStore()
const accounts = accountsStore.accounts

const options = reactive<string[]>(['LDAP', 'Локальная'])
const wrapper = reactive<IAccountWrapper[]>(
  accountsStore.accounts.map((account) => ({
    notesString: account.notes && account.notes.map((note: INote) => note.text).join(';'),
    loginString: account.login,
    passwordString: account.password,
    isPwd: true,
  })),
)

const updateString = (index: number, event: IEvent, key: keyof IAccountWrapper): void => {
  ;(wrapper[index]![key] as IEvent) = event
}

const inputUnfocused = (account: IAccount, index: number): void => {
  if (wrapper[index]) {
    if (wrapper[index].notesString) {
      account.notes = wrapper[index].notesString.split(';').map((value) => ({
        text: value,
      }))
      account.notes = account.notes.filter((note) => note.text)
    } else account.notes = null

    if (wrapper[index].loginString) {
      account.login = wrapper[index].loginString
    } else account.login = ''

    if (wrapper[index].passwordString) {
      account.password = wrapper[index].passwordString
    } else account.password = ''
  }

  console.log(account)
}
</script>

<template>
  <div class="row q-gutter-x-md items-center no-wrap q-mt-md">
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Метки</div>
    <div class="col-2 text-subtitle2 text-weight-bold text-grey-7">Тип записи</div>
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Логин</div>
    <div class="col text-subtitle2 text-weight-bold text-grey-7">Пароль</div>
  </div>
  <div v-for="(account, index) in accounts" :key="index" class="row q-gutter-x-md items-center no-wrap q-mt-md">
    <div class="col-3">
      <q-input
        placeholder="Значение"
        outlined
        :model-value="wrapper[index]!.notesString"
        @update:modelValue="updateString(index, $event, 'notesString')"
        @blur="inputUnfocused(account, index)"
        dense
        maxlength="50"
      />
    </div>
    <div class="col-2">
      <q-select placeholder="Значение" outlined v-model="account.record" :options="options" dense />
    </div>
    <div class="col">
      <q-input
        placeholder="Значение"
        outlined
        :model-value="wrapper[index]!.loginString"
        @update:modelValue="updateString(index, $event, 'loginString')"
        @blur="inputUnfocused(account, index)"
        dense
        maxlength="100"
      />
    </div>
    <div class="col" v-if="account.record === 'Локальная'">
      <q-input
        placeholder="Значение"
        outlined
        :model-value="wrapper[index]!.passwordString"
        @update:modelValue="updateString(index, $event, 'passwordString')"
        dense
        :type="wrapper[index]!.isPwd ? 'password' : 'text'"
        @blur="inputUnfocused(account, index)"
        maxlength="100"
      >
        <template v-slot:append>
          <q-icon
            :name="wrapper[index]!.isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="wrapper[index]!.isPwd = !wrapper[index]!.isPwd"
          />
        </template>
      </q-input>
    </div>
    <q-btn flat color="negative" class="q-pa-xs" icon="delete" />
  </div>
</template>
