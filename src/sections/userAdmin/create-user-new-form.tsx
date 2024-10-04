import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
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
import {
  useGetChinhanh,
  useGetChucvu,
  useGetLoaiNhom,
  useGetNhomPb,
  useGetPhongBanDa,
  useGetUser,
} from 'src/api/taisan';
// components
import { useSnackbar } from 'src/components/snackbar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';
import { IUser } from 'src/types/taisan';

// ----------------------------------------------------------------------
type Props = {
  currentUser?: IUser;
};

const STORAGE_KEY = 'accessToken';

export default function CreateUserNewForm({ currentUser }: Props) {
  const router = useRouter();

  const settings = useSettingsContext();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { phongbanda } = useGetPhongBanDa();
  const { chucvu } = useGetChucvu();
  const { loainhom } = useGetLoaiNhom();
  const { user, mutateUser } = useGetUser();

  const [loaiNhom, setLoaiNhom] = useState<any>([]);

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    MaPMC: Yup.string().required('Không được để trống'),
    Hoten: Yup.string().required('Không được để trống'),
    Diachi: Yup.string().required('Không được để trống'),
    Password: Yup.string().required('Không được để trống'),
    ID_Phongban: Yup.string().required('Không được để trống'),
    IDNHOMNGUOIDUNG: Yup.mixed<any>().required('Không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      MaPMC: currentUser?.MaPMC || '',
      Emails: currentUser?.Emails || '',
      Password: currentUser?.Password || '',
      ID_Nhompb: currentUser?.ID_Nhompb || null,
      Hoten: currentUser?.Hoten || '',
      Sodienthoai: currentUser?.Sodienthoai || '',
      Gioitinh: currentUser?.Gioitinh || '',
      Diachi: currentUser?.Diachi || '',
      ID_Chinhanh: currentUser?.ID_Chinhanh || null,
      ID_Chucvu: currentUser?.ID_Chucvu || null,
      ID_Phongban: currentUser?.ID_Phongban || null || '',
      IDNHOMNGUOIDUNG: currentUser?.IDNHOMNGUOIDUNG || [],
    }),
    [currentUser]
  );

  useEffect(() => {
    if (loainhom?.length > 0) {
      const transformedData = loainhom.map((item) => ({
        value: item.ID_Loainhom,
        label: item.Loainhom,
      }));
      setLoaiNhom(transformedData);
    }
  }, [loainhom]);

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
    try {
      if (currentUser !== undefined) {
        await axios
          .put(`http://localhost:8888/api/v1/ent_user/update/${currentUser.ID_User}`, data, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            mutateUser();
            enqueueSnackbar({
              variant: 'success',
              autoHideDuration: 2000,
              message: 'Cập nhật thành công',
            });
          })
          .catch((error) => {
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
      } else {
        axios
          .post(`http://localhost:8888/api/v1/ent_user/create`, data, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            mutateUser();
            enqueueSnackbar({
              variant: 'success',
              autoHideDuration: 2000,
              message: 'Tạo mới thành công',
            });
          })
          .catch((error) => {
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
      }
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 2000,
        message: `Lỗi gửi yêu cầu`,
      });
    }
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
        <Stack spacing={3}>
          <RHFTextField name="Sodienthoai" label="Số điện thoại" />
        </Stack>
      </Grid>
      <Grid xs={4}>
        <Stack spacing={3}>
          <RHFTextField name="Emails" label="Email" />
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
          {phongbanda?.length > 0 && (
            <RHFSelect
              fullWidth
              name="ID_Phongban"
              label="Phòng ban dự án"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {phongbanda?.map((option) => (
                <MenuItem key={option.ID_Phongban} value={option.ID_Phongban}>
                  {option.Tenphongban}
                </MenuItem>
              ))}
            </RHFSelect>
          )}
        </Stack>
      </Grid>
      <Grid xs={4}>
        <Stack spacing={3}>
          {chucvu?.length > 0 && (
            <RHFSelect
              fullWidth
              name="ID_Chucvu"
              label="Chức vụ"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {chucvu?.map((option) => (
                <MenuItem key={option.ID_Chucvu} value={option.ID_Chucvu}>
                  {option.Chucvu}
                </MenuItem>
              ))}
            </RHFSelect>
          )}
        </Stack>
      </Grid>
      <Grid xs={4}>
        <Stack spacing={3}>
          {loading === false ? (
            <>
              {loaiNhom && loaiNhom?.length > 0 ? (
                <RHFMultiSelect
                  checkbox
                  name="IDNHOMNGUOIDUNG"
                  label="Nhóm người dùng"
                  options={loaiNhom}
                />
              ) : (
                <></>
              )}{' '}
            </>
          ) : (
            <></>
          )}
        </Stack>
      </Grid>
      {!currentUser && (
        <Grid xs={4}>
          <Stack spacing={3}>
            <RHFTextField name="Password" label="Mật khẩu" />
          </Stack>
        </Grid>
      )}
      <Grid xs={4}>
        <Stack spacing={3}>
          <RHFTextField name="Ghichu" multiline rows={3} label="Ghi chú" />
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
          loading={isSubmitting}
        >
          {currentUser ? 'Cập nhật' : ' Tạo mới'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} padding={2}>
        {renderDetails}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}
