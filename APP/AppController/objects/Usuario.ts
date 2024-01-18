/* eslint-disable prettier/prettier */
export default class Usuario {
  public id: number;
  public name: string;
  public type: string;
  public phone: string;
  public permission: number[];
  constructor(item: Usuario) {
    this.id = item.id;
    this.name = item.name;
    this.type = item.type;
    this.phone = item.phone;
    this.permission = item.permission;
  }
}
