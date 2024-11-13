// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useGetDetailPhieuNCC } from 'src/api/taisan';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PhieuNCCNewForm from '../phieunxuat-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};


export default function PhieuNCCEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { phieuncc: currentPhieuNCC, mutate } = useGetDetailPhieuNCC(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Cập nhập phiếu nhập xuất hàng nhà cung cấp"
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

      <PhieuNCCNewForm currentPhieuNCC={currentPhieuNCC} mutate={mutate} />
    </Container>
  );
}
