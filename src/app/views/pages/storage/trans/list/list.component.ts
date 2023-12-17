import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { StorageImport } from 'src/app/interface/storage/storage-import';
import { StorageImportService } from 'src/app/service/storage/storage-import.service';
import { LocationsService } from 'src/app/service/locations/locations.service';
import { LocalStorageService } from 'src/app/service/localStorage/localStorage.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit{
  isLoading = false;
  listStorageTrans: Observable<any>;

  inventory: any[] = [];
  codeInventory: number;

  constructor(
    private _storageService: StorageImportService,
    private _locationService: LocationsService,
    private _localStorage: LocalStorageService,
  ) {
    this.listStorageTrans = new Observable();
  }

  ngOnInit(): void {
    this.refreshData(null);
  }

  // ngAfterViewInit(): void {
  //   this.listStorageTrans.subscribe(() => {
  //     setTimeout(() => {
  //       const db = new DataTable('#dataTableExample');
  //       setTimeout(() => {
  //         const db = new DataTable('#dataTableExample');
  //         db.on('datatable.init', () => {
  //           this.addDeleteEventHandlers();
  //         });
  //       }, 0);
  //     }, 0);
  //   });
  // }

  addDeleteEventHandlers(): void {
    const deleteButtons = document.getElementsByClassName('btn-danger');
    Array.from(deleteButtons).forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = (event.target as Element).getAttribute('id');
        this.deleteLocation(Number(id));
      });
    });
  }

  deleteLocation(id: number) {
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
        this._storageService.delete(id).subscribe(
          (response) => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1000,
              title: 'Đã xóa!',
              text: 'Đơn vị đã được xóa.',
              icon: 'success',
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            // Navigate to the list after successful deletion
            setTimeout(() => {
              location.reload();
            }, 1000);
          },
          (error) => {
            if (error.success == false) {
              Swal.fire('Lỗi!', `${error.meta.name}`, 'error');
            }
          }
        );
      }
    });
  }

  refreshData(id: any): void {
    this.isLoading = true;
    let inventory = this._localStorage.get('location');
    let dataSend = null;
    if (inventory.name != "Tất cả") {
      dataSend = {
        inventory_id: inventory.id,
        trans_type: 2,
      };
    } else {
      dataSend = {
        trans_type: 2,
      };
    }
    this._storageService.getAllTrans(dataSend).subscribe({
      next: (res: any) => {
        // console.log(res.status);
        if (res.status == true) {
          this.listStorageTrans = of(res.payload);
          this.isLoading = false;
          // console.log(res.payload);
          this.listStorageTrans.subscribe((res) => {
            setTimeout(() => {
              const db = new DataTable('#dataTableExample');
              db.on('datatable.init', () => {
                this.addDeleteEventHandlers();
              });
            }, 0);
          });
        }
      },
      error: (err: any) => {
        // console.log(err);
        Swal.fire('Lỗi!', 'Có lỗi xảy ra. Vui lòng liên hệ QTV.', 'error');
      },
    });
  }

  status(key: number): any {
    // const result = [];
    if (key == 0) {
      return ['Hủy đơn', 'bg-danger'];
    } else if (key == 1) {
      return ['Chờ xác nhận', 'bg-primary'];
    } else if (key == 2) {
      return ['Hoàn thành', 'bg-success'];
    }
  }
}
