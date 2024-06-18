import { Helmet } from 'react-helmet-async';
// sections
import { PolicyCreateView } from 'src/sections/policy/view';

// ----------------------------------------------------------------------

export default function PolicyCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <PolicyCreateView />
    </>
  );
}
