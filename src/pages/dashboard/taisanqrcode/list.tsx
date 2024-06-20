import { Helmet } from 'react-helmet-async';
// sections
import { TaiSanQrCodeListView } from 'src/sections/taisanqrcode/view';

// ----------------------------------------------------------------------

export default function TaiSanQrCodeListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tài sản</title>
      </Helmet>

      <TaiSanQrCodeListView />
    </>
  );
}
