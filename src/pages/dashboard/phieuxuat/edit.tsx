import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { PhieuNXuatEditView } from 'src/sections/phieuxuat/view';

// ----------------------------------------------------------------------

export default function PhieuNXuatEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật phiếu</title>
      </Helmet>

      <PhieuNXuatEditView id={`${id}`} />
    </>
  );
}
