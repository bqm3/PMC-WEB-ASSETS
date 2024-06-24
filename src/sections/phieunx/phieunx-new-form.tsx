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
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
// types
// api
import { IPhongbanda } from 'src/types/taisan';
import { useGetNghiepvu, useGetPhongBanDa, useGetNam, useGetThang } from 'src/api/taisan';
// components
import { useSnackbar } from 'src/components/snackbar';
// types
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';
import { useBoolean } from 'src/hooks/use-boolean';

import PhieuNXNewEditDetails from './phieunx-new-edit-details';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export default function SuaChuaTSNewForm() {
  const router = useRouter();

  const settings = useSettingsContext();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const [noiXuat, setNoiXuat] = useState<IPhongbanda[]>([]);
  const [noiNhap, setNoiNhap] = useState<IPhongbanda[]>([]);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { phongbanda } = useGetPhongBanDa();

  const { nghiepvu } = useGetNghiepvu();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    Sophieu: Yup.string().required('Không được để trống'),
    NgayNX: Yup.mixed<any>().nullable().required('Phải có ngày nhập xuất'),
    ID_Nghiepvu: Yup.string().required('Không được để trống'),
    ID_NoiXuat: Yup.mixed<any>(),
    ID_NoiNhap: Yup.mixed<any>(),
  });

  const defaultValues = useMemo(
    () => ({
      ID_Nghiepvu: '',
      Sophieu: '',
      ID_NoiNhap: null,
      ID_NoiXuat: null,
      NgayNX: new Date(),
      Ghichu: '',
      phieunxct: [
        {
          ID_Taisan: '',
          Dongia: 0,
          Soluong: 0,
          Tong: 0,
          isDelete: 0,
        },
      ],
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

  useEffect(() => {
    let dataNoiNhap = [];
    let dataNoiXuat = [];
  
    if (`${values.ID_Nghiepvu}` === '2') {
      dataNoiXuat = phongbanda.filter(item => item.Thuoc === 'Dự án ngoài');
      dataNoiNhap = phongbanda.filter(item => item.Thuoc === 'PMC');
    } else if (`${values.ID_Nghiepvu}` === '1' || `${values.ID_Nghiepvu}` === '7') {
      dataNoiNhap = phongbanda?.filter(item => item.Thuoc === 'PMC');
      dataNoiXuat = phongbanda?.filter(item => item.Thuoc === 'PMC');
      setValue('ID_NoiXuat', values.ID_NoiNhap);
    } else if (`${values.ID_Nghiepvu}` === '5') {
      dataNoiNhap = phongbanda.filter(item => item.Thuoc === 'Dự án ngoài');
      dataNoiXuat = phongbanda.filter(item => item.Thuoc === 'PMC');
    } else {
      dataNoiNhap = phongbanda.filter(item => item.Thuoc === 'PMC');
      dataNoiXuat = dataNoiNhap.filter(item => item.ID_Phongban !== values.ID_NoiNhap);
    }
  
    setNoiNhap(dataNoiNhap);
    setNoiXuat(dataNoiXuat);
  
  }, [values.ID_Nghiepvu, phongbanda, values.ID_NoiNhap, setValue]);
  

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .post(`https://checklist.pmcweb.vn/pmc-assets/api/tb_phieunx/create`, data, {
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
    <Grid xs={12} md={12}>
      <Card>
        <Stack spacing={3} sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
          {nghiepvu?.length > 0 && (
            <RHFSelect
              name="ID_Nghiepvu"
              label="Nghiệp vụ"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {nghiepvu?.map((item) => (
                <MenuItem key={item?.ID_Nghiepvu} value={item?.ID_Nghiepvu}>
                  {item?.Nghiepvu}
                </MenuItem>
              ))}
            </RHFSelect>
          )}
          {noiNhap?.length > 0 && (
            <RHFSelect
              name="ID_NoiNhap"
              label="Nơi nhập"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {noiNhap?.map((item) => (
                <MenuItem key={item?.ID_Phongban} value={item?.ID_Phongban}>
                  {item?.Tenphongban}
                </MenuItem>
              ))}
            </RHFSelect>
          )}
          {noiXuat?.length > 0 && (
            <RHFSelect
              name="ID_NoiXuat"
              label="Nơi xuất"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {noiXuat?.map((item) => (
                <MenuItem key={item?.ID_Phongban} value={item?.ID_Phongban}>
                  {item?.Tenphongban}
                </MenuItem>
              ))}
            </RHFSelect>
          )}
        </Stack>
        <Stack spacing={3} sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
          <RHFTextField name="Sophieu" label="Số phiếu" />
          <Controller
            name="NgayNX"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label="Ngày nhập xuất"
                value={field.value}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            )}
          />
        </Stack>
        <Stack spacing={3} sx={{ p: 1.5 }}>
          <RHFTextField name="Ghichu" multiline rows={3} label="Ghi chú" />
        </Stack>
      </Card>
    </Grid>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderDetails}
      <Card sx={{ mt: 3 }}>
        <PhieuNXNewEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          type="submit"
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          // onClick={handleCreateAndSend}
        >
          Tạo mới
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
