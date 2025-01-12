import React from 'react'
import Shopkeepers from './views/pages/users/shopkeepers/Shopkeepers'
import SehrShops from './views/pages/users/sehrShops/SehrShops'
import LimitedCustomers from './views/pages/limitedUsers/limitedCustomers/LimitedCustomers'
import LimitedSehrShops from './views/pages/limitedUsers/limitedSehrShops/LimitedSehrShops'
import PurchasingByCustomers from './views/pages/purchasing/purchasingByCustomers/PurchasingByCustomers'
import SehrCodeRequests from './views/pages/requests/sehrCodeRequests/SehrCodeRequests'
import PaymentRequests from './views/pages/requests/paymentRequests/PaymentRequests'
import Education from './views/pages/education/education/Education'
import UserByEducation from './views/pages/education/userByEduction/UserByEducation'
import Category from './views/pages/category/category/Category'
import CategoryCommission from './views/pages/category/categoryCommission/CategoryCommission'
import ShopListByCategory from './views/pages/category/shopListByCategory/ShopListByCategory'
import PackagesDetail from './views/pages/sehrPackages/packagesDetail/PackagesDetail'
import UserListByPackage from './views/pages/sehrPackages/userListbyPackage/UserListByPackage'
import ShopListByPackage from './views/pages/sehrPackages/shopListByPackage/ShopListByPackage'
import Province from './views/pages/address/province/Province'
import PostBlog from './views/pages/blog/postBlog/PostBlog'
import VerifyOPT from './views/otp/VerifyOTP'
import BlogList from './views/pages/blog/blogList/BlogList'
import PurchasingBySehrShops from './views/pages/purchasing/purchasingBySehrShops/PurchasingBySehrShops'
import PurchasingByShops from './views/pages/purchasing/purchasingByShops/PurchasingByShops'
import PaymentsBySehrShops from './views/pages/purchasing/paymentsBySehrShops/PaymentsBySehrShops'
import SalesBySehrShops from './views/pages/purchasing/salesBySehrShops/SalesBySehrShops'
import UnverifiedUsers from './views/pages/users/unVerifiedUsers/UnVerifiedUsers'
import ProgressBySehrShops from './views/pages/purchasing/progressBySehrShops/ProgressBySehrShops'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
const Customers = React.lazy(() => import('./views/pages/users/customers/Customers'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users/unverified-users', name: 'Unverified Users', element: UnverifiedUsers, exact: true },
  { path: '/users/customers', name: 'Customers', element: Customers, exact: true },
  { path: '/users/shopkeepers', name: 'Shopkeepers', element: Shopkeepers, exact: true },
  { path: '/users/sehr-shop', name: 'SEHR Shops', element: SehrShops, exact: true },
  { path: '/limited-users/customers', name: 'Limited Customers', element: LimitedCustomers, exact: true },
  { path: '/limited-users/sehr-shops', name: 'Limited Sehr Shops', element: LimitedSehrShops, exact: true },
  { path: '/purchasing/purchasing-by-customer', name: 'Pusrchasing by Customer', element: PurchasingByCustomers, exact: true },
  { path: '/purchasing/purchasing-by-shops', name: 'Pusrchasing by Shops', element: PurchasingByShops, exact: true },
  { path: '/purchasing/purchasing-by-sehr-shops', name: 'Pusrchasing by Sehr Shops', element: PurchasingBySehrShops, exact: true },
  { path: '/purchasing/payments-by-sehr-shops', name: 'Payments by Sehr Shops', element: PaymentsBySehrShops, exact: true },
  { path: '/purchasing/progress-by-sehr-shops', name: 'Progress by Sehr Shops', element: ProgressBySehrShops, exact: true },
  { path: '/purchasing/sales-by-sehr-shops', name: 'Sales by Sehr Shops', element: SalesBySehrShops, exact: true },
  { path: '/request/sehr-code-request', name: 'Sehr Code Request', element: SehrCodeRequests, exact: true },
  { path: '/request/payment-request', name: 'Payment Request', element: PaymentRequests, exact: true },
  { path: '/education/education', name: 'Education', element: Education, exact: true },
  { path: '/education/user-by-education', name: 'User by Education', element: UserByEducation, exact: true },
  { path: '/category/category', name: 'Category', element: Category, exact: true },
  { path: '/category/category-commission', name: 'Category Commission', element: CategoryCommission, exact: true },
  { path: '/category/shop-list-by-category', name: 'Shop List by Category', element: ShopListByCategory, exact: true },
  { path: '/packages/packages-detail', name: 'Packages Detail', element: PackagesDetail, exact: true },
  { path: '/packages/user-list', name: 'User List by Packeges', element: UserListByPackage, exact: true },
  { path: '/packages/shop-list', name: 'Shop List by Packeges', element: ShopListByPackage, exact: true },
  { path: '/address/province', name: 'Province', element: Province, exact: true },
  { path: '/blog/post-blog', name: 'Post Blog', element: PostBlog, exact: true },
  { path: '/blog/blog-list', name: 'Blog List', element: BlogList, exact: true },
  { path: '/otp/verify-otp', name: 'Verify OTP', element: VerifyOPT, exact: true },

  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
