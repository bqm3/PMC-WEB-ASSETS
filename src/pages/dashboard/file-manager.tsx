import { Helmet } from 'react-helmet-async';
// sections
import { FileManagerView } from 'src/sections/file-manager/view';

// ----------------------------------------------------------------------

export default function FileManagerPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: File Manager</title>
      </Helmet>

      <FileManagerView />
    </>
  );
}
