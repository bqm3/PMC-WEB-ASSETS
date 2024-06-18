import { Helmet } from 'react-helmet-async';
// sections
import { PhongBanDaListView } from 'src/sections/phongbanda/view';

// ----------------------------------------------------------------------

export default function PhongBanDaListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Hệ thống phòng ban</title>
      </Helmet>

      <PhongBanDaListView />
    </>
  );
}
