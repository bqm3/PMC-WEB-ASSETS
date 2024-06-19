import { Helmet } from 'react-helmet-async';
// sections
import { PhieuNXCreateView } from 'src/sections/phieunx/view';

// ----------------------------------------------------------------------

export default function PhieuNXCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <PhieuNXCreateView />
    </>
  );
}
