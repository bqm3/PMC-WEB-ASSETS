import { Helmet } from 'react-helmet-async';
// sections
import { TaiSanListView } from 'src/sections/taisan/view';

// ----------------------------------------------------------------------

export default function TaiSanListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tài sản</title>
      </Helmet>

      <TaiSanListView />
    </>
  );
}
