import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Main',
    isTitle: true,
  },
  {
    label: 'Danh mục',
    icon: 'home',
    link: '/categories/list',
  },
  {
    label: 'Thương hiệu',
    icon: 'target',
    link: '/brands/list',
  },
  {
    label: 'Đơn vị tính',
    icon: 'target',
    link: '/item-units/list',
  },
  {
    label: 'Bảo hành',
    icon: 'home',
    link: '/warranties/list',
  },
  {
    label: 'Nhóm khách hàng',
    icon: 'home',
    link: '/group_customers/list',
  },
  {
    label: 'Khách hàng',
    icon: 'home',
    link: '/customers/list',
  },
  {
    label: 'Nhóm Nhà Cung Cấp',
    icon: 'home',
    link: '/group_suppliers/list',
  },
  {
    label: 'Nhà Cung Cấp',
    icon: 'home',
    link: '/suppliers/list',
  },
  {
    label: 'Sản phẩm',
    icon: 'mail',
    subItems: [
      {
        label: 'Danh sách sản phẩm',
        link: 'products/list',
      }
    ],
  },
  {
    label: "Bán hàng",
    icon: 'home',
    link: 'shop/tabshop'
  },
  { label: 'Chi nhánh', icon: 'target', link: '/locations/list' },
  {
    label: 'Kho & tồn',
    icon: 'target',
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
      // {
      //   label: 'Xuất kho',
      //   link: '/suppliers/list'
      // },
      {
        label: 'Chuyển kho',
        link: '/storage/trans'
      },
    ],
  }
,{
    label: 'Mẫu In',
    icon: 'printer',
    link: '/print'

  },
  {
    label: 'Sổ công nợ',
    icon: 'target',
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
  }
];
