<script setup lang="ts">
import { ref, reactive, defineExpose } from 'vue'
import { useAccountsStore } from 'src/stores/accounts-store'
import type { INote, IEvent, IAccountWrapper, IAccount } from 'src/models'
import type { QInput, ValidationRule } from 'quasar'

const accountsStore = useAccountsStore()
const accounts = accountsStore.accounts

const options = reactive<string[]>(['LDAP', 'Локальная'])
const rules = reactive<ValidationRule[]>([(value) => value?.length || 'Заполните поле'])
const inputRefs = ref<InstanceType<typeof QInput>[]>([])
const unwrappedInputRefs = { inputRefs }
const wrapper = reactive<IAccountWrapper[]>(
  accountsStore.accounts.map((account: IAccount) => ({
    notesString: account.notes && account.notes.map((note: INote) => note.text).join(';'),
    loginString: account.login,
    passwordString: account.password,
    isVisible: false,
  })),
)

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
  if (wrapper[index] && wrapper[index][`${key}String`]?.length) {
    account[key] = wrapper[index][`${key}String`]!
  }
}

const validateFields = (account: IAccount, index: number) => {
  inputRefs.value.forEach((el) => void el.validate())
  validate(account, index, 'login')
  validate(account, index, 'password')
}

const removeAccount = (index: number) => {
  accounts.splice(index, 1)
  wrapper.splice(index, 1)
}

const addAccount = (): void => {
  inputRefs.value.forEach((el) => void el.validate())
  if (inputRefs.value.every((el) => !el.hasError)) {
    accounts.push({
      notes: null,
      record: 'Локальная',
      login: null,
      password: null,
    })
    wrapper.push({
      notesString: null,
      loginString: null,
      passwordString: null,
      isVisible: false,
    })
  }
}
defineExpose({ addAccount })

const thumbStyle = reactive<Partial<CSSStyleDeclaration>>({
  right: '4px',
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '5px',
  opacity: '0.75',
})
const barStyle = reactive<Partial<CSSStyleDeclaration>>({
  opacity: '0',
})
</script>

<template>
  <div class="row q-gutter-x-md items-start no-wrap q-mt-md q-mb-lg">
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Метки</div>
    <div class="col-2 text-subtitle2 text-weight-bold text-grey-7">Тип записи</div>
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Логин</div>
    <div class="col text-subtitle2 text-weight-bold text-grey-7">Пароль</div>
  </div>
  <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 380px">
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
          :ref="unwrappedInputRefs.inputRefs"
          placeholder="Значение"
          outlined
          :model-value="wrapper[index]!.loginString"
          @update:modelValue="updateString(index, $event, 'loginString')"
          @blur="validateFields(account, index)"
          @keydown.space.prevent
          :rules="rules"
          dense
          maxlength="100"
        />
      </div>
      <div class="col" v-if="account.record === 'Локальная'">
        <q-input
          :ref="unwrappedInputRefs.inputRefs"
          placeholder="Значение"
          outlined
          :model-value="wrapper[index]!.passwordString"
          @update:modelValue="updateString(index, $event, 'passwordString')"
          dense
          :type="wrapper[index]!.isVisible ? 'text' : 'password'"
          @blur="validateFields(account, index)"
          @keydown.space.prevent
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
  </q-scroll-area>
</template>
