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
import CustomerStatementSettings from '../views/Settings/CustomerStatementSettings';
import UpdateProducts from '../views/Products/UpdateProducts';
import Permissions from '../stores/Permissions';

const dashboardRoutes = [
  {
    path: '/neworder/:id',
    sidebarName: 'New Order',
    Icon: NewReleases,
    component: AddOrder,
    permission: Permissions.ViewNewOrder,
  },
  {
    path: '/orders',
    sidebarName: 'Orders',
    Icon: List,
    component: Orders,
    permission: Permissions.ViewOrders,
  },
  {
    path: '/products',
    sidebarName: 'Products',
    Icon: Highlight,
    component: Products,
    permission: Permissions.ViewProducts,
  },
  {
    path: '/updateproducts',
    sidebarName: 'Update Products',
    Icon: ListAlt,
    component: UpdateProducts,
    permission: Permissions.ViewPurchases,
  },
  {
    path: '/newcustomer',
    sidebarName: 'New Customer',
    Icon: ContactMail,
    component: AddCustomer,
    permission: Permissions.ViewCustomers,
  },
  {
    path: '/editcustomer/:id',
    sidebarName: '',
    Icon: Person,
    component: EditCustomer,
  },
  {
    path: '/customers',
    sidebarName: 'Customers',
    Icon: ContactMail,
    component: Customers,
    permission: Permissions.ViewCustomers,
  },
  {
    path: '/addpurchase/:id',
    sidebarName: 'New Purchase',
    Icon: Highlight,
    component: AddPurchase,
    permission: Permissions.ViewNewPurchase,
  },
  {
    path: '/purchases',
    sidebarName: 'Purchases',
    Icon: ListAlt,
    component: Purchases,
    permission: Permissions.ViewPurchases,
  },
  {
    sidebarName: 'Reports',
    Icon: Highlight,
    items: [
      {
        path: '/reports',
        sidebarName: 'Dashboard',
        Icon: InsertChart,
        component: Reports,
        permission: Permissions.ViewReports,
      },
      {
        path: '/salesreport',
        sidebarName: 'Sales Report',
        Icon: InsertChart,
        component: SalesReport,
        permission: Permissions.ViewReports,
      },
      {
        path: '/productreport',
        sidebarName: 'Product Report',
        Icon: InsertChart,
        component: ProductReport,
        permission: Permissions.ViewProductReports,
      },
      {
        path: '/producttypereport',
        sidebarName: 'Product Category Report',
        Icon: InsertChart,
        component: ProductTypeReport,
        permission: Permissions.ViewReports,
      },
      {
        path: '/customerreport',
        sidebarName: 'Customer Report',
        Icon: InsertChart,
        component: CustomerReport,
        permission: Permissions.ViewReports,
      },
      {
        path: '/paymentreport',
        sidebarName: 'Payment Report',
        Icon: InsertChart,
        component: PaymentReport,
        permission: Permissions.ViewReports,
      },
      {
        path: '/salesforecastreport',
        sidebarName: 'Sales Forecast',
        Icon: InsertChart,
        component: SalesForecastReport,
        permission: Permissions.ViewReports,
      },
      {
        path: '/purchasereport',
        sidebarName: 'Purchase Report',
        Icon: InsertChart,
        component: PurchaseReport,
        permission: Permissions.ViewPurchaseReports,
      },
      {
        path: '/profitreport',
        sidebarName: 'Profit Report',
        Icon: InsertChart,
        component: ProfitReport,
        permission: Permissions.ViewPurchaseReports,
      },
      {
        path: '/valuereport',
        sidebarName: 'Inventory Value Report',
        Icon: InsertChart,
        component: InventoryValueReport,
        permission: Permissions.ViewPurchaseReports,
      },
      {
        path: '/salesbypurchaseprice',
        sidebarName: 'Sales By Purchase Price Report',
        Icon: InsertChart,
        component: SalesByPurchasePriceReport,
        permission: Permissions.ViewPurchaseReports,
      },
      {
        path: '/productcategories',
        sidebarName: 'Product Categories',
        Icon: Highlight,
        component: ProductCategory,
        permission: Permissions.ViewProducts,
      },
    ],
  },
  {
    sidebarName: 'Settings',
    Icon: Highlight,
    items: [
      {
        path: '/locations',
        sidebarName: 'Locations',
        Icon: LocationOn,
        component: Locations,
        permission: Permissions.ViewLocations,
      },
      {
        path: '/taxes',
        sidebarName: 'Taxes',
        Icon: Money,
        component: Taxes,
        permission: Permissions.ViewTaxes,
      },
      {
        path: '/users',
        sidebarName: 'Users',
        Icon: Person,
        component: Users,
        permission: Permissions.ViewUsers,
      },
      {
        path: '/adduser',
        sidebarName: 'New User',
        Icon: Person,
        component: AddUser,
        permission: Permissions.ViewUsers,
      },
      {
        path: '/roles',
        sidebarName: 'Roles',
        Icon: ScreenLockLandscape,
        component: Roles,
        permission: Permissions.ViewRoles,
      },
      {
        path: '/settings',
        sidebarName: 'Settings',
        Icon: SettingsBrightness,
        component: Settings,
        permission: Permissions.ViewRoles,
      },
      {
        path: '/possettings',
        sidebarName: 'POS Settings',
        Icon: SettingsBrightness,
        component: PosSettings,
        permission: Permissions.ViewRoles,
      },
      {
        path: '/customerstatementsettings',
        sidebarName: 'Statement Settings',
        Icon: SettingsBrightness,
        component: CustomerStatementSettings,
        permission: Permissions.ViewRoles,
      },
      {
        path: '/custom-applications',
        sidebarName: 'Custom Applications',
        Icon: SettingsBrightness,
        component: CustomApplications,
        permission: Permissions.ViewRoles,
      },
      {
        path: '/tags',
        sidebarName: 'Tags',
        Icon: SettingsBrightness,
        component: Tags,
        permission: Permissions.ViewRoles,
      },
    ],
  },
  {
    path: '/login',
    sidebarName: '',
    Icon: Person,
    component: SignIn,
  },
  {
    path: '/order/:id',
    sidebarName: '',
    Icon: Person,
    component: Order,
  },
  {
    path: '/return/:id',
    sidebarName: '',
    Icon: Person,
    component: Return,
  },
  {
    path: '/purchase/:id',
    sidebarName: '',
    Icon: Person,
    component: Purchase,
  },
  {
    path: '/customer/:id',
    sidebarName: '',
    Icon: Person,
    component: Customer,
  },
  {
    path: '/product/:id',
    sidebarName: '',
    Icon: Person,
    component: Product,
  },
  {
    path: '/customerstorecredit/:id',
    sidebarName: '',
    Icon: ContactMail,
    component: CustomerStoreCredit,
  },
  {
    redirect: true,
    path: '/',
    to: '/login',
    navbarName: 'Redirect',
  },
];

export default dashboardRoutes;
