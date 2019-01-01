import Person from '@material-ui/icons/Person';
import NewReleases from '@material-ui/icons/NewReleases';
import Highlight from '@material-ui/icons/Highlight';
import List from '@material-ui/icons/List';
import ListAlt from '@material-ui/icons/ListAlt';
import Money from '@material-ui/icons/Money';
import PlaylistPlay from '@material-ui/icons/PlaylistPlay';
import ContactMail from '@material-ui/icons/ContactMail';
import InsertChart from '@material-ui/icons/InsertChart';
import MoneyOff from '@material-ui/icons/MoneyOff';
import LocationOn from '@material-ui/icons/LocationOn';
import ScreenLockLandscape from '@material-ui/icons/ScreenLockLandscape';
import Products from '../views/Products/Products';
import Locations from '../views/Locations/Locations';
import Customers from '../views/Customers/Customers';
import Customer from '../views/Customers/Customer';
import Reports from '../views/Reports/Reports';
import AddOrder from '../views/Orders/AddOrder';
import Orders from '../views/Orders/Orders';
import Discounts from '../views/Discounts/Discounts';
import Taxes from '../views/Taxes/Taxes';
import Users from '../views/Users/Users';
import Inventory from '../views/Inventory/Inventory';
import Purchases from '../views/Purchases/Purchases';
import AddPurchase from '../views/Purchases/AddPurchase';
import Purchase from '../views/Purchases/Purchase';
import SignIn from '../views/Login/Auth';
import { Order } from '../views/Orders/Order';
import { Return } from '../views/Orders/Return';
import Roles from '../views/Roles/Roles';
import Permissions from '../stores/Permissions';

const dashboardRoutes = [
  {
    path: '/neworder',
    sidebarName: 'New Order',
    navbarName: '',
    icon: NewReleases,
    component: AddOrder,
    permission: Permissions.ViewNewOrder,
  },
  {
    path: '/orders',
    sidebarName: 'Orders',
    navbarName: '',
    icon: List,
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
    icon: PlaylistPlay,
    component: Inventory,
    permission: Permissions.ViewInventory,
  },
  {
    path: '/customers',
    sidebarName: 'Customers',
    navbarName: '',
    icon: ContactMail,
    component: Customers,
    permission: Permissions.ViewCustomers,
  },
  {
    path: '/reports',
    sidebarName: 'Reports',
    navbarName: '',
    icon: InsertChart,
    component: Reports,
    permission: Permissions.ViewReports,
  },
  {
    path: '/addpurchase',
    sidebarName: 'New Purchase',
    navbarName: '',
    icon: Highlight,
    component: AddPurchase,
    permission: Permissions.ViewNewPurchase,
  },
  {
    path: '/purchases',
    sidebarName: 'Purchases',
    navbarName: '',
    icon: ListAlt,
    component: Purchases,
    permission: Permissions.ViewPurchases,
  },
  {
    path: '/discounts',
    sidebarName: 'Discounts',
    navbarName: '',
    icon: MoneyOff,
    component: Discounts,
    permission: Permissions.ViewDiscounts,
  },
  {
    path: '/locations',
    sidebarName: 'Locations',
    navbarName: '',
    icon: LocationOn,
    component: Locations,
    permission: Permissions.ViewLocations,
  },
  {
    path: '/taxes',
    sidebarName: 'Taxes',
    navbarName: '',
    icon: Money,
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
    path: '/roles',
    sidebarName: 'Roles',
    navbarName: '',
    icon: ScreenLockLandscape,
    component: Roles,
    permission: Permissions.ViewRoles,
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
    path: '/return/:id',
    sidebarName: '',
    navbarName: '',
    icon: Person,
    component: Return,
  },
  {
    path: '/purchase/:id',
    sidebarName: '',
    navbarName: '',
    icon: Person,
    component: Purchase,
  },
  {
    path: '/customer/:id',
    sidebarName: '',
    navbarName: '',
    icon: Person,
    component: Customer,
  },
  {
    redirect: true, path: '/', to: '/login', navbarName: 'Redirect',
  },
];

export default dashboardRoutes;
