import {MenuItem} from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Main',
    isTitle: true,
  },
  {
    label: "Thống kê",
    icon: 'activity',
    link: 'dashboard',
    name: 'dashboard',
  },
  {
    label: "Báo cáo",
    icon: 'file-text',
    link: 'report-revenue',
    name: 'dashboard',
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
        link: '/categories/list',
      },
      {
        label: 'Thương hiệu',
        link: '/brands/list',
      },
      {
        label: 'Đơn vị tính',
        link: '/item-units/list',
      },
      {
        label: 'Bảo hành',
        link: '/warranties/list',
      },
    ],
  },
  {
    label: 'Kho & tồn',
    icon: 'package',
    name: 'storage',
    subItems: [
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
  {
    label: 'Khách hàng',
    icon: 'home',
    name: 'customers',
    subItems: [
      {
        label: 'Khách hàng',
        link: '/customers/list',
      },
      {
        label: 'Nhóm khách hàng',
        link: '/group_customers/list',
      },
    ]
  },
  {
    label: 'Nhà cung cấp',
    icon: 'box',
    name: 'suppliers',
    subItems: [
      {
        label: 'Nhà cung cấp',
        link: '/suppliers/list',
      },
      {
        label: 'Nhóm nhà cung cấp',
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
