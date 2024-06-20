import { Helmet } from 'react-helmet-async';
// sections
import { SuaChuaTSListView } from 'src/sections/suachuats/view';

// ----------------------------------------------------------------------

export default function SuaChuaTSListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Sửa chữa tài sản</title>
      </Helmet>

      <SuaChuaTSListView />
    </>
  );
}
