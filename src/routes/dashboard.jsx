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

const dashboardRoutes = [
  {
    path: '/neworder',
    sidebarName: 'New Order',
    navbarName: '',
    icon: Person,
    component: AddOrder,
  },
  {
    path: '/orders',
    sidebarName: 'Orders',
    navbarName: '',
    icon: Person,
    component: Orders,
  },
  {
    path: '/products',
    sidebarName: 'Products',
    navbarName: '',
    icon: Highlight,
    component: Products,
  },
  {
    path: '/inventory',
    sidebarName: 'Inventory',
    navbarName: '',
    icon: Highlight,
    component: Inventory,
  },
  // {
  //   path: "/purchases",
  //   sidebarName: "Purchases",
  //   navbarName: "Purchases",
  //   icon: Highlight,
  //   component: Purchases
  // },
  {
    path: '/customers',
    sidebarName: 'Customers',
    navbarName: '',
    icon: Person,
    component: Customers,
  },
  {
    path: '/discounts',
    sidebarName: 'Discounts',
    navbarName: '',
    icon: Person,
    component: Discounts,
  },
  {
    path: '/locations',
    sidebarName: 'Locations',
    navbarName: '',
    icon: Person,
    component: Locations,
  },
  {
    path: '/taxes',
    sidebarName: 'Taxes',
    navbarName: '',
    icon: Person,
    component: Taxes,
  },
  {
    path: '/users',
    sidebarName: 'Users',
    navbarName: '',
    icon: Person,
    component: Users,
  },
  {
    path: '/reports',
    sidebarName: 'Reports',
    navbarName: '',
    icon: Person,
    component: Reports,
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
