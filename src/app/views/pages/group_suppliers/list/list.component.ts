import { Component, OnInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { GroupSuppliers } from 'src/app/interface/group_suppliers/group-suppliers';
import { Observable,of } from 'rxjs';
import { GroupSuppliersService } from 'src/app/service/group_suppliers/group-suppliers.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  isLoading = false;

  groupCustomers: Observable<GroupSuppliers[]>;

  constructor(private GroupSuppliersService: GroupSuppliersService) {
    this.groupCustomers = new Observable();
  }

  ngOnInit(): void {
    this.refreshCategories();
  }

  ngAfterViewInit(): void {
    this.groupCustomers.subscribe(() => {
      setTimeout(() => {
        const dataTable = new DataTable('#dataTableExample');
        dataTable.on('datatable.init', () => {
          this.addDeleteEventHandlers();
        });
      }, 0);
    });
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

  // ...

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
        this.GroupSuppliersService.delete(id).subscribe(
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

  refreshCategories(): void {
    this.isLoading = true;
   this.GroupSuppliersService.GetData().subscribe(
      (response : any) => {
        if(response.status == true){
          this.groupCustomers =of(response.payload);
          // console.log(response.payload);

          this.groupCustomers.subscribe((groupCustomers) => {
            setTimeout(() => {
                const dataTable = new DataTable('#dataTableExample');
                dataTable.on('datatable.init', () => {
                    this.addDeleteEventHandlers();
                });

                dataTable.on('datatable.page', () => {
                  this.addDeleteEventHandlers();
                });

                dataTable.on('datatable.sort', () => {
                  this.addDeleteEventHandlers();
                });
            }, 0);
          this.isLoading = false;
        });
        }
        // Navigate to the list after successful deletion
      },
      (error) => {
        Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xóa danh mục.', 'error');
      }
    );

  }
}
