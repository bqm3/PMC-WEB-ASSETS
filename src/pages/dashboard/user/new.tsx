import { Helmet } from 'react-helmet-async';
// sections
import { UserCreateView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Create a new user</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
