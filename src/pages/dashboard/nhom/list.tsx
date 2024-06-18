import { Helmet } from 'react-helmet-async';
// sections
import { NhomTSListView } from 'src/sections/nhom/view';

// ----------------------------------------------------------------------

export default function NhomTSListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Nhóm tài sản</title>
      </Helmet>

      <NhomTSListView />
    </>
  );
}
