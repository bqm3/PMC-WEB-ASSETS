import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
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
// api
import { useGetChinhanh, useGetNhomPb, useGetPhongBanDa } from 'src/api/taisan';
// components
import { useSnackbar } from 'src/components/snackbar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

  const [selectedPhongbanID, setSelectedPhongbanID] = useState<any>(null); // State lưu giá trị ID_Phongban

  const mdUp = useResponsive('up', 'md');

  const { phongbanda } = useGetPhongBanDa();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    MaPMC: Yup.string().required('Không được để trống'),
    Hoten: Yup.string().required('Không được để trống'),
    Diachi: Yup.string().required('Không được để trống'),
    NgayGhinhan: Yup.mixed<any>().nullable().required('Phải có ngày ghi nhận'),
  });

  const defaultValues = useMemo(
    () => ({
      MaPMC: '',
      Hoten: '',
      Diachi: '',
      Gioitinh: '',
      Sodienthoai: '',
      Ghichu: '',
      NgayGhinhan: '' || new Date() || null,
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
    const dataInsert = {
      ...data,
      ID_Phongban: selectedPhongbanID
    }
    setLoading(true);
    await axios
      .post(`https://checklist.pmcweb.vn/pmc-assets/api/v1/ent_connguoi/create`, dataInsert, {
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
    <Grid container xs={12} md={12} spacing={2}>
      <Grid xs={4}>
        <Stack spacing={3}>
          <RHFTextField name="MaPMC" label="Mã PMC" />
        </Stack>
      </Grid>
      <Grid xs={4}>
        <Stack spacing={3}>
          <RHFTextField name="Hoten" label="Họ tên" />
        </Stack>
      </Grid>
      <Grid xs={4}>
        <Stack spacing={3}>
          <RHFTextField name="Diachi" label="Địa chỉ" />
        </Stack>
      </Grid>
      <Grid xs={4}>
        <Stack>
          <Typography variant="subtitle2">Giới tính</Typography>
          <RHFRadioGroup row name="Gioitinh" options={USER_GENDER_OPTIONS} />
        </Stack>
      </Grid>
      <Grid xs={4}>
        <Stack spacing={3}>
          <DatePicker
            label="Ngày ghi nhận"
            value={new Date(values.NgayGhinhan)}
            onChange={(newValue) => setValue('NgayGhinhan', newValue)}
          />
        </Stack>
      </Grid>
      <Grid xs={4}>
        <Stack spacing={3}>
          <RHFTextField name="Sodienthoai" label="Số điện thoại" />
        </Stack>
      </Grid>
      <Grid xs={4}>
        <Stack spacing={3}>
          <RHFAutocomplete
            name="ID_Phongban"
            label="Phòng ban dự án"
            freeSolo
            sx={{ flexGrow: 1, width: '100%' }}
            options={phongbanda}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option?.Tenphongban || ''
            }
            renderOption={(props, option) => (
              <li {...props} key={`${option.ID_Phongban}`}>
                {option.Tenphongban}
              </li>
            )}
            onChange={(event, value) => {
              if (typeof value === 'object' && value !== null && 'ID_Phongban' in value) {
                setSelectedPhongbanID(value.ID_Phongban)
              } else {
                setSelectedPhongbanID(null);
              }
            }}
          />
        </Stack>
      </Grid>
      <Grid xs={6}>
        <Stack spacing={3}>
          <RHFTextField name="Ghichu" multiline rows={2} label="Ghi chú" />
        </Stack>
      </Grid>
    </Grid>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column-reverse', mb: 2 }}
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
