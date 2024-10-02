import { Helmet } from 'react-helmet-async';
// sections
import { DonViListView } from 'src/sections/donvi/view';

// ----------------------------------------------------------------------

export default function DonViListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Đơn vị - Loại tài sản</title>
      </Helmet>

      <DonViListView />
    </>
  );
}
