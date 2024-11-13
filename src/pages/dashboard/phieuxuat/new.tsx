import { Helmet } from 'react-helmet-async';
// sections
import { PhieuNXuatCreateView } from 'src/sections/phieuxuat/view';

// ----------------------------------------------------------------------

export default function PhieuNXuatCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <PhieuNXuatCreateView />
    </>
  );
}
