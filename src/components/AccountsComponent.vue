<script setup lang="ts">
import { ref, reactive } from 'vue'

const text = ref<string>('')

const model = ref<string>('Локальная')
const options = reactive<string[]>(['Локальная', 'LDAP'])
const isPwd = ref<boolean>(true)
</script>

<template>
  <div class="row q-gutter-x-md items-center no-wrap q-mt-md">
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Метки</div>
    <div class="col-2 text-subtitle2 text-weight-bold text-grey-7">Тип записи</div>
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Логин</div>
    <div class="col-3 text-subtitle2 text-weight-bold text-grey-7">Пароль</div>
    <div class="col-1"></div>
  </div>
  <div class="row q-gutter-x-md items-center no-wrap q-mt-md">
    <div class="col-3">
      <q-input placeholder="Значение" outlined v-model="text" dense />
    </div>
    <div class="col-2">
      <q-select placeholder="Значение" outlined v-model="model" :options="options" dense />
    </div>
    <div class="col-3">
      <q-input placeholder="Значение" outlined v-model="text" dense />
    </div>
    <div class="col-3">
      <q-input placeholder="Значение" outlined v-model="text" dense :type="isPwd ? 'password' : 'text'">
        <template v-slot:append>
          <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
        </template>
      </q-input>
    </div>
    <div class="col-1">
      <q-btn flat color="negative" class="q-pa-xs" icon="delete" />
    </div>
  </div>
</template>
