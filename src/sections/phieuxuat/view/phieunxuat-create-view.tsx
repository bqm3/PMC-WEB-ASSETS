// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PhieuNCCNewForm from '../phieunxuat-new-form';

// ----------------------------------------------------------------------

export default function PhieuNCCCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Tạo phiếu nhập xuất hàng nhà cung cấp"
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

      <PhieuNCCNewForm />
    </Container>
  );
}
