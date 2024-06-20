import { Helmet } from 'react-helmet-async';
// sections
import { SuaChuaTSCreateView } from 'src/sections/suachuats/view';

// ----------------------------------------------------------------------

export default function SuaChuaTSCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <SuaChuaTSCreateView />
    </>
  );
}
