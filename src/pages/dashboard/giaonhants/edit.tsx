import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { GiaoNhanTSEditView } from 'src/sections/giaonhants/view';

// ----------------------------------------------------------------------

export default function GiaoNhanTSEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Cập nhật phiếu</title>
      </Helmet>

      <GiaoNhanTSEditView id={`${id}`} />
    </>
  );
}
