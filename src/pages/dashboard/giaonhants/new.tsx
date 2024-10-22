import { Helmet } from 'react-helmet-async';
// sections
import { GiaoNhanTSCreateView } from 'src/sections/giaonhants/view';

// ----------------------------------------------------------------------

export default function GiaoNhanTSCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <GiaoNhanTSCreateView />
    </>
  );
}
