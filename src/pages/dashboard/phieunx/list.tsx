import { Helmet } from 'react-helmet-async';
// sections
import { PhieuNXListView } from 'src/sections/phieunx/view';

// ----------------------------------------------------------------------

export default function PhieuNXListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Phiếu nhập xuất</title>
      </Helmet>

      <PhieuNXListView />
    </>
  );
}
