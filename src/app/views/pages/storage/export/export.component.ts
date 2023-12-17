import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { StorageImport } from 'src/app/interface/storage/storage-import';
import { StorageImportService } from 'src/app/service/storage/storage-import.service';
import { LocalStorageService } from 'src/app/service/localStorage/localStorage.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements OnInit {
  isLoading = false;
  listStorageExport: Observable<any>;
  constructor(
    private _storageService: StorageImportService,
    private _localStorage: LocalStorageService
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
        }, 0);
      }, 0);
    });
  }

  addDeleteEventHandlers(): void {
    const deleteButtons = document.getElementsByClassName('btn-success');
    const cancelButtons = document.getElementsByClassName('btn-danger');
    Array.from(deleteButtons).forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = (event.target as Element).getAttribute('id');
        this.deleteLocation(Number(id));
      });
    });
    Array.from(cancelButtons).forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = (event.target as Element).getAttribute('id');
        this.cancel(Number(id));
      });
    });
  }

  cancel(id: any) {
    // console.log('Đã nhấn nút');
    Swal.fire({
      title: 'Bạn có chắc chắn muốn hủy đơn xuất kho?',
      text: 'Bạn sẽ không thể hoàn tác lại hành động này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, tiến hành!',
    }).then((result) => {
      if (result.isConfirmed) {
        const dataSend = {
          trans_type: 1,
        };
        this._storageService.cancel(id, dataSend).subscribe((res) => {
          if (res.status == true) {
            // this.storageTransForm.reset();
            this.showSuccessMessage();
          } else {
            const errorMessages = [];
            if (res.meta && typeof res.meta === 'object') {
              for (const key in res.meta) {
                // errorMessages.push(`${response.meta}`);
                const messages = res.meta[key];
                for (const message of messages) {
                  errorMessages.push(`${key}: ${message}`);
                }
              }
            } else {
              errorMessages.push(`${res.meta}`);
            }
            this.showNextMessage(errorMessages);
          }
        });
      }
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
        // console.log(123);

        // If confirmed, delete the category
        const dataSend = {
          id: id,
          tranType: 1,
        };
        this._storageService.update(dataSend).subscribe(
          (response) => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1000,
              title: 'Thành công!',
              text: 'Cập nhập trạng thái thành công.',
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

  refreshData(): void {
    this.isLoading = true;
    let inventory = this._localStorage.get('location');
    let dataSend = null;
    if (inventory.name != "Tất cả") {
      dataSend = {
        inventory_id: inventory.id,
        trans_type: 1,
      };
    } else {
      dataSend = {
        trans_type: 1,
      };
    }
    this._storageService.getAll(dataSend).subscribe({
      next: (res: any) => {
        // console.log(res.status);
        if (res.status == true) {
          this.listStorageExport = of(res.payload);
          this.isLoading = false;
          // console.log(res.payload);
          this.listStorageExport.subscribe((res) => {
            setTimeout(() => {
              const db = new DataTable('#dataTableExample');
              db.on('datatable.init', () => {
                this.addDeleteEventHandlers();

                db.on('datatable.page', () => {
                  this.addDeleteEventHandlers();
                });
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

  showNextMessage(errorMessages: any) {
    if (errorMessages.length > 0) {
      const message = errorMessages.shift();
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        title: 'Thất bại!',
        text: message,
        icon: 'error',
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
        didClose: () => {
          this.showNextMessage(errorMessages);
        },
      });
    }
  }

  showSuccessMessage() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      title: 'Thành công!',
      text: 'Cập nhật thành công',
      icon: 'success',
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    // this.router.navigate([`../${router}/list`]);
    location.reload();
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
