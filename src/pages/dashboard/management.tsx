import { Helmet } from 'react-helmet-async';
// sections
import { OverviewManagementsView } from 'src/sections/overview/management/view';

// ----------------------------------------------------------------------

export default function OverviewManagementsPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Quản lý dự án</title>
      </Helmet>

      <OverviewManagementsView />
    </>
  );
}
