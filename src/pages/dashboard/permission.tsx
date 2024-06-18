import { Helmet } from 'react-helmet-async';
// sections
import PermissionDeniedView from 'src/sections/permission/view';

// ----------------------------------------------------------------------

export default function PermissionDeniedPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Permission Denied</title>
      </Helmet>

      <PermissionDeniedView />
    </>
  );
}
