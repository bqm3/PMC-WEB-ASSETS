// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PhieuNXNewForm from '../giaonhants-new-form';

// ----------------------------------------------------------------------

export default function PhieuNXCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Tạo phiếu nhập xuất"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },

          { name: 'Tạo mới' },
        ]}
        sx={{
          mb: { xs: 1, md: 2 },
        }}
      />

      <PhieuNXNewForm />
    </Container>
  );
}
