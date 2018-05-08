import { Gender } from "./gender";

export class User {
  public id: number;
  public firstname: String;
  public lastname: String;
  public username: String;
  public email: String;
  public mobile: String;
  public gender: Gender;
  public sponsor: String;
  public imgUrl: String;
  public sponsees: any[];
  public sponsors: any[];
  public role: String;
}