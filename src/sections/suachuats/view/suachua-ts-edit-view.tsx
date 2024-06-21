// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useGetDetailPhieuNX, useGetDetailSuaChuaTS } from 'src/api/taisan';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import SuaChuaTsEditForm from '../suachua-ts-edit-form ';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};


export default function SuaChuaTsEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { suachuats: currentSuaChuaTs, mutate } = useGetDetailSuaChuaTS(id);

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

      <SuaChuaTsEditForm currentSuaChuaTs={currentSuaChuaTs} mutate={mutate}/>
    </Container>
  );
}
