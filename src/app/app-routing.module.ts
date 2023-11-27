import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BaseComponent} from './views/layout/base/base.component';
import {AuthGuard} from './core/guard/auth.guard';
import {ErrorPageComponent} from './views/pages/error-page/error-page.component';
import {NavbarSellComponent} from './views/layout/baseSell/navbar-sell.component';
import {BaseSpecialComponent} from './views/layout/base-special/base-special.component';
import {EditComponent} from './views/pages/print/edit/edit.component';
import {AuthComponent} from "./views/layout/auth/auth.component";

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    loadChildren: () =>
      import('./views/pages/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'tenant',
    component: AuthComponent,
    loadChildren: () =>
      import('./views/pages/tenant/tenant.module').then((m) => m.TenantModule),
  },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'categories',
        loadChildren: () =>
          import('./views/pages/categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: 'warranties',
        loadChildren: () =>
          import('./views/pages/warranties/warranties.module').then(
            (m) => m.WarrantiesModule
          ),
      },
      {
        path: 'group_customers',
        loadChildren: () =>
          import('./views/pages/group-customers/group-customers.module').then(
            (m) => m.GroupCustomersModule
          ),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./views/pages/customers/customers.module').then(
            (m) => m.CustomersModule
          ),
      },
      {
        path: 'group_suppliers',
        loadChildren: () =>
          import('./views/pages/group_suppliers/group-suppliers.module').then(
            (m) => m.GroupSuppliersModule
          ),
      },
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./views/pages/suppliers/suppliers.module').then(
            (m) => m.SuppliersModule
          ),
      },
      {
        path: 'brands',
        loadChildren: () =>
          import('./views/pages/brands/brands.module').then(
            (m) => m.BrandsModule
          ),
      },
      {
        path: 'item-units',
        loadChildren: () =>
          import('./views/pages/item-units/item-units.module').then(
            (m) => m.ItemUnitsModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./views/pages/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
      {
        path: 'locations',
        loadChildren: () =>
          import('./views/pages/locations/locations.module').then(
            (m) => m.LocationsModule
          ),
      },
      {
        path: 'print',
        loadChildren: () =>
          import('./views/pages/print/print.module').then((m) => m.PrintModule),
      },
      {
        path: 'storage/import',
        loadChildren: () =>
          import('./views/pages/storage/import/import.module').then(
            (m) => m.ImportModule
          ),
      },
      {
        path: 'storage/detail',
        loadChildren: () =>
          import('./views/pages/storage/detail/detail.module').then(
            (m) => m.DetailModule
          ),
      },
      {
        path: 'storage/trans',
        loadChildren: () =>
          import('./views/pages/storage/trans/trans.module').then(
            (m) => m.TransModule
          ),
      },
      {
        path: 'debts',
        loadChildren: () => import('./views/pages/debts/debts.module').then(m => m.DebtsModule)
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'apps',
        loadChildren: () =>
          import('./views/pages/apps/apps.module').then((m) => m.AppsModule),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./views/pages/ui-components/ui-components.module').then(
            (m) => m.UiComponentsModule
          ),
      },
      {
        path: 'advanced-ui',
        loadChildren: () =>
          import('./views/pages/advanced-ui/advanced-ui.module').then(
            (m) => m.AdvancedUiModule
          ),
      },
      {
        path: 'form-elements',
        loadChildren: () =>
          import('./views/pages/form-elements/form-elements.module').then(
            (m) => m.FormElementsModule
          ),
      },
      {
        path: 'advanced-form-elements',
        loadChildren: () =>
          import(
            './views/pages/advanced-form-elements/advanced-form-elements.module'
            ).then((m) => m.AdvancedFormElementsModule),
      },
      {
        path: 'charts-graphs',
        loadChildren: () =>
          import('./views/pages/charts-graphs/charts-graphs.module').then(
            (m) => m.ChartsGraphsModule
          ),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./views/pages/tables/tables.module').then(
            (m) => m.TablesModule
          ),
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/pages/icons/icons.module').then((m) => m.IconsModule),
      },
      {
        path: 'general',
        loadChildren: () =>
          import('./views/pages/general/general.module').then(
            (m) => m.GeneralModule
          ),
      },
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
  },
  {
    path: '',
    component: NavbarSellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'shop',
        loadChildren: () =>
          import('./views/pages/shop/shop.module').then((m) => m.ShopModule),
      }
    ]
  },
  {
    path: '',
    // component: BaseSpecialComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'print/edit',
        component: EditComponent
      }
    ]
  },
  {
    path: 'error',
    component: ErrorPageComponent,
    data: {
      type: 404,
      title: 'Page Not Found',
      desc: "Oopps!! The page you were looking for doesn't exist.",
    },
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent,
  },
  {path: '**', redirectTo: 'error', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
