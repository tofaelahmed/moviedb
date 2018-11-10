import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { User } from "../../models/user";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient) {}

  getById(id: number) {
    return this.http.get(`${environment.apiUrl}/users/${id}`);
  }

  signup(user: User) {
    return this.http.post(`${environment.apiUrl}/users/signup`, user);
  }

  update(user: User) {
    return this.http.put(`${environment.apiUrl}/users/${user.id}`, user);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
