// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useGetDetailPhieuGNCT } from 'src/api/taisan';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PhieuGNNewForm from '../giaonhants-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};


export default function PhieuGNEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { phieugn: currentPhieuGN, mutate } = useGetDetailPhieuGNCT(id);

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

      <PhieuGNNewForm currentPhieuGN={currentPhieuGN} mutate={mutate}/>
    </Container>
  );
}
