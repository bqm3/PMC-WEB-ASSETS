// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import UserNewEditForm from '../create-user-new-form';

// ----------------------------------------------------------------------

export default function GroupPolicyCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Thêm mới"
        links={[
          {
            name: '',
            href: paths.dashboard.root,
          },
          
        ]}
        sx={{
          mb: { xs: 1, md: 2 },
        }}
      />

      <UserNewEditForm />
    </Container>
  );
}
