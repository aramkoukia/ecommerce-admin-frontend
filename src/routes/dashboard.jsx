import Person from '@material-ui/icons/Person';
import NewReleases from '@material-ui/icons/NewReleases';
import Highlight from '@material-ui/icons/Highlight';
import List from '@material-ui/icons/List';
import ListAlt from '@material-ui/icons/ListAlt';
import Money from '@material-ui/icons/Money';
import ContactMail from '@material-ui/icons/ContactMail';
import InsertChart from '@material-ui/icons/InsertChart';
import VpnKey from '@material-ui/icons/VpnKey';
import BubbleChart from '@material-ui/icons/BubbleChart';
import MultilineChart from '@material-ui/icons/MultilineChart';
import Assessment from '@material-ui/icons/Assessment';
import PersonAdd from '@material-ui/icons/PersonAdd';
import PeopleAlt from '@material-ui/icons/PeopleAlt';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import PictureAsPdf from '@material-ui/icons/PictureAsPdf';
import Drafts from '@material-ui/icons/Drafts';
import SettingsCell from '@material-ui/icons/SettingsCell';
import LocalOffer from '@material-ui/icons/LocalOffer';
import CenterFocusWeak from '@material-ui/icons/CenterFocusWeak';
import CreateNewFolder from '@material-ui/icons/CreateNewFolder';
import SettingsApplications from '@material-ui/icons/SettingsApplications';
import DynamicFeed from '@material-ui/icons/DynamicFeed';
import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
import Book from '@material-ui/icons/Book';
import Language from '@material-ui/icons/Language';
import Equalizer from '@material-ui/icons/Equalizer';
import TrendingUp from '@material-ui/icons/TrendingUp';
import TableChart from '@material-ui/icons/TableChart';
import PieChart from '@material-ui/icons/PieChart';
import Tune from '@material-ui/icons/Tune';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import SettingsBrightness from '@material-ui/icons/SettingsBrightness';
import LocationOn from '@material-ui/icons/LocationOn';
import ScreenLockLandscape from '@material-ui/icons/ScreenLockLandscape';
import Products from '../views/Products/Products';
import Tags from '../views/Products/Tags';
import { Product } from '../views/Products/Product';
import ProductCategory from '../views/Products/ProductCategory';
import UpdateWebsiteProducts from '../views/Products/UpdateWebsiteProducts';
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
import AwaitingPayments from '../views/Customers/AwaitingPayments';
import Roles from '../views/Roles/Roles';
import Settings from '../views/Settings/Settings';
import PosSettings from '../views/Settings/PosSettings';
import CustomApplications from '../views/CustomApplications/CustomApplications';
import CustomerStatementSettings from '../views/Settings/CustomerStatementSettings';
import InvoiceEmailPrintSettings from '../views/Settings/InvoiceEmailPrintSettings';
import UpdateProducts from '../views/Products/UpdateProducts';
import WebsiteSlider from '../views/WebsiteSliders/WebsiteSlider';
import BlogPosts from '../views/BlogPosts/BlogPosts';
import WebsiteAbout from '../views/Website/WebsiteAbout';
import WebsiteAboutPopOver from '../views/Website/WebsiteAboutPopOver';
import WebsiteFaq from '../views/Website/WebsiteFaq';
import LoginHistory from '../views/LoginHistory/LoginHistory';
import Permissions from '../stores/Permissions';

