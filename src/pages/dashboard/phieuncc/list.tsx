import { Helmet } from 'react-helmet-async';
// sections
import { PhieuNCCListView } from 'src/sections/phieuncc/view';

// ----------------------------------------------------------------------

export default function PhieuNCCListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Phiếu nhập hàng</title>
      </Helmet>

      <PhieuNCCListView />
    </>
  );
}
