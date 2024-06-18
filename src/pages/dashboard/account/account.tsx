import { Helmet } from 'react-helmet-async';
// sections
import { AccountView } from 'src/sections/account-employee/view';

// ----------------------------------------------------------------------

export default function AccountPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Account Settings</title>
      </Helmet>

      <AccountView />
    </>
  );
}
