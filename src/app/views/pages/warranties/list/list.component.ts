import { Component, OnInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { Warranties } from 'src/app/interface/warranties/warranties';
import { WarrantiesService } from 'src/app/service/warranties/warranties.service';
import { Observable,of } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  Warranties: Observable<Warranties[]>;

  constructor(private warrantiesService: WarrantiesService) {
    this.Warranties = new Observable();
  }

  ngOnInit(): void {
    this.refreshCategories();
  }

  ngAfterViewInit(): void {
    this.Warranties.subscribe(() => {
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
        this.warrantiesService.delete(id).subscribe(
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
   this.warrantiesService.GetData().subscribe(
      (response : any) => {
        if(response.status == true){
          this.Warranties =of(response.payload);
          this.Warranties.subscribe((categories) => {
            setTimeout(() => {
                const dataTable = new DataTable('#dataTableExample');
                // Here, use the 'categories' data to populate your DataTable
                // ...
                dataTable.on('datatable.init', () => {
                    this.addDeleteEventHandlers();
                });

                dataTable.on('datatable.page', () => {
                  this.addDeleteEventHandlers();
                });
            }, 0);
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
