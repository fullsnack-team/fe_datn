import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';
import { ItemUnits } from 'src/app/interface/item_units/item-units';
import { ItemUnitsService } from 'src/app/service/item_units/item-units.service';

@Component({
  selector: 'app-item-units-list',
  templateUrl: './item-units-list.component.html',
  styleUrls: ['./item-units-list.component.scss'],
})
export class ItemUnitsListComponent implements OnInit, AfterViewInit {
  listUnits: Observable<ItemUnits[]>;
  isLoading = false;
  constructor(private _unitsService: ItemUnitsService) {
    this.listUnits = new Observable();
  }

  ngOnInit(): void {
    this.refreshData();
  }

  ngAfterViewInit(): void {
    this.listUnits.subscribe(() => {
      // setTimeout(() => {
      //   // const db = new DataTable('#dataTableExample');
      //   setTimeout(() => {
      //     // const db = new DataTable('#dataTableExample');
      //     //   db.on('datatable.init', () => {
      //     //     this.addDeleteEventHandlers();
      //     // });

      //   }, 0);
      // }, 0);
    });
  }

  addDeleteEventHandlers(): void {
    const deleteButtons = document.getElementsByClassName('btn-danger');
    Array.from(deleteButtons).forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = (event.target as Element).getAttribute('id');
        this.deleteItem(Number(id));
      });
    });
  }

  // ...

  deleteItem(id: number) {
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
        this._unitsService.delete(id).subscribe(
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

  refreshData(): void {
    this.isLoading = true;
    
    this._unitsService.GetData().subscribe({
      next: (res: any) => {
        // console.log(res.status);
        if (res.status == true) {
          this.listUnits = of(res.payload);
          // console.log(this.listBrands);
          this.isLoading = false;
          this.listUnits.subscribe((res) => {
            setTimeout(() => {
              const db = new DataTable('#dataTableExample');
              db.on('datatable.init', () => {
                this.addDeleteEventHandlers();
              });

              db.on('datatable.page', () => {
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
}
