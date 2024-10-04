// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import GroupPolicyNewEditForm from '../group-policy-new-edit-form';

// ----------------------------------------------------------------------

export default function GroupPolicyCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Tạo hệ thống"
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

      <GroupPolicyNewEditForm />
    </Container>
  );
}
