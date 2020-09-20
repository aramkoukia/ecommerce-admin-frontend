import Person from '@material-ui/icons/Person';
import NewReleases from '@material-ui/icons/NewReleases';
import Highlight from '@material-ui/icons/Highlight';
import List from '@material-ui/icons/List';
import ListAlt from '@material-ui/icons/ListAlt';
import Money from '@material-ui/icons/Money';
import ContactMail from '@material-ui/icons/ContactMail';
import InsertChart from '@material-ui/icons/InsertChart';
import SettingsBrightness from '@material-ui/icons/SettingsBrightness';
import LocationOn from '@material-ui/icons/LocationOn';
import ScreenLockLandscape from '@material-ui/icons/ScreenLockLandscape';
import Products from '../views/Products/Products';
import Tags from '../views/Products/Tags';
import { Product } from '../views/Products/Product';
import ProductCategory from '../views/Products/ProductCategory';
import Locations from '../views/Locations/Locations';
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
import ProfitReport from '../views/Reports/ProfitReport';
import InventoryValueReport from '../views/Reports/InventoryValueReport';
import SalesByPurchasePriceReport from '../views/Reports/SalesByPurchasePriceReport';
import AddOrder from '../views/Orders/AddOrder';
import Orders from '../views/Orders/Orders';
import Taxes from '../views/Taxes/Taxes';
import CustomerStoreCredit from '../views/Customers/CustomerStoreCredit';
import Users from '../views/Users/Users';
import AddUser from '../views/Users/AddUser';
import Purchases from '../views/Purchases/Purchases';
import AddPurchase from '../views/Purchases/AddPurchase';
import { Purchase } from '../views/Purchases/Purchase';
import SignIn from '../views/Login/SignIn';
import { Order } from '../views/Orders/Order';
import { Return } from '../views/Orders/Return';
import Roles from '../views/Roles/Roles';
import Settings from '../views/Settings/Settings';
import PosSettings from '../views/Settings/PosSettings';
import CustomApplications from '../views/CustomApplications/CustomApplications';
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
    permission: Permissions.ViewProductReports,
  },
  {
    path: '/producttypereport',
    sidebarName: 'Product Category Report',
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
    path: '/profitreport',
    sidebarName: 'Profit Report',
    navbarName: '',
    icon: InsertChart,
    component: ProfitReport,
    permission: Permissions.ViewPurchaseReports,
  },
  {
    path: '/valuereport',
    sidebarName: 'Inventory Value Report',
    navbarName: '',
    icon: InsertChart,
    component: InventoryValueReport,
    permission: Permissions.ViewPurchaseReports,
  },
  {
    path: '/salesbypurchaseprice',
    sidebarName: 'Sales By Purchase Price Report',
    navbarName: '',
    icon: InsertChart,
    component: SalesByPurchasePriceReport,
    permission: Permissions.ViewPurchaseReports,
  },
  {
    path: '/productcategories',
    sidebarName: 'Product Categories',
    navbarName: '',
    icon: Highlight,
    component: ProductCategory,
    permission: Permissions.ViewProducts,
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
    path: '/adduser',
    sidebarName: '',
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
    path: '/possettings',
    sidebarName: 'POS Settings',
    navbarName: '',
    icon: SettingsBrightness,
    component: PosSettings,
    permission: Permissions.ViewRoles,
  },
  {
    path: '/custom-applications',
    sidebarName: 'Custom Applications',
    navbarName: '',
    icon: SettingsBrightness,
    component: CustomApplications,
    permission: Permissions.ViewRoles,
  },
  {
    path: '/tags',
    sidebarName: 'Tags',
    navbarName: '',
    icon: SettingsBrightness,
    component: Tags,
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
