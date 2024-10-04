// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import NhaCCNewEditForm from '../nhacc-new-form';

// ----------------------------------------------------------------------

export default function NhomTsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Tạo mới"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
        ]}
        sx={{
          mb: { xs: 1, md: 2 },
        }}
      />

      <NhaCCNewEditForm />
    </Container>
  );
}
