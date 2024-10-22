import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _tags, _roles, USER_GENDER_OPTIONS } from 'src/_mock';
// api
// components
import { useSnackbar } from 'src/components/snackbar';
// types
// components
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { MenuItem } from '@mui/material';
import { useGetLoaiNhom, useGetNhacc } from 'src/api/taisan';

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
      .post(`http://localhost:8888/api/v1/ent_nhacc/create`, data, {
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
