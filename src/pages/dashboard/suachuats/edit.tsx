import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { SuaChuaTSEditView } from 'src/sections/suachuats/view';

// ----------------------------------------------------------------------

export default function SuaChuaTSEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Sửa chữa tài sản</title>
      </Helmet>

      <SuaChuaTSEditView id={`${id}`} />
    </>
  );
}
