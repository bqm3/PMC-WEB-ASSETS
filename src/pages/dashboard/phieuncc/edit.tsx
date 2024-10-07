import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { PhieuNCCEditView } from 'src/sections/phieuncc/view';

// ----------------------------------------------------------------------

export default function PhieuNCCEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật phiếu</title>
      </Helmet>

      <PhieuNCCEditView id={`${id}`} />
    </>
  );
}
