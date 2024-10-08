import { Helmet } from 'react-helmet-async';
// sections
import { AccountNew } from 'src/sections/userAdmin/view';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới tài khoản</title>
      </Helmet>

      <AccountNew />
    </>
  );
}
