import { Helmet } from 'react-helmet-async';
// sections
import { PostCreateView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function PostCreatePage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Create a new post</title>
      </Helmet>

      <PostCreateView />
    </>
  );
}
