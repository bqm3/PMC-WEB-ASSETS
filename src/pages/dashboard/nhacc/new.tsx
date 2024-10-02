import { Helmet } from 'react-helmet-async';
// sections
import { NhaCCCreateView } from 'src/sections/nhacc/view';

// ----------------------------------------------------------------------

export default function NhaCCCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <NhaCCCreateView />
    </>
  );
}
