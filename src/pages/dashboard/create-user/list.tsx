import { Helmet } from 'react-helmet-async';
// sections
import { CreateUserListView } from 'src/sections/create-user/view';

// ----------------------------------------------------------------------

export default function CreateUserListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Quản trị giám sát</title>
      </Helmet>

      <CreateUserListView />
    </>
  );
}
