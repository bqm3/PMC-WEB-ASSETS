import * as Yup from 'yup';
import { useMemo, useEffect, useState, useCallback } from 'react';
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

import PhieuNXNewDetails from './giaonhants-new-details';

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

const Giaonhan = [
  {
    value: 1,
    label: 'Giao tài sản',
  },
  {
    value: 2,
    label: 'Nhận tài sản',
  },
];

const STORAGE_KEY = 'accessToken';

export default function SuaChuaTSNewForm() {
  const [loading, setLoading] = useState<Boolean | any>(false);
  const [loadingFilter, setLoadingFilter] = useState<Boolean | any>(false);

  const [dataPhieu, setDataPhieu] = useState<any>([]);
  const [noiXuat, setNoiXuat] = useState<any>([]);
  const [taiSan, setTaiSan] = useState<ITaisan[]>([]);

  const [noiNhap, setNoiNhap] = useState<IPhongbanda[]>([]);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const { phongbanda } = useGetPhongBanDa();

  const { nam } = useGetNam();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    // Sophieu: Yup.string().required('Không được để trống'),
    Ngay: Yup.mixed<any>().nullable().required('Phải có ngày giao nhận'),
    ID_Quy: Yup.mixed<any>().nullable().required('Phải có quý giao nhận'),
    ID_Nam: Yup.mixed<any>().nullable().required('Phải có năm giao nhận'),
    ID_Phongban: Yup.mixed<any>().nullable().required('Phải có phòng ban'),
    iGiaonhan: Yup.mixed<any>().nullable().required('Phải chọn phiếu'),
    Nguoinhan: Yup.mixed<any>().required('Không được để trống'),
    Nguoigiao: Yup.mixed<any>().required('Không được để trống'),
    // ID_NoiNhap: Yup.mixed<any>().required('Không được để trống'),
    // ID_Loainhom: Yup.mixed<any>().required('Không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      ID_Giaonhan: null,
      Nguoigiao: null,
      Nguoinhan: null,
      ID_Phongban: null,
      iGiaonhan: null,
      Ngay: new Date(),
      Ghichu: '',
      ID_Quy: null,
      ID_Nam: null,
      giaonhantsct: [
        {
          ID_Taisan: null,
          ID_TaisanQrcode: null,
          Tinhtrangmay: '',
          Cactllienquan: '',
          isUpdate: 0,
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

  // useEffect(() => {
  //   let dataTaiSan: any = [];
  //   if (values.ID_Phongban) {
  //     dataTaiSan = taisan.filter(
  //       (item) => `${item.ent_nhomts.ent_loainhom.ID_Loainhom}` === `${values.ID_Loainhom}`
  //     );
  //   } else {
  //     dataTaiSan = taisan;
  //   }
  //   setTaiSan(dataTaiSan);
  // }, [values.ID_Phongban, taisan, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .post(`http://localhost:8888/api/v1/tb_giaonhants/create`, data, {
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

  const handleFilter = useCallback(async () => {
    setLoadingFilter(true);
    const data = values;
    console.log(values)
    const res = await axios.post(`http://localhost:8888/api/v1/tb_giaonhants/filter`, data, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setDataPhieu(res.data.data);
    setLoadingFilter(false);
  }, [values, accessToken]);

  const renderDetails = (
    <Grid xs={12} md={12}>
      <Card>
        <Stack spacing={3} sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
        <RHFSelect
            name="iGiaonhan"
            label="Phiếu"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {Giaonhan?.map((item) => (
              <MenuItem key={item?.value} value={item?.value}>
                {item?.label}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFSelect
            name="ID_Phongban"
            label="Phòng ban dự án *"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {phongbanda?.map((item) => (
              <MenuItem key={item?.ID_Phongban} value={item?.ID_Phongban}>
                {item?.Tenphongban}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFSelect
            name="ID_Quy"
            label="Quý *"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {QUARTY?.map((item) => (
              <MenuItem key={item?.value} value={item?.value}>
                {item?.label}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFSelect
            name="ID_Nam"
            label="Năm *"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {nam?.map((item) => (
              <MenuItem key={item?.ID_Nam} value={item?.ID_Nam}>
                {item?.Nam}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
        <Stack spacing={3} sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
          {dataPhieu?.resNSPB?.length > 0 && (
            <RHFSelect
              name="Nguoinhan"
              label="Nguời nhận *"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {dataPhieu?.resNSPB?.map((item: any) => (
                <MenuItem key={item?.ID_NSPB} value={item?.ID_NSPB}>
                  {item?.ent_connguoi?.Hoten}
                </MenuItem>
              ))}
            </RHFSelect>
          )}
          {dataPhieu?.resNSPB?.length > 0 && (
            <RHFSelect
              name="Nguoigiao"
              label="Người giao *"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {dataPhieu?.resNSPB?.map((item: any) => (
                <MenuItem key={item?.ID_NSPB} value={item?.ID_NSPB}>
                  {item?.ent_connguoi?.Hoten}
                </MenuItem>
              ))}
            </RHFSelect>
          )}

          <Controller
            name="Ngay"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label="Ngày giao nhận "
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
        {values.ID_Phongban !== null && values.ID_Quy !== null && values.ID_Nam !== null && (
          <Button
            size="large"
            color="success"
            variant="contained"
            onClick={handleFilter}
            sx={{
              float: 'right',
              m: 2,
            }}
          >
            Tìm kiếm
          </Button>
        )}
      </Card>
    </Grid>
  );

  return (
    <FormProvider methods={methods}>
      {renderDetails}
      <Card sx={{ mt: 3 }}>
        <PhieuNXNewDetails dataPhieu={dataPhieu} loadingFilter={loadingFilter}/>
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
