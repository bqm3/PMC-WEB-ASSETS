import { Helmet } from 'react-helmet-async';
// sections
import { JobListView } from 'src/sections/job/view';

// ----------------------------------------------------------------------

export default function JobListPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Job List</title>
      </Helmet>

      <JobListView />
    </>
  );
}
