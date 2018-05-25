import { Gender } from "./gender";

export class User {
  public id: number;
  public firstname: String;
  public lastname: String;
  public username: String;
  public about: String;
  public email: String;
  public mobile: String;
  public gender: Gender;
  public sponsor: String | number | boolean;
  public userImg: any;
  public sponsees: any[];
  public sponsors: any[];
  public role: String;
  public online: String;
  public activated: String;
  public socketId: String;
}