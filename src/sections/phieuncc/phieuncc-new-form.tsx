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
import { IPhongbanda, ITaisan } from 'src/types/taisan';
import {
  useGetNghiepvu,
  useGetPhongBanDa,
  useGetNam,
  useGetThang,
  useGetNhacc,
  useGetLoaiNhom,
  useGetTaisan,
} from 'src/api/taisan';
// components
import { useSnackbar } from 'src/components/snackbar';
// types
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';
import { useBoolean } from 'src/hooks/use-boolean';

import PhieuNXNewEditDetails from './phieuncc-new-details';

// ----------------------------------------------------------------------

const QUARTY = [
  {
    value: 1,
    label: 'Quý I',
  },
  {
    value: 2,
    label: 'Quý II',
  },
  {
    value: 3,
    label: 'Quý III',
  },
  {
    value: 4,
    label: 'Quý IV',
  },
];

const STORAGE_KEY = 'accessToken';

export default function SuaChuaTSNewForm() {
  const router = useRouter();

  const settings = useSettingsContext();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const [noiXuat, setNoiXuat] = useState<any>([]);
  const [taiSan, setTaiSan] = useState<ITaisan[]>([]);

  const [noiNhap, setNoiNhap] = useState<any[]>([]);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { phongbanda } = useGetPhongBanDa();
  const { nhacc } = useGetNhacc();

  const { nghiepvu } = useGetNghiepvu();
  const { loainhom } = useGetLoaiNhom();
  const { taisan } = useGetTaisan();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    Sophieu: Yup.string().required('Không được để trống'),
    NgayNX: Yup.mixed<any>().nullable().required('Phải có ngày nhập xuất'),
    ID_Nghiepvu: Yup.string().required('Không được để trống'),
    ID_NoiXuat: Yup.mixed<any>().required('Không được để trống'),
    ID_NoiNhap: Yup.mixed<any>().required('Không được để trống'),
    ID_Loainhom: Yup.mixed<any>().required('Không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      ID_Nghiepvu: '',
      Sophieu: '',
      ID_NoiNhap: null,
      ID_NoiXuat: null,
      ID_Loainhom: null,
      NgayNX: new Date(),
      Ghichu: '',
      ID_Quy: null,
      phieunxct: [
        {
          ID_Taisan: null,
          Dongia: 0,
          Soluong: 0,
          Tong: 0,
          Namsx: 0,
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

  // 1: Phiếu hàng tồn đầu kỳ
  // 2: Phiếu nhập ngoài
  // 3: Phiếu nhập xuất nội bộ
  // 4: Phiếu nhập khác
  // 5: Phiếu xuất trả nhà cung cấp
  // 6: Phiếu xuất thanh lý
  // 7: Phiếu xuất hủy
  // 8: Phiếu xuất khác
  // 9: Phiếu kiểm kê // }

  // 1-9 ID_NX = ID_NN
  // 3 ID_NX !== ID_NN
  // 4-8 (vẫn là phongbanda) random
  // 7 - 6 ID_NX = ID_NN

  // 2-5 là của bảng ENT_PhieuNCC

  useEffect(() => {
    let dataNoiNhap: any = [];
    let dataNoiXuat: any = [];

    if (`${values.ID_Nghiepvu}` === '5') {
      dataNoiXuat = phongbanda;
      dataNoiNhap = nhacc;
    } else {
      dataNoiXuat = nhacc;
      dataNoiNhap = phongbanda;
    }
    setNoiNhap(dataNoiNhap);
    setNoiXuat(dataNoiXuat);
  }, [values.ID_Nghiepvu, phongbanda, nhacc]);

  useEffect(() => {
    let dataTaiSan: any = [];
    if (values.ID_Loainhom) {
      dataTaiSan = taisan.filter(
        (item) => `${item.ent_nhomts.ent_loainhom.ID_Loainhom}` === `${values.ID_Loainhom}`
      );
    } else {
      dataTaiSan = taisan;
    }
    setTaiSan(dataTaiSan);
  }, [values.ID_Loainhom, taisan, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .post(`http://localhost:8888/api/v1/tb_phieuncc/create`, data, {
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
              label="Nghiệp vụ *"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {nghiepvu
                ?.filter((item) => ['2', '5'].includes(`${item?.ID_Nghiepvu}`))
                .map((item) => (
                  <MenuItem key={item?.ID_Nghiepvu} value={item?.ID_Nghiepvu}>
                    {item?.Nghiepvu}
                  </MenuItem>
                ))}
            </RHFSelect>
          )}
          {noiNhap?.length > 0 && noiXuat?.length > 0 && `${values?.ID_Nghiepvu}` === '2' && (
            <>
              <RHFSelect
                name="ID_NoiNhap"
                label="Nơi nhập *"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {noiNhap?.map((item) => (
                  <MenuItem key={item?.ID_Phongban} value={item?.ID_Phongban}>
                    {item?.Tenphongban}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                name="ID_NoiXuat"
                label="Nơi xuất *"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {noiXuat?.map((item: any) => (
                  <MenuItem key={item?.ID_Nhacc} value={item?.ID_Nhacc}>
                    {item?.TenNhacc}
                  </MenuItem>
                ))}
              </RHFSelect>
            </>
          )}
          {noiNhap?.length > 0 && noiXuat?.length > 0 && `${values?.ID_Nghiepvu}` === '5' && (
            <>
              <RHFSelect
                name="ID_NoiNhap"
                label="Nơi nhập *"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {noiNhap?.map((item: any) => (
                  <MenuItem key={item?.ID_Nhacc} value={item?.ID_Nhacc}>
                    {item?.TenNhacc}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                name="ID_NoiXuat"
                label="Nơi xuất *"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {noiXuat?.map((item: any) => (
                  <MenuItem key={item?.ID_Phongban} value={item?.ID_Phongban}>
                    {item?.Tenphongban}
                  </MenuItem>
                ))}
              </RHFSelect>
            </>
          )}

          <Controller
            name="NgayNX"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label="Ngày nhập xuất "
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
        <Stack spacing={3} sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
          <RHFTextField name="Sophieu" label="Mã số phiếu *" />
          <RHFSelect
            name="ID_Loainhom"
            label="Loại nhóm *"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {loainhom?.map((item) => (
              <MenuItem key={item?.ID_Loainhom} value={item?.ID_Loainhom}>
                {item?.Loainhom}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFSelect
            name="ID_Quy"
            label="Quý"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {QUARTY?.map((item) => (
              <MenuItem key={item?.value} value={item?.value}>
                {item?.label}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFTextField name="Ghichu" multiline rows={3} label="Ghi chú" />
        </Stack>
        {/* <Stack spacing={3} sx={{ p: 1.5 }}>
          
        </Stack> */}
      </Card>
    </Grid>
  );

  return (
    <FormProvider methods={methods}>
      {renderDetails}
      <Card sx={{ mt: 3 }}>
        <PhieuNXNewEditDetails taiSan={taiSan} />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          type="submit"
          size="large"
          variant="contained"
          loading={loading}
          onClick={onSubmit}
        >
          Tạo mới
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
