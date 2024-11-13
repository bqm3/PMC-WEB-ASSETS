import { Helmet } from 'react-helmet-async';
// sections
import { PhieuNXuatListView } from 'src/sections/phieuxuat/view';

// ----------------------------------------------------------------------

export default function PhieuNCCListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Phiếu xuất hàng</title>
      </Helmet>

      <PhieuNXuatListView />
    </>
  );
}
