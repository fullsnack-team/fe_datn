import {Component, OnInit} from '@angular/core';
import {RoleService} from "../../../../service/role/role.service";
import {Role} from "../../../../interface/role/role";
import {UserService} from "../../../../service/user/user.service";
import {AuthService} from "../../../../service/auth/auth.service";
import {User} from "../../../../interface/user/user";
import {DataTable} from "simple-datatables";
import {of} from "rxjs";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  roles: Role[] = [];

  users: any[] = [];

  isLoading = false;

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.getUsers();
  }

  addDeleteEventHandlers(): void {
    const deleteButtons = document.getElementsByClassName('btn-danger');
    Array.from(deleteButtons).forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = (event.target as Element).getAttribute('id');
        this.deleteCategory(Number(id));
      });
    });
  }

  deleteCategory(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Bạn sẽ không thể hoàn tác lại hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, xóa nó!',
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, delete the category
        this.userService.delete(id).subscribe(
          (response) => {
            Swal.fire({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              title: "Thành công!",
              text: "Danh mục bảo hành của bạn đã được xóa.",
              icon: "success",
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });
            // Navigate to the list after successful deletion
            location.reload();
          },
          (error) => {
            Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xóa danh mục.', 'error');
          }
        );
      }
    });
  }

  getUsers() {
    this.isLoading = true;
    this.userService.GetData().subscribe({
      next: (res: any) => {
        this.users = res.payload;
        // console.log(res.payload);
        setTimeout(() => {
        const db = new DataTable('#dataTableExample');
          db.on('datatable.init', () => {
            this.addDeleteEventHandlers();
          });

          db.on('datatable.page', () => {
            this.addDeleteEventHandlers();
          });
        }, 0)
        this.isLoading = false;
      },
      error: (error: any) => {
      }
    })
  }
}
