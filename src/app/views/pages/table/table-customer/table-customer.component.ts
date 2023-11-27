import { Component,Input, OnInit  } from '@angular/core';
@Component({
  selector: 'table-customer-data',
  templateUrl: './table-customer.component.html',
  styleUrls: ['./table-customer.component.scss']
})
export class TableCustomerComponent implements OnInit {

  @Input() data: any;
  @Input() title : string;
  @Input() router : string;
  constructor() { }

  ngOnInit(): void {
  }

  getKeys(item : object){
    return Object.keys(item);
  }

  isTimeColumn(columnName: string): boolean {
    return columnName == 'created_date' || 'update_date' ? true : false;
  }

  
  
}
