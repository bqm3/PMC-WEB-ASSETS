import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// hooks
import { useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _tags, _roles } from 'src/_mock';
// api
// components
import { useSnackbar } from 'src/components/snackbar';
// types
// components
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { useGetNhacc } from 'src/api/taisan';
import { provinces } from 'src/_mock/map/provinces';


// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export default function NhaCCNewForm() {
  const router = useRouter();

  const settings = useSettingsContext();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();
  const { mutateNhacc } = useGetNhacc();
  const NewProductSchema = Yup.object().shape({
    MaNhacc: Yup.string().required('Không được để trống'),
    TenNhacc: Yup.string().required('Không được để trống'),
    Masothue: Yup.string().required('Không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      MaNhacc: '',
      TenNhacc: '',
      Masothue: '',
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

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .post(`https://checklist.pmcweb.vn/pmc-assets/api/v1/ent_nhacc/create`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        reset();
        mutateNhacc();
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
    <Grid xs={12} md={12}>
      <Card>
        <Stack spacing={2} sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
          <RHFTextField name="MaNhacc" label="Mã nhà cung cấp *" />
          <RHFTextField name="TenNhacc" label="Tên nhà cung cấp *" />
          <RHFTextField name="Masothue" label="Mã số thuế *" />
        </Stack>
        <Stack spacing={2} sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
          <RHFTextField name="Sodienthoai" label="Số điện thoại" />
          <RHFTextField name="Sotaikhoan" label="Số tài khoản" />
          <RHFTextField name="Nganhang" label="Ngân hàng" />
        </Stack>
        <Stack spacing={2} sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
          <RHFTextField name="Nguoilienhe" label="Người liên hệ" />
          <RHFTextField name="Email" label="Email" />
          <RHFAutocomplete
            name="Thanhpho"
            label="Tỉnh - Thành phố"
            freeSolo
            sx={{ flexGrow: 1, width: '100%', minWidth: 240 }}
            options={provinces.map((country) => country.name_with_type)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => {
              const { code, name_with_type } = provinces.filter(
                (country) => country.name_with_type === option
              )[0];

              if (!name_with_type) {
                return null;
              }

              return (
                <li {...props} key={name_with_type}>
                  {name_with_type}
                </li>
              );
            }}
          />
        </Stack>
        <Stack spacing={2} sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
          <RHFTextField name="Diachi" label="Địa chỉ" />
          <RHFTextField name="Ghichu" label="Ghi chú" />
        </Stack>
      </Card>
    </Grid>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column-reverse', pb: 2 }}
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
