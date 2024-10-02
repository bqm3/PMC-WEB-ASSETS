import { Helmet } from 'react-helmet-async';
// sections
import { DonViCreateView } from 'src/sections/donvi/view';

// ----------------------------------------------------------------------

export default function DonViCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <DonViCreateView />
    </>
  );
}
