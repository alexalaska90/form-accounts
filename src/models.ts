export interface INote {
  text: string
}

export interface IAccount {
  notes: INote[] | null
  record: 'Локальная' | 'LDAP'
  login: string
  password: string
}

export interface IAccountWrapper {
  notesString: string | null
  loginString: string | null
  passwordString: string | null
  isVisible: boolean
}

export type IEvent = string | number | null
