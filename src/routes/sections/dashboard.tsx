import { Suspense, lazy } from 'react';

// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import { Outlet } from 'react-router-dom';
import { ServiceNewView } from 'src/sections/service/view';
// hooks
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

// OVERVIEW
export const DashboardPage = lazy(() => import('src/pages/dashboard/app'));
export const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewManagementPage = lazy(() => import('src/pages/dashboard/management'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// SERVICE
const ServiceListPage = lazy(() => import('src/pages/dashboard/service/list'));
const ServiceEditPage = lazy(() => import('src/pages/dashboard/service/edit'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));

// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// JOB
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));
//
// const CreateEmployeePage = lazy(() => import('src/pages/dashboard/create-employee/new'));
// const ListEmployeePage = lazy(() => import('src/pages/dashboard/create-employee/list'));
// const ListEditEmployeePage = lazy(() => import('src/pages/dashboard/create-employee/edit'));

const EmployeeAccountPage = lazy(() => import('src/pages/dashboard/account/account'));

// FICILITIES
const OverviewFicilitiesPage = lazy(() => import('src/pages/dashboard/facilities'));


const QuanlyGiamsatListsPage = lazy(() => import('src/pages/dashboard/quanlygiamsat/list'));
const QuanlyGiamsatEditPage = lazy(() => import('src/pages/dashboard/quanlygiamsat/edit'));

const GroupPolicyListsPage = lazy(() => import('src/pages/dashboard/grouppolicy/list'));
const GroupPolicyNewPage = lazy(() => import('src/pages/dashboard/grouppolicy/new'));

const PolicyListsPage = lazy(() => import('src/pages/dashboard/policy/list'));
const PolicyNewPage = lazy(() => import('src/pages/dashboard/policy/new'));

const PhongBanDaListsPage = lazy(() => import('src/pages/dashboard/phongbanda/list'));
const PhongBanDaNewPage = lazy(() => import('src/pages/dashboard/phongbanda/new'));

const NhomTsListsPage = lazy(() => import('src/pages/dashboard/nhom/list'));
const NhomTsNewPage = lazy(() => import('src/pages/dashboard/nhom/new'));

const CreateUserListsPage = lazy(() => import('src/pages/dashboard/create-user/list'));
const CreateUserNewPage = lazy(() => import('src/pages/dashboard/create-user/new'));

const TaiSanListsPage = lazy(() => import('src/pages/dashboard/taisan/list'));
const TaiSanNewPage = lazy(() => import('src/pages/dashboard/taisan/new'));

const PhieuNXListsPage = lazy(() => import('src/pages/dashboard/phieunx/list'));
const PhieuNXNewPage = lazy(() => import('src/pages/dashboard/phieunx/new'));
// -----------------------------------------

export const dashboardRoutes = [
  
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element:  <OverviewAnalyticsPage />, index: true },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'management', element: <OverviewManagementPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'ficilities', element: <OverviewFicilitiesPage /> },
      
      {
        path: 'group-policy',
        children: [
          { element: <GroupPolicyListsPage />, index: true },
          { path: 'list', element: <GroupPolicyListsPage /> },
          { path: 'new', element: <GroupPolicyNewPage /> },
        ],
      },
      {
        path: 'policy',
        children: [
          { element: <PolicyListsPage />, index: true },
          { path: 'list', element: <PolicyListsPage /> },
          { path: 'new', element: <PolicyNewPage /> },
        ],
      },
      {
        path: 'phong-ban',
        children: [
          { element: <PhongBanDaListsPage />, index: true },
          { path: 'list', element: <PhongBanDaListsPage /> },
          { path: 'new', element: <PhongBanDaNewPage /> },
        ],
      },
      {
        path: 'nhom-tai-san',
        children: [
          { element: <NhomTsListsPage />, index: true },
          { path: 'list', element: <NhomTsListsPage /> },
          { path: 'new', element: <NhomTsNewPage /> },
        ],
      },
      {
        path: 'create-user',
        children: [
          { element: <CreateUserListsPage />, index: true },
          { path: 'list', element: <CreateUserListsPage /> },
          { path: 'new', element: <CreateUserNewPage /> },
        ],
      },
      {
        path: 'tai-san',
        children: [
          { element: <TaiSanListsPage />, index: true },
          { path: 'list', element: <TaiSanListsPage /> },
          { path: 'new', element: <TaiSanNewPage /> },
        ],
      },
      {
        path: 'phieu-nhap-xuat',
        children: [
          { element: <PhieuNXListsPage />, index: true },
          { path: 'list', element: <PhieuNXListsPage /> },
          { path: 'new', element: <PhieuNXNewPage /> },
        ],
      },

      {
        path: 'account-employee',
        children: [{ element: <EmployeeAccountPage />, index: true }],
      },
     
      {
        path: 'quan-ly-giam-sat',
        children: [
          { element: <QuanlyGiamsatListsPage />, index: true },
          { path: 'list', element: <QuanlyGiamsatListsPage /> },
          { path: ':id/edit', element: <QuanlyGiamsatEditPage /> },
        ],
      },
     
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
