<script setup lang="ts">
import { ref, reactive, defineExpose, watch, nextTick, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountsStore } from 'src/stores/accounts-store'
import type { INote, IEvent, IAccountWrapper, IAccount } from 'src/models'
import type { QInput, ValidationRule } from 'quasar'

const { accounts } = storeToRefs(useAccountsStore())

const options = reactive<string[]>(['LDAP', 'Локальная'])
const rules = reactive<ValidationRule[]>([(value) => value?.length || 'Заполните поле'])
const inputRefs = ref<InstanceType<typeof QInput>[]>([])
const unwrappedInputRefs = { inputRefs }
const wrapper = reactive<IAccountWrapper[]>(
  accounts.value.map((account: IAccount) => ({
    notesString: account.notes && account.notes.map((note: INote) => note.text).join(';'),
    loginString: account.login,
    passwordString: account.password,
    isVisible: false,
  })),
)

onMounted(() => {
  if (localStorage.getItem('accounts') === null) {
    localStorage.setItem('accounts', JSON.stringify(accounts.value))
  }
})

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
  validate(account, index, 'login')
  validate(account, index, 'password')
}

const removePassword = (account: IAccount, index: number): void => {
  if (wrapper[index]) {
    account.password = null
    wrapper[index].passwordString = null
  }
}

const removeAccount = (index: number): void => {
  accounts.value.splice(index, 1)
  wrapper.splice(index, 1)
}

const addAccount = async (): Promise<void> => {
  if (inputRefs.value.every((el) => !el.hasError)) {
    accounts.value.push({
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
  await nextTick()
  inputRefs.value.forEach((el) => void el.validate())
}
defineExpose({ addAccount })

watch(accounts.value, async (newValue): Promise<void> => {
  await nextTick()
  inputRefs.value.forEach((el) => void el.validate())
  if (inputRefs.value.every((el) => !el.hasError)) {
    localStorage.setItem('accounts', JSON.stringify(newValue))
  }
})

const thumbStyle = reactive<Partial<CSSStyleDeclaration>>({
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
  <div class="row gt-sm q-gutter-x-md items-start q-mt-md q-mb-md">
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Метки</div>
    <div class="col-2 text-subtitle2 text-weight-bold text-grey-7">Тип записи</div>
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7" style="width: 22.5%">Логин</div>
    <div class="col text-subtitle2 text-weight-bold text-grey-7">Пароль</div>
  </div>
  <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" style="height: 380px">
    <div
      v-for="(account, index) in accounts"
      :key="index"
      class="row q-gutter-x-md items-start q-mt-md q-mb-md-none q-mb-xl fit"
    >
      <div class="col-md-3 col-12">
        <div class="lt-md text-subtitle2 text-weight-bold text-grey-7">Метки</div>
        <q-input
          placeholder="Значение"
          outlined
          :model-value="wrapper[index]?.notesString"
          @update:modelValue="updateString(index, $event, 'notesString')"
          @blur="changeNotes(account, index)"
          @keydown.space.prevent
          dense
          maxlength="50"
        />
      </div>
      <div class="col-md-2 col-12 q-mt-md q-mt-md-none">
        <div class="lt-md text-subtitle2 text-weight-bold text-grey-7">Тип записи</div>
        <q-select
          placeholder="Значение"
          outlined
          v-model="account.record"
          :options="options"
          @update:model-value="removePassword(account, index)"
          dense
        />
      </div>
      <div class="col-md col-12 q-mt-md q-mt-md-none">
        <div class="lt-md text-subtitle2 text-weight-bold text-grey-7">Логин</div>
        <q-input
          :ref="unwrappedInputRefs.inputRefs"
          placeholder="Значение"
          outlined
          :model-value="wrapper[index]?.loginString"
          @update:modelValue="updateString(index, $event, 'loginString')"
          @blur="validateFields(account, index)"
          @keydown.space.prevent
          :rules="rules"
          dense
          maxlength="100"
        />
      </div>
      <div class="col-md col-12" v-if="account.record === 'Локальная'">
        <div class="lt-md text-subtitle2 text-weight-bold text-grey-7">Пароль</div>
        <q-input
          :ref="unwrappedInputRefs.inputRefs"
          placeholder="Значение"
          outlined
          :model-value="wrapper[index]?.passwordString"
          @update:modelValue="updateString(index, $event, 'passwordString')"
          dense
          :type="wrapper[index]?.isVisible ? 'text' : 'password'"
          @blur="validateFields(account, index)"
          @keydown.space.prevent
          :rules="rules"
          maxlength="100"
        >
          <template v-slot:append>
            <q-icon
              :name="wrapper[index]?.isVisible ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="wrapper[index]!.isVisible = !wrapper[index]?.isVisible"
            />
          </template>
        </q-input>
      </div>
      <q-btn @click="removeAccount(index)" flat color="negative" class="gt-sm q-pa-xs" icon="delete" />
      <div class="col-12 lt-md q-mt-sm">
        <q-btn class="full-width" @click="removeAccount(index)" color="negative" icon="delete" />
      </div>
    </div>
  </q-scroll-area>
</template>
