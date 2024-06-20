// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useGetDetailPhieuNX } from 'src/api/taisan';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PhieuNXNewForm from '../suachua-ts-new-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};


export default function PhieuNXEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { phieunx: currentPhieuNX, mutate } = useGetDetailPhieuNX(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
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
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <PhieuNXNewForm currentPhieuNX={currentPhieuNX} mutate={mutate}/> */}
    </Container>
  );
}
