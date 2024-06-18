import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
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
  RHFRadioGroup,
} from 'src/components/hook-form';
// types
// api
import { useGetGroupPolicy, useGetChinhanh, useGetNhomPb } from 'src/api/taisan';
// components
import { useSnackbar } from 'src/components/snackbar';
// types
// components
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export default function CreateUserNewForm() {
  const router = useRouter();

  const settings = useSettingsContext();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { nhompb } = useGetNhomPb();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    MaPMC: Yup.string().required('Không được để trống'),
    Hoten: Yup.string().required('Không được để trống'),
    Diachi: Yup.string().required('Không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      MaPMC: '',
      Hoten: '',
      Diachi: '',
      Gioitinh: '',
      ID_Nhompb: null,
      Sodienthoai: '',
      Ghichu: '',
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
    console.log('dasta', data);
    setLoading(true);
    await axios
      .post(`http://localhost:8888/api/ent_connguoi/create`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        reset();
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
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Chi tiết
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Thông tin...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 1.5 }}>
            {nhompb?.length > 0 && (
              <RHFSelect
                name="ID_Nhompb"
                label="Phòng ban"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {nhompb?.map((item) => (
                  <MenuItem key={item?.ID_Nhompb} value={item?.ID_Nhompb}>
                    {item?.Nhompb}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
          </Stack>

          <Stack spacing={3} sx={{ p: 1.5 }}>
            <RHFTextField name="MaPMC" label="Mã phòng ban" />
          </Stack>
          <Stack spacing={3} sx={{ p: 1.5 }}>
            <RHFTextField name="Hoten" label="Họ tên" />
          </Stack>
          <Stack spacing={3} sx={{ p: 1.5 }}>
            <RHFTextField name="Diachi" label="Địa chỉ" />
          </Stack>
          <Stack spacing={1} sx={{ p: 1.5 }}>
            <Typography variant="subtitle2">Giới tính</Typography>
            <RHFRadioGroup row name="Gioitinh" spacing={1} options={USER_GENDER_OPTIONS} />
          </Stack>
          <Stack spacing={3} sx={{ p: 1.5 }}>
            <RHFTextField name="Sodienthoai" label="Số điện thoại" />
          </Stack>
          <Stack spacing={3} sx={{ p: 1.5 }}>
            <RHFTextField name="Ghichu" multiline rows={3} label="Ghi chú" />
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
        sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column-reverse' }}
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