const dashboardRoutes = [
  {
    path: '/neworder/:id',
    sidebarName: 'New Order',
    Icon: NewReleases,
    component: AddOrder,
    needsPermission: true,
    permission: Permissions.ViewNewOrder,
  },
  {
    path: '/orders',
    sidebarName: 'Orders',
    Icon: List,
    component: Orders,
    needsPermission: true,
    permission: Permissions.ViewOrders,
  },
  {
    path: '/products',
    sidebarName: 'Products',
    Icon: SpeakerNotes,
    component: Products,
    needsPermission: true,
    permission: Permissions.ViewProducts,
  },
  {
    path: '/updateproducts',
    sidebarName: 'Update Products',
    Icon: DynamicFeed,
    component: UpdateProducts,
    needsPermission: true,
    permission: Permissions.UpdateProducts,
  },
  {
    path: '/newcustomer',
    sidebarName: 'New Customer',
    Icon: PersonAdd,
    component: AddCustomer,
    needsPermission: true,
    permission: Permissions.ViewCustomers,
  },
  {
    path: '/editcustomer/:id',
    sidebarName: '',
    Icon: Person,
    needsPermission: false,
    component: EditCustomer,
  },
  {
    path: '/customers',
    sidebarName: 'Customers',
    Icon: ContactMail,
    component: Customers,
    needsPermission: true,
    permission: Permissions.ViewCustomers,
  },
  {
    path: '/awaiting-payments',
    sidebarName: 'Awaiting Payments',
    Icon: ContactMail,
    component: AwaitingPayments,
    needsPermission: true,
    permission: Permissions.ViewCustomers,
  },
  {
    path: '/addpurchase/:id',
    sidebarName: 'New Purchase',
    Icon: CreateNewFolder,
    component: AddPurchase,
    needsPermission: true,
    permission: Permissions.ViewNewPurchase,
  },
  {
    path: '/purchases',
    sidebarName: 'Purchases',
    Icon: ListAlt,
    component: Purchases,
    needsPermission: true,
    permission: Permissions.ViewPurchases,
  },
  {
    sidebarName: 'Reports',
    Icon: PieChart,
    needsPermission: true,
    permission: Permissions.ViewReportsMenu,
    items: [
      {
        path: '/reports',
        sidebarName: 'Dashboard',
        Icon: InsertChart,
        component: Reports,
        needsPermission: true,
        permission: Permissions.ViewDashboardReport,
      },
      {
        path: '/salesreport',
        sidebarName: 'Sales Report',
        Icon: Tune,
        component: SalesReport,
        needsPermission: true,
        permission: Permissions.ViewSalesReport,
      },
      {
        path: '/productreport',
        sidebarName: 'Product Report',
        Icon: PieChart,
        needsPermission: true,
        component: ProductReport,
        permission: Permissions.ViewProductReports,
      },
      {
        path: '/producttypereport',
        sidebarName: 'Product Category Report',
        Icon: TableChart,
        needsPermission: true,
        component: ProductTypeReport,
        permission: Permissions.ViewProductCategoryReport,
      },
      {
        path: '/customerreport',
        sidebarName: 'Customer Report',
        Icon: TrendingUp,
        component: CustomerReport,
        needsPermission: true,
        permission: Permissions.ViewCustomerReport,
      },
      {
        path: '/paymentreport',
        sidebarName: 'Payment Report',
        Icon: Equalizer,
        component: PaymentReport,
        needsPermission: true,
        permission: Permissions.ViewPaymentReport,
      },
      {
        path: '/salesforecastreport',
        sidebarName: 'Sales Forecast',
        Icon: Assessment,
        component: SalesForecastReport,
        needsPermission: true,
        permission: Permissions.ViewSalesForecast,
      },
      {
        path: '/purchasereport',
        sidebarName: 'Purchase Report',
        Icon: ScreenLockLandscape,
        component: PurchaseReport,
        needsPermission: true,
        permission: Permissions.ViewPurchaseReports,
      },
      {
        path: '/profitreport',
        sidebarName: 'Profit Report',
        Icon: MultilineChart,
        component: ProfitReport,
        needsPermission: true,
        permission: Permissions.ViewProfitReport,
      },
      {
        path: '/valuereport',
        sidebarName: 'Inventory Value Report',
        Icon: BubbleChart,
        component: InventoryValueReport,
        needsPermission: true,
        permission: Permissions.ViewValueReport,
      },
      {
        path: '/salesbypurchaseprice',
        sidebarName: 'Sales By Purchase Price Report',
        Icon: InsertChart,
        component: SalesByPurchasePriceReport,
        needsPermission: true,
        permission: Permissions.ViewSalesByPurchasePriceReport,
      },
    ],
  },
  {
    sidebarName: 'Administration',
    Icon: SupervisorAccount,
    needsPermission: true,
    permission: Permissions.ViewAdministration,
    items: [
      {
        path: '/users',
        sidebarName: 'Users',
        Icon: PeopleAlt,
        component: Users,
        needsPermission: true,
        permission: Permissions.ViewUsers,
      },
      {
        path: '/adduser',
        sidebarName: '',
        Icon: PeopleAlt,
        component: AddUser,
        needsPermission: true,
        permission: Permissions.ViewUsers,
      },
      {
        path: '/roles',
        sidebarName: 'Roles',
        Icon: SupervisedUserCircle,
        component: Roles,
        needsPermission: true,
        permission: Permissions.ViewRoles,
      },
      {
        path: '/locations',
        sidebarName: 'Locations',
        Icon: LocationOn,
        component: Locations,
        needsPermission: true,
        permission: Permissions.ViewLocations,
      },
      {
        path: '/loginhistory',
        sidebarName: 'Login History',
        Icon: VpnKey,
        component: LoginHistory,
        needsPermission: true,
        permission: Permissions.ViewUsers,
      },
    ],
  },
  {
    sidebarName: 'Settings',
    Icon: SettingsApplications,
    needsPermission: true,
    permission: Permissions.ViewSettingsMenu,
    items: [
      {
        path: '/taxes',
        sidebarName: 'Taxes',
        Icon: Money,
        component: Taxes,
        needsPermission: true,
        permission: Permissions.ViewTaxes,
      },
      {
        path: '/settings',
        sidebarName: 'Settings',
        Icon: SettingsBrightness,
        component: Settings,
        needsPermission: true,
        permission: Permissions.ViewSettings,
      },
      {
        path: '/possettings',
        sidebarName: 'POS Settings',
        Icon: SettingsCell,
        component: PosSettings,
        needsPermission: true,
        permission: Permissions.ViewPosSettings,
      },
      {
        path: '/invoiceemailprintsettings',
        sidebarName: 'Invoice Email/Print Settings',
        Icon: Drafts,
        component: InvoiceEmailPrintSettings,
        needsPermission: true,
        permission: Permissions.ViewCustomerStatementSettings,
      },
      {
        path: '/customerstatementsettings',
        sidebarName: 'Statement Settings',
        Icon: PictureAsPdf,
        component: CustomerStatementSettings,
        needsPermission: true,
        permission: Permissions.ViewCustomerStatementSettings,
      },
    ],
  },
  {
    sidebarName: 'Website Admin',
    Icon: Language,
    needsPermission: true,
    permission: Permissions.ViewWebsiteSettings,
    items: [
      {
        path: '/updatewebsiteproducts',
        sidebarName: 'Website Products',
        Icon: Highlight,
        component: UpdateWebsiteProducts,
        needsPermission: true,
        permission: Permissions.ViewWebsiteSettings,
      },
      {
        path: '/productcategories',
        sidebarName: 'Product Categories',
        Icon: Highlight,
        component: ProductCategory,
        needsPermission: true,
        permission: Permissions.ViewWebsiteSettings,
      },
      {
        path: '/websitesliders',
        sidebarName: 'Website Sliders',
        Icon: Highlight,
        component: WebsiteSlider,
        needsPermission: true,
        permission: Permissions.ViewWebsiteSettings,
      },
      {
        path: '/blogposts',
        sidebarName: 'Blog Posts',
        Icon: Book,
        component: BlogPosts,
        needsPermission: true,
        permission: Permissions.ViewWebsiteSettings,
      },
      {
        path: '/custom-applications',
        sidebarName: 'Custom Applications',
        Icon: CenterFocusWeak,
        component: CustomApplications,
        needsPermission: true,
        permission: Permissions.ViewWebsiteSettings,
      },
      {
        path: '/tags',
        sidebarName: 'Tags',
        Icon: LocalOffer,
        component: Tags,
        needsPermission: true,
        permission: Permissions.ViewWebsiteSettings,
      },
      {
        path: '/websiteabout',
        sidebarName: 'Website About',
        Icon: Book,
        component: WebsiteAbout,
        needsPermission: true,
        permission: Permissions.ViewWebsiteSettings,
      },
      {
        path: '/websiteaboutpopover',
        sidebarName: 'Website About Pop Over',
        Icon: Book,
        component: WebsiteAboutPopOver,
        needsPermission: true,
        permission: Permissions.ViewWebsiteSettings,
      },
      {
        path: '/websitefaq',
        sidebarName: 'Website FAQ',
        Icon: Book,
        component: WebsiteFaq,
        needsPermission: true,
        permission: Permissions.ViewWebsiteSettings,
      },
    ],
  },
  {
    path: '/login',
    sidebarName: '',
    Icon: Person,
    needsPermission: false,
    component: SignIn,
  },
  {
    path: '/order/:id',
    sidebarName: '',
    Icon: Person,
    needsPermission: false,
    component: Order,
  },
  {
    path: '/return/:id',
    sidebarName: '',
    Icon: Person,
    needsPermission: false,
    component: Return,
  },
  {
    path: '/purchase/:id',
    sidebarName: '',
    Icon: Person,
    needsPermission: false,
    component: Purchase,
  },
  {
    path: '/customer/:id',
    sidebarName: '',
    Icon: Person,
    needsPermission: false,
    component: Customer,
  },
  {
    path: '/product/:id',
    sidebarName: '',
    Icon: Person,
    needsPermission: false,
    component: Product,
  },
  {
    path: '/customerstorecredit/:id',
    sidebarName: '',
    Icon: ContactMail,
    needsPermission: false,
    component: CustomerStoreCredit,
  },
  {
    redirect: true,
    path: '/',
    to: '/login',
    needsPermission: false,
    navbarName: 'Redirect',
  },
];

export default dashboardRoutes;
