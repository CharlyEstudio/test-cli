import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

// Models
import {UserModel} from './model/user.model';

const URL_PROVIDER = environment.instance;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private http: HttpClient
  ) { }

  getUsers() {
    return this.http.get(`${URL_PROVIDER}/users`);
  }

  getUser(id: number) {
    return this.http.get(`${URL_PROVIDER}/users/${id}`);
  }

  addUser(user: UserModel) {
    return this.http.post(`${URL_PROVIDER}/users`, user);
  }

  updateUser(user: UserModel) {
    return this.http.put(`${URL_PROVIDER}/users`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`${URL_PROVIDER}/users/${id}`);
  }
}
