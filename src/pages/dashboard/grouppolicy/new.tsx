import { Helmet } from 'react-helmet-async';
// sections
import { GroupPolicyCreateView } from 'src/sections/grouppolicy/view';

// ----------------------------------------------------------------------

export default function GroupPolicyCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Tạo mới</title>
      </Helmet>

      <GroupPolicyCreateView />
    </>
  );
}
