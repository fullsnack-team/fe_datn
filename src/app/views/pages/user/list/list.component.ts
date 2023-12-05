import {Component, OnInit} from '@angular/core';
import {RoleService} from "../../../../service/role/role.service";
import {Role} from "../../../../interface/role/role";
import {UserService} from "../../../../service/user/user.service";
import {AuthService} from "../../../../service/auth/auth.service";
import {User} from "../../../../interface/user/user";
import {DataTable} from "simple-datatables";
import {of} from "rxjs";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  roles: Role[] = [];

  users: any;

  isLoading = false;

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.isLoading = true;
    this.userService.GetData().subscribe({
      next: (res: any) => {
        this.users = of(res.payload);
        setTimeout(() => {
        const db = new DataTable('#dataTableExample');
          db.on('datatable.init', () => {
            // this.addDeleteEventHandlers();
          });
        }, 0)


        // this.users.subscribe(
        //   ()=> {
        //   })

      },
      error: (error: any) => {
      }
    })
  }
}
