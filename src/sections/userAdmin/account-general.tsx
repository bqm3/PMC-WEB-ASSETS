import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// auth
import { useAuthContext } from 'src/auth/hooks';
// utils
import { fData } from 'src/utils/format-number';
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
    Hoten: user?.Hoten,
    Email: user?.Email,
    Diachi: user?.Diachi,
    Gioitinh: user?.Gioitinh,
    MaPMC: user?.MaPMC,
    Sodienthoai: user?.Sodienthoai,
    ent_chinhanh: user?.ent_chinhanh?.Tenchinhanh || '',
    ent_chucvu: user?.ent_chucvu?.Chucvu || '',
    ent_nhompb: user?.ent_nhompb?.Nhompb || '',
}),
[user]
);



  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (user) {
      reset(defaultValues);
    }
  }, [user, defaultValues,reset ]);


  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="Hoten" label="Họ tên" disabled />
              <RHFTextField name="Email" label="Email" disabled />
              <RHFTextField name="Sodienthoai" label="Số điện thoại" disabled />
              <RHFTextField name="Diachi" label="Địa chỉ" disabled />
              <RHFTextField name="MaPMC" label="Mã PMC" disabled />
              <RHFTextField name="ent_chinhanh" label="Chi nhánh" disabled />
              <RHFTextField name="ent_chucvu" label="Chức vụ" disabled />
              <RHFTextField name="ent_nhompb" label="Phòng ban" disabled />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
