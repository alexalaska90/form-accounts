import { defineStore } from 'pinia'
import type { IAccount } from 'src/models'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
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
        login: 'aezakmi@mail.com',
        password: 'aezakmi',
      },
      {
        notes: null,
        record: 'LDAP',
        login: 'hesoyam@mail.com',
        password: 'hesoyam',
      },
    ] as IAccount[],
  }),
})
