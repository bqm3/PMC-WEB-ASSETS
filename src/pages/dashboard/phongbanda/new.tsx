import { Helmet } from 'react-helmet-async';
// sections
import { PhongBanDaCreateView } from 'src/sections/phongbanda/view';

// ----------------------------------------------------------------------

export default function PhongBanDaCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <PhongBanDaCreateView />
    </>
  );
}
