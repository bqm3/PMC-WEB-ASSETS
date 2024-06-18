import { Helmet } from 'react-helmet-async';
// sections
import { GroupPolicyListView } from 'src/sections/grouppolicy/view';

// ----------------------------------------------------------------------

export default function GroupPolicyListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Hệ thống chính sách</title>
      </Helmet>

      <GroupPolicyListView />
    </>
  );
}
