import {MenuItem} from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Main',
    isTitle: true,
  },
  {
    label: "Thống kê",
    icon: 'printer',
    link: 'dashboard',
    name: 'dashboard',
  },
  {
    label: "Báo cáo",
    icon: 'printer',
    link: 'report-revenue'
  },
  {
    label: "Bán hàng",
    icon: 'printer',
    link: 'shop/tabshop',
    name: 'shop',
  },
  {
    label: 'Đơn hàng',
    icon: 'shopping-bag',
    name: 'orders',
    subItems: [
      {
        label: 'Danh sách đơn hàng',
        link: 'ListOrders',
      }
    ],
  },
  {
    label: 'Sản phẩm',
    icon: 'tag',
    name: 'products',
    subItems: [
      {
        label: 'Danh sách sản phẩm',
        link: 'products/list',
      },
      {
        label: 'Danh mục',
        // icon: 'home',
        link: '/categories/list',
      },
      {
        label: 'Thương hiệu',
        // icon: 'target',
        link: '/brands/list',
      },
      {
        label: 'Đơn vị tính',
        // icon: 'target',
        link: '/item-units/list',
      },
      {
        label: 'Bảo hành',
        // icon: 'home',
        link: '/warranties/list',
      },
    ],
  },
  // {label: 'Chi nhánh', icon: 'target', link: '/locations/list'},
  {
    label: 'Kho & tồn',
    icon: 'package',
    name: 'storage',
    subItems: [
      // {
      //   label: 'Quản lý kho',
      //   link: '/suppliers/list'
      // },
      {
        label: 'Tồn kho',
        link: '/storage/detail'
      },
      {
        label: 'Nhập kho',
        link: '/storage/import',
      },
      {
        label: 'Xuất kho',
        link: '/storage/export'
      },
      {
        label: 'Chuyển kho',
        link: '/storage/trans'
      },
    ],
  },
  // {
  //   label: 'Mẫu In',
  //   icon: 'printer',
  //   link: '/print'
  //
  // },
  {
    label: 'Khách hàng',
    icon: 'home',
    name: 'customers',
    // link: '/group_suppliers/list',
    subItems: [
      {
        label: 'Khách hàng',
        // icon: 'home',
        link: '/customers/list',
      },
      {
        label: 'Nhóm khách hàng',
        // icon: 'home',
        link: '/group_customers/list',
      },
    ]
  },
  {
    label: 'Nhà cung cấp',
    icon: 'box',
    name: 'suppliers',
    // link: '/group_suppliers/list',
    subItems: [
      {
        label: 'Nhà cung cấp',
        // icon: 'home',
        link: '/suppliers/list',
      },
      {
        label: 'Nhóm nhà cung cấp',
        // icon: 'home',
        link: '/group_suppliers/list',
      }
    ]
  },
  {
    label: 'Sổ công nợ',
    icon: 'target',
    name: 'debts',
    subItems: [
      {
        label: 'Khoản phải thu',
        link: '/debts/recovery/list'
      },
      {
        label: 'Khoản phải trả',
        link: '/debts/repay/list'
      },

    ]
  },
  {
    label: 'Tài khoản nhân viên',
    icon: 'user',
    link: '/users',
    name: 'users',
  },
  {
    label: 'Cấu hình',
    icon: 'settings',
    link: '/setting',
    name: 'settings',
  },
];
