import { Helmet } from 'react-helmet-async';
// sections
import { CreateUserCreateView } from 'src/sections/create-user/view';

// ----------------------------------------------------------------------

export default function CreateUserCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <CreateUserCreateView />
    </>
  );
}
