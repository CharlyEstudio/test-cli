import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

// Models
import {UserModel} from '../../../core/services/users/model/user.model';

// Services
import {UsersService} from '../../../core/services/users/users.service';

// PrimeNG
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users: UserModel[] = [];
  display = false;
  first = 0;
  user: UserModel;

  form = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    poblation: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    telephone: new FormControl(0, [Validators.required]),
    email: new FormControl('', [Validators.required]),
  });

  constructor(
    private usersService: UsersService,
    private messageService: MessageService
  ) {
    this.getUsers();
  }

  ngOnInit(): void {
  }

  getUsers(reload?: boolean) {
    if (reload) {
      this.users = [];
    }

    this.usersService.getUsers().subscribe((users: any) => {
      if (users.status) {
        this.users = users.payload;
      } else {
        this.users = [];
        this.addSingle('warn', 'All Users', users.payload);
      }
    }, err => {
      console.log(err);
      this.addSingle('error', 'All Users', err.message);
    });
  }

  reset() {
    this.first = 0;
  }

  addSingle(severity: string, summary: string, detail: string) {
    this.messageService.add({severity, summary, detail});
  }

  clear() {
    this.messageService.clear();
  }

  addUser() {
    this.display = true;
  }

  async onSubmit() {
    if (this.form.status === 'INVALID') {
      this.addSingle('warn', 'Add User', 'All field');
      return;
    }

    const user: UserModel = new UserModel();
    const userForm = this.form.value;
    user.code = userForm.code;
    user.name = userForm.name;
    user.address = userForm.address;
    user.poblation = userForm.poblation;
    user.postalCode = userForm.postalCode;
    user.city = userForm.city;
    user.telephone = userForm.telephone;
    user.email = userForm.email;

    if (!this.user) {
      this.usersService.addUser(user).subscribe((userRes: any) => {
        if (userRes.status) {
          this.addSingle('success', 'Add User', 'Success');
          this.form.reset();
          this.display = false;
          this.getUsers();
        } else {
          this.addSingle('error', 'Add User', userRes.payload);
        }
      }, err => {
        console.log(err);
        this.addSingle('error', 'Add User', err.message);
      });
    } else {
      user.id = this.user.id;
      this.usersService.updateUser(user).subscribe((userRes: any) => {
        if (userRes.status) {
          this.addSingle('success', 'Update User', 'Success');
          this.form.reset();
          this.display = false;
          this.getUsers();
        } else {
          this.addSingle('error', 'Update User', userRes.payload);
        }
      }, err => {
        console.log(err);
        this.addSingle('error', 'Update User', err.message);
      });
    }
  }

  updateUser(user: UserModel) {
    this.user = user;
    this.form.setValue({
      code: user.code,
      name: user.name,
      address: user.address,
      poblation: user.poblation,
      postalCode: user.postalCode,
      city: user.city,
      telephone: user.telephone,
      email: user.email,
    });
    this.display = true;
  }

  deleteUser(user: UserModel) {
    this.usersService.deleteUser(user.id).subscribe(res => {
      this.addSingle('success', 'Delete User', 'Success');
      this.getUsers();
    }, err => {
      console.log(err);
      this.addSingle('error', 'Delete User', err.message);
    });
  }
}
