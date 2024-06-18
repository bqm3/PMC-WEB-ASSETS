import { Helmet } from 'react-helmet-async';
// sections
import BlankView from 'src/sections/blank/view';

// ----------------------------------------------------------------------

export default function BlankPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Blank</title>
      </Helmet>

      <BlankView />
    </>
  );
}
