<script setup lang="ts">
import { reactive } from 'vue'
import { useAccountsStore } from 'src/stores/accounts-store'
import type { INote, IEvent, IAccountWrapper, IAccount } from 'src/models'
import type { ValidationRule } from 'quasar'

const accountsStore = useAccountsStore()
const accounts = accountsStore.accounts

const options = reactive<string[]>(['LDAP', 'Локальная'])
const rules = reactive<ValidationRule[]>([(value) => value.length || 'Заполните поле'])
const wrapper = reactive<IAccountWrapper[]>(
  accountsStore.accounts.map((account: IAccount) => ({
    notesString: account.notes && account.notes.map((note: INote) => note.text).join(';'),
    loginString: account.login,
    passwordString: account.password,
    isVisible: false,
  })),
)

const noFirstSpace = (index: number, event: KeyboardEvent, key: 'login' | 'password') => {
  if (wrapper[index]) {
    if (!wrapper[index][`${key}String`]!.length && event.key === ' ') {
      event.preventDefault();
    }
  }
}

const updateString = (index: number, event: IEvent, key: keyof IAccountWrapper): void => {
  ;(wrapper[index]![key] as IEvent) = event
}

const changeNotes = (account: IAccount, index: number): void => {
  if (wrapper[index]) {
    if (wrapper[index].notesString) {
      account.notes = wrapper[index].notesString.split(';').map((value) => ({
        text: value,
      }))
      account.notes = account.notes.filter((note) => note.text)
    } else account.notes = null
  }
}

const validate = (account: IAccount, index: number, key: 'login' | 'password') => {
  if (wrapper[index] && wrapper[index][`${key}String`]!.length) {
    account[key] = wrapper[index][`${key}String`]!
  }
}

const removeAccount = (index: number) => {
  accounts.splice(index, 1);
  wrapper.splice(index, 1)
}
</script>

<template>
  <div class="row q-gutter-x-md items-start no-wrap q-mt-md q-mb-lg">
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Метки</div>
    <div class="col-2 text-subtitle2 text-weight-bold text-grey-7">Тип записи</div>
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Логин</div>
    <div class="col text-subtitle2 text-weight-bold text-grey-7">Пароль</div>
  </div>
  <div v-for="(account, index) in accounts" :key="index" class="row q-gutter-x-md items-start no-wrap q-mt-md">
    <div class="col-3">
      <q-input
        placeholder="Значение"
        outlined
        :model-value="wrapper[index]!.notesString"
        @update:modelValue="updateString(index, $event, 'notesString')"
        @blur="changeNotes(account, index)"
        @keydown.space.prevent
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
        @blur="validate(account, index, 'login')"
        @keydown="noFirstSpace(index, $event, 'login')"
        :rules="rules"
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
        :type="wrapper[index]!.isVisible ? 'text' : 'password'"
        @blur="validate(account, index, 'password')"
        @keydown="noFirstSpace(index, $event, 'password')"
        :rules="rules"
        maxlength="100"
      >
        <template v-slot:append>
          <q-icon
            :name="wrapper[index]!.isVisible ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            @click="wrapper[index]!.isVisible = !wrapper[index]!.isVisible"
          />
        </template>
      </q-input>
    </div>
    <q-btn @click="removeAccount(index)" flat color="negative" class="q-pa-xs" icon="delete" />
  </div>
</template>
