import { Helmet } from 'react-helmet-async';
// sections
import { NhomTSCreateView } from 'src/sections/nhom/view';

// ----------------------------------------------------------------------

export default function NhomTSCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <NhomTSCreateView />
    </>
  );
}
