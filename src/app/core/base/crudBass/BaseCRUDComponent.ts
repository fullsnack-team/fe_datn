import { Input, Output, EventEmitter,Directive } from '@angular/core';

@Directive()
export abstract class BaseCRUDComponent<T> {
  @Input() data: T[] = [];
  @Output() create = new EventEmitter<T>();
  @Output() update = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  onCreate(item: T) {
    this.create.emit(item);
  }

  onUpdate(item: T) {
    this.update.emit(item);
  }

  onDelete(item: T) {
    this.delete.emit(item);
  }
}
