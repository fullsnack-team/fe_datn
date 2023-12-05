import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrintComponent} from './print.component';
import {PrintfComponent} from './printf/printf.component';
import {EditComponent} from './edit/edit.component';

import {Routes, RouterModule} from '@angular/router';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FeatherIconModule} from 'src/app/core/feather-icon/feather-icon.module';
import {AngularCropperjsModule} from 'angular-cropperjs';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {SortablejsModule} from 'ngx-sortablejs';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {CKEditorModule} from 'ckeditor4-angular';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


const routes: Routes = [
  {
    path: '',
    component: PrintfComponent,
  },
  {
    path: 'edit',
    component: EditComponent
  },
]

@NgModule({
  declarations: [
    PrintComponent,
    PrintfComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    FeatherIconModule,
    AngularCropperjsModule,
    CarouselModule,
    SortablejsModule.forRoot({
      animation: 150,
      ghostClass: 'bg-light',
    }),
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
    CKEditorModule,
    PerfectScrollbarModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class PrintModule {
}
