import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { PhieuNXEditView } from 'src/sections/phieunx/view';

// ----------------------------------------------------------------------

export default function PhieuNXEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật phiếu</title>
      </Helmet>

      <PhieuNXEditView id={`${id}`} />
    </>
  );
}
