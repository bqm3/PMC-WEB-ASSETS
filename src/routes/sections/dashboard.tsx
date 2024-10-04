import { Suspense, lazy } from 'react';

// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import { Outlet } from 'react-router-dom';
// hooks
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

// OVERVIEW


const GroupPolicyListsPage = lazy(() => import('src/pages/dashboard/grouppolicy/list'));
const GroupPolicyNewPage = lazy(() => import('src/pages/dashboard/grouppolicy/new'));

const PolicyListsPage = lazy(() => import('src/pages/dashboard/policy/list'));
const PolicyNewPage = lazy(() => import('src/pages/dashboard/policy/new'));

const PhongBanDaListsPage = lazy(() => import('src/pages/dashboard/phongbanda/list'));
const PhongBanDaNewPage = lazy(() => import('src/pages/dashboard/phongbanda/new'));

const NhomTsListsPage = lazy(() => import('src/pages/dashboard/nhom/list'));
const NhomTsNewPage = lazy(() => import('src/pages/dashboard/nhom/new'));

const NhaCCListsPage = lazy(() => import('src/pages/dashboard/nhacc/list'));
const NhaCCNewPage = lazy(() => import('src/pages/dashboard/nhacc/new'));

const DonviListsPage = lazy(() => import('src/pages/dashboard/donvi/list'));
const DonviNewPage = lazy(() => import('src/pages/dashboard/donvi/new'));

const CreateUserListsPage = lazy(() => import('src/pages/dashboard/create-user/list'));
const CreateUserNewPage = lazy(() => import('src/pages/dashboard/create-user/new'));

const TaiSanListsPage = lazy(() => import('src/pages/dashboard/taisan/list'));
const TaiSanNewPage = lazy(() => import('src/pages/dashboard/taisan/new'));

const PhieuNXListsPage = lazy(() => import('src/pages/dashboard/phieunx/list'));
const PhieuNXNewPage = lazy(() => import('src/pages/dashboard/phieunx/new'));
const PhieuNXEditPage = lazy(() => import('src/pages/dashboard/phieunx/edit'));

const SuaChuaTSListsPage = lazy(() => import('src/pages/dashboard/suachuats/list'));
const SuaChuaTSNewPage = lazy(() => import('src/pages/dashboard/suachuats/new'));
const SuaChuaTSEditPage = lazy(() => import('src/pages/dashboard/suachuats/edit'));

const TaiSanQrCodeListsPage = lazy(() => import('src/pages/dashboard/taisanqrcode/list'));

const ProfilePage = lazy(() => import('src/pages/dashboard/userAdmin/profile'));
const NewUserPage = lazy(() => import('src/pages/dashboard/userAdmin/new'));
const ListUserPage = lazy(() => import('src/pages/dashboard/userAdmin/list'));

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
        path: 'departments',
        children: [
          { element: <PhongBanDaListsPage />, index: true },
          { path: 'list', element: <PhongBanDaListsPage /> },
          { path: 'new', element: <PhongBanDaNewPage /> },
        ],
      },
      {
        path: 'unit-group-type',
        children: [
          { element: <DonviListsPage />, index: true },
          { path: 'list', element: <DonviListsPage /> },
          { path: 'new', element: <DonviNewPage /> },
        ],
      },
      {
        path: 'nhacc',
        children: [
          { element: <NhaCCListsPage />, index: true },
          { path: 'list', element: <NhaCCListsPage /> },                                                                                                                                                                                                                                                                     
          { path: 'new', element: <NhaCCNewPage /> },
        ],
      },
      {
        path: 'group-assets',
        children: [
          { element: <NhomTsListsPage />, index: true },
          { path: 'list', element: <NhomTsListsPage /> },
          { path: 'new', element: <NhomTsNewPage /> },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <CreateUserListsPage />, index: true },
          { path: 'list', element: <CreateUserListsPage /> },
          { path: 'new', element: <CreateUserNewPage /> },
        ],
      },
      {
        path: 'asset',
        children: [
          { element: <TaiSanListsPage />, index: true },
          { path: 'list', element: <TaiSanListsPage /> },
          { path: 'new', element: <TaiSanNewPage /> },
        ],
      },
      {
        path: 'inventory-in-out',
        children: [
          { element: <PhieuNXListsPage />, index: true },
          { path: 'list', element: <PhieuNXListsPage /> },
          { path: 'new', element: <PhieuNXNewPage /> },
          { path: ':id/edit', element: <PhieuNXEditPage /> },
          { path: ':id', element: <PhieuNXEditPage /> },
        ],
      },

      {
        path: 'property-repair',
        children: [
          { element: <SuaChuaTSListsPage />, index: true },
          { path: 'list', element: <SuaChuaTSListsPage /> },
          { path: 'new', element: <SuaChuaTSNewPage /> },
          { path: ':id/edit', element: <SuaChuaTSEditPage /> },
          { path: ':id', element: <SuaChuaTSEditPage /> },
        ],
      },
      {
        path: 'qrcode-property',
        children: [
          { element: <TaiSanQrCodeListsPage />, index: true },
          { path: 'list', element: <TaiSanQrCodeListsPage /> },
        ],
      },
      {
        path: 'profile',
        children: [
          { element: <ProfilePage />, index: true },
          { path: 'list', element: <ListUserPage /> },
          { path: 'new', element: <NewUserPage /> },
        ],
      },


    ],
  },
];
