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
import { IPhieuNX } from 'src/types/taisan';
// api
import { useGetNghiepvu, useGetPhongBanDa, useGetNam, useGetThang } from 'src/api/taisan';
// components
import { useSnackbar } from 'src/components/snackbar';
import { parseISO, isValid } from 'date-fns';
// types
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';
import { useBoolean } from 'src/hooks/use-boolean';

import PhieuNXEditDetails from './phieunx-edit-details';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

type Props = {
  currentPhieuNX?: IPhieuNX;
  mutate?: any;
};

export default function PhieuNXNewForm({ currentPhieuNX, mutate }: Props) {
  const router = useRouter();

  const settings = useSettingsContext();

  const loadingSend = useBoolean();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { phongbanda } = useGetPhongBanDa();

  const { nghiepvu } = useGetNghiepvu();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    Sophieu: Yup.string().required('Không được để trống'),
    NgayNX: Yup.mixed<any>().nullable().required('Phải có ngày nhập xuất'),
    ID_Nghiepvu: Yup.string().required('Không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      ID_PhieuNX: currentPhieuNX?.ID_PhieuNX || '',
      ID_Nghiepvu: currentPhieuNX?.ID_Nghiepvu || '',
      Sophieu: currentPhieuNX?.Sophieu || '',
      ID_NoiNhap: currentPhieuNX?.ID_NoiNhap || null,
      ID_NoiXuat: currentPhieuNX?.ID_NoiXuat || null,
      iTinhtrang: currentPhieuNX?.iTinhtrang || '',
      NgayNX: currentPhieuNX?.NgayNX || new Date(),
      Ghichu: currentPhieuNX?.Ghichu || '',
      phieunxct: currentPhieuNX?.tb_phieunxct || [
        {
          ID_Taisan: null,
          Dongia: 0,
          Soluong: 0,
          Tong: 0,
          isDelete: 0,
        },
      ],
    }),
    [currentPhieuNX]
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
    if (currentPhieuNX) {
      reset(defaultValues);
    }
  }, [currentPhieuNX, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .put(`https://checklist.pmcweb.vn/pmc-assets/api/tb_phieunx/update/${currentPhieuNX?.ID_PhieuNX}`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(async(res) => {
        setLoading(false);
        await mutate()
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 2000,
          message: 'Cập nhật thành công',
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

  const handleClose = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .post(`https://checklist.pmcweb.vn/pmc-assets/api/tb_phieunx/close/${currentPhieuNX?.ID_PhieuNX}`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(async(res) => {
        setLoading(false);
        await mutate()
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 2000,
          message: 'Khóa phiếu thành công',
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
              defaultValue={defaultValues?.ID_Nghiepvu}
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
          {phongbanda?.length > 0 && (
            <RHFSelect
              name="ID_NoiNhap"
              defaultValue={defaultValues?.ID_NoiNhap}
              label="Nơi nhập"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {phongbanda?.map((item) => (
                <MenuItem key={item?.ID_Phongban} value={item?.ID_Phongban}>
                  {item?.Tenphongban}
                </MenuItem>
              ))}
            </RHFSelect>
          )}
          {phongbanda?.length > 0 && (
            <RHFSelect
              name="ID_NoiXuat"
              defaultValue={defaultValues?.ID_NoiXuat}
              label="Nơi xuất"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {phongbanda?.map((item) => (
                <MenuItem key={item?.ID_Phongban} value={item?.ID_Phongban}>
                  {item?.Tenphongban}
                </MenuItem>
              ))}
            </RHFSelect>
          )}
        </Stack>
        <Stack
          spacing={3}
          sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <Stack width="100%">
            <RHFTextField name="Sophieu" label="Số phiếu" defaultValue={defaultValues?.Sophieu} />
          </Stack>
          <Stack width="100%">
            <DatePicker
              label="Ngày nhập xuất"
              value={new Date(values.NgayNX)}
              onChange={(newValue) => setValue('NgayNX', newValue)}
            />
          </Stack>
          <Stack width="100%">
            <RHFTextField
              name="Ghichu"
              multiline
              rows={4}
              label="Ghi chú"
              defaultValue={defaultValues.Ghichu}
            />
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );

  return (
    <FormProvider methods={methods}>
      {renderDetails}
      <Card sx={{ mt: 3 }}>
        <PhieuNXEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={3} sx={{ mt: 3 }}>
        {currentPhieuNX && `${currentPhieuNX.iTinhtrang}` === `0` && (
          <>
            <Button size="large" variant="soft" color="primary" onClick={handleClose}>
              Khoá phiếu 
            </Button>

            <LoadingButton
              type="submit"
              size="large"
              color="success"
              variant="contained"
              loading={loadingSend.value && isSubmitting}
              onClick={onSubmit}
            >
              Cập nhật
            </LoadingButton>
          </>
        )}
      </Stack>
    </FormProvider>
  );
}
