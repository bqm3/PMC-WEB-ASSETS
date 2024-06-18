// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import NhomTsNewEditForm from '../nhom-ts-new-form';

// ----------------------------------------------------------------------

export default function NhomTsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Tạo loại tài sản"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          
          { name: 'Tạo mới' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <NhomTsNewEditForm />
    </Container>
  );
}
