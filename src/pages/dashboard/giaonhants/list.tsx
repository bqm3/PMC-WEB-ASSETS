import { Helmet } from 'react-helmet-async';
// sections
import { GiaoNhanTSListView } from 'src/sections/giaonhants/view';

// ----------------------------------------------------------------------

export default function GiaoNhanTSListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Phiếu giao nhận</title>
      </Helmet>

      <GiaoNhanTSListView />
    </>
  );
}
