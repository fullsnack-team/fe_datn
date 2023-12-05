import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { Observable,of } from 'rxjs';
import Swal from 'sweetalert2';
import { StorageImport } from 'src/app/interface/storage/storage-import';
import { StorageImportService } from 'src/app/service/storage/storage-import.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  isLoading = false;
  listStorageExport: Observable<any>;
  constructor(
    private _storageService: StorageImportService
  ) {
    this.listStorageExport = new Observable();
   }

   ngOnInit(): void {
    this.refreshData();
  }

  ngAfterViewInit(): void {
    this.listStorageExport.subscribe(() => {
      setTimeout(() => {
        const db = new DataTable('#dataTableExample');
        setTimeout(() => {
          const db = new DataTable('#dataTableExample');
          db.on('datatable.init', () => {
            this.addDeleteEventHandlers();
        });
        }, 0)
      }, 0);
    });
  }

  addDeleteEventHandlers(): void {
    const deleteButtons = document.getElementsByClassName('btn-success');
    Array.from(deleteButtons).forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = (event.target as Element).getAttribute('id');
        this.deleteLocation(Number(id));
      });
    });
  }

  deleteLocation(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xuất kho?',
      text: 'Bạn sẽ không thể hoàn tác lại hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, thực hiện!',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(123);

        // If confirmed, delete the category
        const dataSend = {
          id: id,
          tranType: 1
        }
        this._storageService.update(dataSend).subscribe(
          (response) => {
            Swal.fire({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 1000,
              title: "Thành công!",
              text: "Cập nhập trạng thái thành công.",
              icon: "success",
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });
            // Navigate to the list after successful deletion
            // setTimeout(() => {
            //   location.reload();
            // }, 1000);
          },
          (error) => {
            if(error.success == false){
              Swal.fire('Lỗi!',`${error.meta.name}`, 'error');
            }
          }
        );
      }
    });
  }

  refreshData(): void{
    this.isLoading = true;
    const data ={
      trans_type: 1,
    }
    this._storageService.getAll(data).subscribe({
      next: (res: any) => {
        // console.log(res.status);
        if(res.status == true){
          this.listStorageExport = of(res.payload.data) ;
          this.isLoading = false;
          console.log(res.payload);
          this.listStorageExport.subscribe(
            (res)=> {
              setTimeout(() => {
                const db = new DataTable('#dataTableExample');
                db.on('datatable.init', () => {
                  this.addDeleteEventHandlers();
              });

              }, 0)
            })

        }
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire('Lỗi!', 'Có lỗi xảy ra. Vui lòng liên hệ QTV.', 'error');
      }
    })
  }



  status(key: number): any{
    // const result = [];
    if(key == 0){
       return ['Hủy đơn', 'bg-danger'];
    }else if(key == 1){
      return ['Chờ xác nhận', 'bg-primary'];
    }else if(key == 2){
      return ['Hoàn thành', 'bg-success']
    }

  }

}
