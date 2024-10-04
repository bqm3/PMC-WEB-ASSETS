// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useGetDetailPhieuNX } from 'src/api/taisan';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PhieuNXNewForm from '../phieunx-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};


export default function PhieuNXEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { phieunx: currentPhieuNX, mutate } = useGetDetailPhieuNX(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Cập nhật"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          
          { name: 'Cập nhật' },
        ]}
        sx={{
          mb: { xs: 1, md: 2 },
        }}
      />

      <PhieuNXNewForm currentPhieuNX={currentPhieuNX} mutate={mutate}/>
    </Container>
  );
}
