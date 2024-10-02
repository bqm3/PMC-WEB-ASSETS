import { Helmet } from 'react-helmet-async';
// sections
import { NhaCCListView } from 'src/sections/nhacc/view';

// ----------------------------------------------------------------------

export default function NhaCCListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Nhóm nhà cung cấp</title>
      </Helmet>

      <NhaCCListView />
    </>
  );
}
