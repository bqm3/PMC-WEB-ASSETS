import { Helmet } from 'react-helmet-async';
// sections
import { PolicyListView } from 'src/sections/policy/view';

// ----------------------------------------------------------------------

export default function PolicyListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Phòng ban dự án</title>
      </Helmet>

      <PolicyListView />
    </>
  );
}
