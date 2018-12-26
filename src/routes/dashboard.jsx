// @material-ui/icons
// import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Highlight from "@material-ui/icons/Highlight";
// import ContentPaste from "@material-ui/icons/ContentPaste";
// import LibraryBooks from "@material-ui/icons/LibraryBooks";
// import BubbleChart from "@material-ui/icons/BubbleChart";
// import LocationOn from "@material-ui/icons/LocationOn";
// import Notifications from "@material-ui/icons/Notifications";
// import Unarchive from "@material-ui/icons/Unarchive";
// core components/views
import Reports from "views/Reports/Reports.jsx";
// import TableList from "views/TableList/TableList.jsx";
// import Typography from "views/Typography/Typography.jsx";
// import Icons from "views/Icons/Icons.jsx";
// import Maps from "views/Maps/Maps.jsx";
// import NotificationsPage from "views/Notifications/Notifications.jsx";
import Customers from "views/Customers/Customers.jsx";
import Products from "views/Products/Products.jsx";
import Locations from "views/Locations/Locations.jsx";
import AddOrder from "../views/Orders/AddOrder";
import Orders from "../views/Orders/Orders";
import Discounts from "../views/Discounts/Discounts";
import Taxes from "../views/Taxes/Taxes";
import Users from "../views/Users/Users";
import Inventory from "../views/Inventory/Inventory";
// import Purchases from "../views/Purchases/Purchases";
import { SignIn } from "../views/Login/Auth";
import { Order } from "../views/Orders/Order";

const dashboardRoutes = [
  // {
  //   path: "/dashboard",
  //   sidebarName: "Dashboard",
  //   navbarName: "Dashboard",
  //   icon: Dashboard,
  //   component: DashboardPage
  // },
  {
    path: "/neworder",
    sidebarName: "New Order",
    navbarName: "",
    icon: Person,
    component: AddOrder
  },
  {
    path: "/orders",
    sidebarName: "Orders",
    navbarName: "",
    icon: Person,
    component: Orders
  },
  {
    path: "/products",
    sidebarName: "Products",
    navbarName: "",
    icon: Highlight,
    component: Products
  },
  {
    path: "/inventory",
    sidebarName: "Inventory",
    navbarName: "",
    icon: Highlight,
    component: Inventory
  },
  // {
  //   path: "/purchases",
  //   sidebarName: "Purchases",
  //   navbarName: "Purchases",
  //   icon: Highlight,
  //   component: Purchases
  // },
  {
    path: "/customers",
    sidebarName: "Customers",
    navbarName: "",
    icon: Person,
    component: Customers
  },
  {
    path: "/discounts",
    sidebarName: "Discounts",
    navbarName: "",
    icon: Person,
    component: Discounts
  },
  {
    path: "/locations",
    sidebarName: "Locations",
    navbarName: "",
    icon: Person,
    component: Locations
  },
  {
    path: "/taxes",
    sidebarName: "Taxes",
    navbarName: "",
    icon: Person,
    component: Taxes
  },
  {
    path: "/users",
    sidebarName: "Users",
    navbarName: "",
    icon: Person,
    component: Users
  },
  {
    path: "/reports",
    sidebarName: "Reports",
    navbarName: "",
    icon: Person,
    component: Reports
  },
  {
    path: "/login",
    sidebarName: "",
    navbarName: "",
    icon: Person,
    component: SignIn
  },
  {
    path: "/order/:id",
    sidebarName: "",
    navbarName: "",
    icon: Person,
    component: Order
  },
  // {
  //   path: "/table",
  //   sidebarName: "Table List",
  //   navbarName: "Table List",
  //   icon: "content_paste",
  //   component: TableList
  // },
  // {
  //   path: "/typography",
  //   sidebarName: "Typography",
  //   navbarName: "Typography",
  //   icon: LibraryBooks,
  //   component: Typography
  // },
  // {
  //   path: "/icons",
  //   sidebarName: "Icons",
  //   navbarName: "Icons",
  //   icon: BubbleChart,
  //   component: Icons
  // },
  // {
  //   path: "/maps",
  //   sidebarName: "Maps",
  //   navbarName: "Map",
  //   icon: LocationOn,
  //   component: Maps
  // },
  // {
  //   path: "/notifications",
  //   sidebarName: "Notifications",
  //   navbarName: "Notifications",
  //   icon: Notifications,
  //   component: NotificationsPage
  // },
  // {
  //   path: "/upgrade-to-pro",
  //   sidebarName: "Upgrade To PRO",
  //   navbarName: "Upgrade To PRO",
  //   icon: Unarchive,
  //   component: UpgradeToPro
  // },
  { redirect: true, path: "/", to: "/login", navbarName: "Redirect" }
];

export default dashboardRoutes;
