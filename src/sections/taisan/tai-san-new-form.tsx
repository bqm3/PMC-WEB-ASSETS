import * as Yup from 'yup';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _tags, _roles, USER_GENDER_OPTIONS } from 'src/_mock';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFMultiSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
// types
// api
import { useGetGroupPolicy, useGetTaisan, useGetDonvi, useGetNhomts } from 'src/api/taisan';
// components
import { useSnackbar } from 'src/components/snackbar';
// types
// components
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';
import { list_country } from 'src/_mock/map/countries';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export default function GroupPolicyNewForm() {
  const router = useRouter();

  const settings = useSettingsContext();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { nhomts } = useGetNhomts();

  const { donvi } = useGetDonvi();
  const { taisan, mutateTaisan } = useGetTaisan();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    Tents: Yup.string().required('Không được để trống'),
    ID_Nhomts: Yup.string().required('Không được để trống'),
    ID_Donvi: Yup.string().required('Không được để trống'),
    i_MaQrCode: Yup.string()
  });

  const defaultValues = useMemo(
    () => ({
      ID_Nhomts: '',
      ID_Donvi: '',
      Mats: '',
      Nuocsx: '',
      Tents: '',
      Thongso: '',
      Ghichu: '',
      i_MaQrCode: '0',
    }),
    []
  );

 

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleChangeIncludeCheck = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue('i_MaQrCode', event.target.checked ? '0' : '1');
    },
    [setValue]
  );

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .post(`http://localhost:8888/api/v1/ent_taisan/create`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        reset();
        mutateTaisan()
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 2000,
          message: 'Tạo mới thành công',
        });
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          enqueueSnackbar({
            variant: 'error',
            autoHideDuration: 2000,
            message: `${error.response.data.message}`,
          });
        } else if (error.request) {
          // Lỗi không nhận được phản hồi từ server
          enqueueSnackbar({
            variant: 'error',
            autoHideDuration: 2000,
            message: `Không nhận được phản hồi từ máy chủ`,
          });
        } else {
          // Lỗi khi cấu hình request
          enqueueSnackbar({
            variant: 'error',
            autoHideDuration: 2000,
            message: `Lỗi gửi yêu cầu`,
          });
        }
      });
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={3}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Chi tiết
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Thông tin...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={9}>
        <Card>
          <Stack
            spacing={3}
            sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {nhomts?.length > 0 && (
              <RHFSelect
                name="ID_Nhomts"
                label="Nhóm tài sản"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                sx={{ flexGrow: 1 }}
              >
                {nhomts?.map((item) => (
                  <MenuItem key={item?.ID_Nhomts} value={item?.ID_Nhomts}>
                    {item?.Tennhom}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}

            <Stack sx={{flexGrow: 1}}>
            <RHFAutocomplete
                name="Nuocsx"
                label="Nước sản xuất"
                freeSolo
                sx={{ flexGrow: 1, width: '100%', minWidth: 240 }}
                options={list_country.map((country) => country.name)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => {
                  const { code, name } = list_country.filter(
                    (country) => country.name === option
                  )[0];

                  if (!name) {
                    return null;
                  }

                  return (
                    <li {...props} key={name}>
                      {name}
                    </li>
                  );
                }}
              />
            </Stack>
              
            {donvi?.length > 0 && (
              <RHFSelect
                name="ID_Donvi"
                label="Đơn vị"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                sx={{ flexGrow: 1 }}
              >
                {donvi?.map((item) => (
                  <MenuItem key={item?.ID_Donvi} value={item?.ID_Donvi}>
                    {item?.Donvi}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
              
            </Stack>

          <Stack spacing={3} sx={{ p: 2 }}>
            <RHFTextField name="Tents" label="Tên tài sản" />
          </Stack>
          <Stack spacing={3} sx={{ p: 2 }}>
            <RHFEditor simple name="Thongso" />
          </Stack>
          <Stack spacing={3} sx={{ p: 2 }}>
            <RHFTextField name="Ghichu" multiline rows={3} label="Ghi chú" />
          </Stack>
          <Stack spacing={3} sx={{ p: 2 }}>
          <FormControlLabel
              control={
                <Switch checked={`${values.i_MaQrCode}` === '0'} onChange={handleChangeIncludeCheck} color='success'/>
              }
              label="Qr Code"
            />
            </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column-reverse'}}
      >
        <LoadingButton
          type="submit"
          onClick={onSubmit}
          variant="contained"
          size="large"
          loading={loading}
        >
          Tạo mới
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}
