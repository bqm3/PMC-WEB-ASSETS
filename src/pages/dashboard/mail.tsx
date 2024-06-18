import { Helmet } from 'react-helmet-async';
// sections
import { MailView } from 'src/sections/mail/view';

// ----------------------------------------------------------------------

export default function MailPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Mail</title>
      </Helmet>

      <MailView />
    </>
  );
}
