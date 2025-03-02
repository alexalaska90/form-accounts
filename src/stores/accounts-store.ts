import { defineStore } from 'pinia'
import type { IState } from 'src/models'

export const useAccountsStore = defineStore('accounts', {
  state: (): IState => ({
    accounts: [
      {
        notes: [
          {
            text: 'XXX',
          },
          {
            text: 'YYY',
          },
        ],
        record: 'Локальная',
        login: 'test@mail.com',
        password: 'test',
      },
      {
        notes: null,
        record: 'LDAP',
        login: 'hesoyam@mail.com',
        password: 'hesoyam',
      },
    ],
  }),
})
