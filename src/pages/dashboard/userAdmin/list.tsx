import { Helmet } from 'react-helmet-async';
// sections
import { AccountList } from 'src/sections/userAdmin/view';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Danh sách tài khoản</title>
      </Helmet>

      <AccountList />
    </>
  );
}
