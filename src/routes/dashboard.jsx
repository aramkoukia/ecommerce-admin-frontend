import Person from '@material-ui/icons/Person';
import Highlight from '@material-ui/icons/Highlight';
import Products from '../views/Products/Products';
import Locations from '../views/Locations/Locations';
import Customers from '../views/Customers/Customers';
import Reports from '../views/Reports/Reports';
import AddOrder from '../views/Orders/AddOrder';
import Orders from '../views/Orders/Orders';
import Discounts from '../views/Discounts/Discounts';
import Taxes from '../views/Taxes/Taxes';
import Users from '../views/Users/Users';
import Inventory from '../views/Inventory/Inventory';
// import Purchases from "../views/Purchases/Purchases";
import { SignIn } from '../views/Login/Auth';
import { Order } from '../views/Orders/Order';
import Permissions from '../stores/Permissions';

const dashboardRoutes = [
  {
    path: '/neworder',
    sidebarName: 'New Order',
    navbarName: '',
    icon: Person,
    component: AddOrder,
    permission: Permissions.ViewNewOrder,
  },
  {
    path: '/orders',
    sidebarName: 'Orders',
    navbarName: '',
    icon: Person,
    component: Orders,
    permission: Permissions.ViewOrders,
  },
  {
    path: '/products',
    sidebarName: 'Products',
    navbarName: '',
    icon: Highlight,
    component: Products,
    permission: Permissions.ViewProducts,
  },
  {
    path: '/inventory',
    sidebarName: 'Inventory',
    navbarName: '',
    icon: Highlight,
    component: Inventory,
    permission: Permissions.ViewInventory,
  },
  // {
  //   path: "/purchases",
  //   sidebarName: "Purchases",
  //   navbarName: "Purchases",
  //   icon: Highlight,
  //   component: Purchases,
  //   permission: Permissions.ViewPurchases,
  // },
  {
    path: '/customers',
    sidebarName: 'Customers',
    navbarName: '',
    icon: Person,
    component: Customers,
    permission: Permissions.ViewCustomers,
  },
  {
    path: '/discounts',
    sidebarName: 'Discounts',
    navbarName: '',
    icon: Person,
    component: Discounts,
    permission: Permissions.ViewDiscounts,
  },
  {
    path: '/locations',
    sidebarName: 'Locations',
    navbarName: '',
    icon: Person,
    component: Locations,
    permission: Permissions.ViewLocations,
  },
  {
    path: '/taxes',
    sidebarName: 'Taxes',
    navbarName: '',
    icon: Person,
    component: Taxes,
    permission: Permissions.ViewTaxes,
  },
  {
    path: '/users',
    sidebarName: 'Users',
    navbarName: '',
    icon: Person,
    component: Users,
    permission: Permissions.ViewUsers,
  },
  {
    path: '/reports',
    sidebarName: 'Reports',
    navbarName: '',
    icon: Person,
    component: Reports,
    permission: Permissions.ViewReports,
  },
  {
    path: '/login',
    sidebarName: '',
    navbarName: '',
    icon: Person,
    component: SignIn,
  },
  {
    path: '/order/:id',
    sidebarName: '',
    navbarName: '',
    icon: Person,
    component: Order,
  },
  {
    redirect: true, path: '/', to: '/login', navbarName: 'Redirect',
  },
];

export default dashboardRoutes;
