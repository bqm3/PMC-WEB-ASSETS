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
import { useGetGroupPolicy, useGetChinhanh, useGetNhomPb } from 'src/api/taisan';
// components
import { useSnackbar } from 'src/components/snackbar';
// types
// components
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export default function GroupPolicyNewForm() {
  const router = useRouter();

  const settings = useSettingsContext();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { chinhanh } = useGetChinhanh();
  
  const { nhompb } = useGetNhomPb();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    Mapb: Yup.string().required('Không được để trống'),
    Tenphongban: Yup.string().required('Không được để trống'),
    Diachi: Yup.string().required('Không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      Mapb: '',
      Tenphongban: '',
      Diachi: '',
      ID_Nhompb: null,
      ID_Chinhanh: null,
      Ghichu: ''
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
      .post(`https://checklist.pmcweb.vn/pmc-assets/api/ent_phongbanda/create`, data, {
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
            {chinhanh?.length > 0 && (
              <RHFSelect
                name="ID_Chinhanh"
                label="Chi nhánh"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {chinhanh?.map((item) => (
                  <MenuItem key={item?.ID_Chinhanh} value={item?.ID_Chinhanh}>
                    {item?.Tenchinhanh}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
          </Stack>
          <Stack spacing={3} sx={{ p: 1.5 }}>
            <RHFTextField name="Mapb" label="Mã phòng ban" />
          </Stack>
          <Stack spacing={3} sx={{ p: 1.5 }}>
            <RHFTextField name="Tenphongban" label="Tên phòng ban" />
          </Stack>
          <Stack spacing={3} sx={{ p: 1.5 }}>
            <RHFTextField name="Diachi" label="Địa chỉ" />
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
