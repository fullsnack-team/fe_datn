import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {PrintfComponent} from "../print/printf/printf.component";
import {ConfigComponent} from "./config.component";

const routes: Routes = [
  {
    path: '',
    component: ConfigComponent,
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ConfigModule {
}
