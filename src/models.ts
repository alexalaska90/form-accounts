export interface INote {
  text: string
}

export interface IAccount {
  notesString: string | null
  notes: INote[] | null
  record: 'Локальная' | 'LDAP'
  login: string
  password: string | null
}

export type IEvent = string | number | null
