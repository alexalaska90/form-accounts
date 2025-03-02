export interface INote {
  text: string
}

export interface IAccount {
  notes: INote[] | null
  record: 'Локальная' | 'LDAP'
  login: string
  password: string | null
}

export interface IState {
  accounts: IAccount[]
}