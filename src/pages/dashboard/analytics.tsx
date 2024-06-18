import { Helmet } from 'react-helmet-async';
// sections
import { OverviewAnalyticsView } from 'src/sections/overview/analytics/view';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Phân tích dữ liệu</title>
      </Helmet>

      <OverviewAnalyticsView />
    </>
  );
}
