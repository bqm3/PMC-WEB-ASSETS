import { Helmet } from 'react-helmet-async';
// sections
import { KanbanView } from 'src/sections/kanban/view';

// ----------------------------------------------------------------------

export default function KanbanPage() {
  return (
    <>
      <Helmet>
        <title> Trang quản trị: Kanban</title>
      </Helmet>

      <KanbanView />
    </>
  );
}
