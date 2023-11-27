import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { ProductsService } from 'src/app/service/products/products.service';
import { Products } from 'src/app/interface/products/products';
import { Observable,of } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  ListsProducts: Observable<Products[]>;

  constructor(private ProductsService: ProductsService) {
    this.ListsProducts = new Observable();
  }

  ngOnInit(): void {
    this.refreshCategories();
  }

  ngAfterViewInit(): void {
    this.ListsProducts.subscribe(() => {
      setTimeout(() => {
        const dataTable = new DataTable('#dataTableExamples',{
          "sortable": false // this will disable sorting (assuming "sortable" is the correct option)
      });
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
        this.ProductsService.delete(id).subscribe(
          (response) => {

            Swal.fire('Đã xóa!', 'Danh mục của bạn đã được xóa.', 'success');
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
   this.ProductsService.GetData().subscribe(
      (response : any) => {
        if(response.status == true){
          this.ListsProducts =of(response.payload.data);
          // console.log(this.ListsCategories);
          console.log(this.ListsProducts);
          
          this.ListsProducts.subscribe((categories) => {
            setTimeout(() => {
                const dataTable = new DataTable('#dataTableExamples');
                // Here, use the 'categories' data to populate your DataTable
                // ...
                dataTable.on('datatable.init', () => {
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
