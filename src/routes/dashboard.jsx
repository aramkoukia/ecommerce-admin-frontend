import Person from '@material-ui/icons/Person';
import NewReleases from '@material-ui/icons/NewReleases';
import Highlight from '@material-ui/icons/Highlight';
import List from '@material-ui/icons/List';
import ListAlt from '@material-ui/icons/ListAlt';
import Money from '@material-ui/icons/Money';
import PlaylistPlay from '@material-ui/icons/PlaylistPlay';
import ContactMail from '@material-ui/icons/ContactMail';
import InsertChart from '@material-ui/icons/InsertChart';
import SettingsBrightness from '@material-ui/icons/SettingsBrightness';
import LocationOn from '@material-ui/icons/LocationOn';
import ScreenLockLandscape from '@material-ui/icons/ScreenLockLandscape';
import Products from '../views/Products/Products';
import Product from '../views/Products/Product';
import Locations from '../views/Locations/Locations';
import AddLocation from '../views/Locations/AddLocation';
import Customers from '../views/Customers/Customers';
import Customer from '../views/Customers/Customer';
import AddCustomer from '../views/Customers/AddCustomer';
import EditCustomer from '../views/Customers/EditCustomer';
import Reports from '../views/Reports/Reports';
import SalesReport from '../views/Reports/SalesReport';
import ProductReport from '../views/Reports/ProductReport';
import ProductTypeReport from '../views/Reports/ProductTypeReport';
import SalesForecastReport from '../views/Reports/SalesForecastReport';
import CustomerReport from '../views/Reports/CustomerReport';
import PaymentReport from '../views/Reports/PaymentReport';
import PurchaseReport from '../views/Reports/PurchaseReport';
import AddOrder from '../views/Orders/AddOrder';
import Orders from '../views/Orders/Orders';
import Discounts from '../views/Discounts/Discounts';
import Taxes from '../views/Taxes/Taxes';
import CustomerStoreCredit from '../views/Customers/CustomerStoreCredit';
import Users from '../views/Users/Users';
import AddUser from '../views/Users/AddUser';
import Inventory from '../views/Inventory/Inventory';
import Purchases from '../views/Purchases/Purchases';
import AddPurchase from '../views/Purchases/AddPurchase';
import Purchase from '../views/Purchases/Purchase';
import SignIn from '../views/Login/Auth';
import { Order } from '../views/Orders/Order';
import { Return } from '../views/Orders/Return';
import Roles from '../views/Roles/Roles';
import Settings from '../views/Settings/Settings';
import UpdateProducts from '../views/Products/UpdateProducts';
import Permissions from '../stores/Permissions';

const dashboardRoutes = [
  {
    path: '/neworder/:id',
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
    path: '/newcustomer',
    sidebarName: 'New Customer',
    navbarName: '',
    icon: ContactMail,
    component: AddCustomer,
    permission: Permissions.ViewCustomers,
  },
  {
    path: '/editcustomer/:id',
    sidebarName: '',
    navbarName: '',
    icon: Person,
    component: EditCustomer,
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
    path: '/addpurchase/:id',
    sidebarName: 'New Purchase',
    navbarName: '',
    icon: Highlight,
    component: AddPurchase,
    permission: Permissions.ViewNewPurchase,
  },
  {
    path: '/updateproducts',
    sidebarName: 'Update Products',
    navbarName: '',
    icon: ListAlt,
    component: UpdateProducts,
    permission: Permissions.ViewPurchases,
  },
  {
    path: '/purchases',
    sidebarName: 'Purchases',
    navbarName: '',
    icon: ListAlt,
    component: Purchases,
    permission: Permissions.ViewPurchases,
  },
  // {
  //   path: '/discounts',
  //   sidebarName: 'Discounts',
  //   navbarName: '',
  //   icon: MoneyOff,
  //   component: Discounts,
  //   permission: Permissions.ViewDiscounts,
  // },
  {
    path: '/reports',
    sidebarName: 'Dashboard',
    navbarName: '',
    icon: InsertChart,
    component: Reports,
    permission: Permissions.ViewReports,
  },
  {
    path: '/salesreport',
    sidebarName: 'Sales Report',
    navbarName: '',
    icon: InsertChart,
    component: SalesReport,
    permission: Permissions.ViewReports,
  },
  {
    path: '/productreport',
    sidebarName: 'Product Report',
    navbarName: '',
    icon: InsertChart,
    component: ProductReport,
    permission: Permissions.ViewReports,
  },
  {
    path: '/producttypereport',
    sidebarName: 'Product Type Report',
    navbarName: '',
    icon: InsertChart,
    component: ProductTypeReport,
    permission: Permissions.ViewReports,
  },
  {
    path: '/customerreport',
    sidebarName: 'Customer Report',
    navbarName: '',
    icon: InsertChart,
    component: CustomerReport,
    permission: Permissions.ViewReports,
  },
  {
    path: '/paymentreport',
    sidebarName: 'Payment Report',
    navbarName: '',
    icon: InsertChart,
    component: PaymentReport,
    permission: Permissions.ViewReports,
  },
  {
    path: '/salesforecastreport',
    sidebarName: 'Sales Forecast',
    navbarName: '',
    icon: InsertChart,
    component: SalesForecastReport,
    permission: Permissions.ViewReports,
  },
  {
    path: '/purchasereport',
    sidebarName: 'Purchase Report',
    navbarName: '',
    icon: InsertChart,
    component: PurchaseReport,
    permission: Permissions.ViewPurchaseReports,
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
    path: '/addlocation',
    sidebarName: 'New Location',
    navbarName: '',
    icon: LocationOn,
    component: AddLocation,
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
    path: '/adduser',
    sidebarName: 'New User',
    navbarName: '',
    icon: Person,
    component: AddUser,
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
    path: '/settings',
    sidebarName: 'Settings',
    navbarName: '',
    icon: SettingsBrightness,
    component: Settings,
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
    path: '/product/:id',
    sidebarName: '',
    navbarName: '',
    icon: Person,
    component: Product,
  },
  {
    path: '/customerstorecredit/:id',
    sidebarName: '',
    navbarName: '',
    icon: ContactMail,
    component: CustomerStoreCredit,
  },
  {
    redirect: true, path: '/', to: '/login', navbarName: 'Redirect',
  },
];

export default dashboardRoutes;
