import { Helmet } from 'react-helmet-async';
// sections
import { TaiSanCreateView } from 'src/sections/taisan/view';

// ----------------------------------------------------------------------

export default function TaiSanCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <TaiSanCreateView />
    </>
  );
}
