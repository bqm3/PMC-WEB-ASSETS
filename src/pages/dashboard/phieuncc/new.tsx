import { Helmet } from 'react-helmet-async';
// sections
import { PhieuNCCCreateView } from 'src/sections/phieuncc/view';

// ----------------------------------------------------------------------

export default function PhieuNCCCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <PhieuNCCCreateView />
    </>
  );
}
