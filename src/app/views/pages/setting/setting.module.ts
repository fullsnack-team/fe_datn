import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {DebtsComponent} from "../debts/debts.component";
import {ListRecoveryComponent} from "../debts/recovery/list/list.component";
import {CreateRecoveryComponent} from "../debts/recovery/create/create.component";
import {EditRecoveryComponent} from "../debts/recovery/edit/edit.component";
import {ListRepayComponent} from "../debts/repay/list/list.component";
import {DetailRepayComponent} from "../debts/repay/detail/detail.component";
import {RepayCreateComponent} from "../debts/repay/create/create.component";
import {PrintfComponent} from "../print/printf/printf.component";
import {SettingComponent} from "./setting.component";

const routes: Routes = [

  {
    path: '',
    component: SettingComponent,
  },
  {
    path: 'locations',
    loadChildren: () =>
      import('../locations/locations.module').then(
        (m) => m.LocationsModule
      ),
  },
  {
    path: 'print',
    loadChildren: () =>
      import('../print/print.module').then((m) => m.PrintModule),
  },
  {
    path: 'config',
    loadChildren: () =>
      import('../config/config.module').then((m) => m.ConfigModule),
  },

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class SettingModule {
}
