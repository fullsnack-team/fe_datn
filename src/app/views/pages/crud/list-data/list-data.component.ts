import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
@Component({
  selector: 'app-list-data',
  templateUrl: './list-data.component.html',
  styleUrls: ['./list-data.component.scss']
})
export class ListDataComponent implements OnInit {

  // @Input() data: T[] = [];
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  
  constructor() { }

  ngOnInit(): void {
  }

  onEdit(id: number): void {
    this.edit.emit(id);
  }

  onDelete(id: number): void {
    this.delete.emit(id);
  }

}
