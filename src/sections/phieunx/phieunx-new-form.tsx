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

import PhieuNXNewEditDetails from './phieunx-new-details';

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

const QUARTYFILTER = [
  {
    value: 1,
    label: 'Quý I',
  },

  {
    value: 4,
    label: 'Quý IV',
  },
];

const STORAGE_KEY = 'accessToken';

export default function SuaChuaTSNewForm() {

  const [loading, setLoading] = useState<Boolean | any>(false);
  const [loadingFilter, setLoadingFilter] = useState<Boolean | any>(false);


  const [noiXuat, setNoiXuat] = useState<any>([]);
  const [taiSan, setTaiSan] = useState<ITaisan[]>([]);

  const [noiNhap, setNoiNhap] = useState<IPhongbanda[]>([]);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { phongbanda } = useGetPhongBanDa();

  const { nghiepvu } = useGetNghiepvu();
  const { loainhom } = useGetLoaiNhom();
  const { taisan } = useGetTaisan();

  const { enqueueSnackbar } = useSnackbar();

  const [filteredQuarty, setFilteredQuarty] = useState(QUARTY); // Default is QUARTY

  const NewPhieuNXSchema = Yup.object().shape({
    Sophieu: Yup.mixed<any>().nullable(),
    NgayNX: Yup.mixed<any>().required('Phải có ngày nhập xuất'),
    ID_Nghiepvu: Yup.string().required('Không được để trống'),
    ID_NoiXuat: Yup.mixed<any>().required('Không được để trống'),
    ID_NoiNhap: Yup.mixed<any>().required('Không được để trống'),
    ID_Loainhom: Yup.mixed<any>().required('Không được để trống'),
    ID_Quy: Yup.mixed<any>().required('Không được để trống'),
    phieunxct: Yup.array()
      .of(
        Yup.object().shape({
          ID_Taisan: Yup.mixed<any>(),
          Dongia: Yup.mixed<any>().nullable(),
          Soluong: Yup.mixed<any>().nullable(),
          Namsx: Yup.mixed<any>().nullable(),
          Tong: Yup.mixed<any>().nullable(),
          isDelete: Yup.mixed<any>().nullable(),
        })
      )
      .nullable()
      .notRequired(), // Thêm vào đây
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
      phieunxct: [],
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewPhieuNXSchema),
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
    if (values.ID_Loainhom === 1 || values.ID_Loainhom === 4) {
      setFilteredQuarty(QUARTYFILTER);
    } else {
      setFilteredQuarty(QUARTY);
    }
  }, [values.ID_Loainhom]);

  useEffect(() => {
    let dataNoiNhap: any = [];
    let dataNoiXuat: any = [];

    if (
      `${values.ID_Nghiepvu}` === '1' ||
      `${values.ID_Nghiepvu}` === '9' ||
      `${values.ID_Nghiepvu}` === '7' ||
      `${values.ID_Nghiepvu}` === '6'
    ) {
      dataNoiXuat = phongbanda;
      dataNoiNhap = phongbanda;

      if (values.ID_NoiNhap) {
        setValue('ID_NoiXuat', values.ID_NoiNhap);
      } else if (values.ID_NoiXuat) {
        setValue('ID_NoiNhap', values.ID_NoiXuat);
      }

      if (values.ID_NoiNhap === values.ID_NoiXuat) {
        if (values.ID_NoiNhap && values.ID_NoiXuat) {
          setValue('ID_NoiNhap', values.ID_NoiXuat); // Đồng bộ giá trị
        }
      }
    } else if (`${values.ID_Nghiepvu}` === '3') {
      dataNoiNhap = phongbanda;
      dataNoiXuat = dataNoiNhap.filter((item: any) => item.ID_Phongban !== values.ID_NoiNhap);
    } else {
      dataNoiXuat = phongbanda;
      dataNoiNhap = phongbanda;
    }
    setNoiNhap(dataNoiNhap);
    setNoiXuat(dataNoiXuat);
  }, [values.ID_Nghiepvu, phongbanda, values.ID_NoiNhap, values.ID_NoiXuat, setValue]);

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
      .post(`https://checklist.pmcweb.vn/pmc-assets/api/v1/tb_phieunx/create`, data, {
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

  const handleFilter = async () => {
    setLoadingFilter(true);

    // Kiểm tra xem các trường bắt buộc có giá trị hay không
    const { ID_Loainhom, ID_NoiNhap, ID_NoiXuat, ID_Nghiepvu, ID_Quy } = values;

    // Nếu thiếu bất kỳ trường nào thì không thực hiện tìm kiếm, thông báo bằng snackbar
    if (!ID_Loainhom || !ID_NoiNhap || !ID_NoiXuat || !ID_Nghiepvu || !ID_Quy) {
      setLoadingFilter(false); // Dừng quá trình loading

      enqueueSnackbar({
        variant: 'warning',
        autoHideDuration: 2000,
        message: 'Vui lòng điền đầy đủ thông tin trước khi tìm kiếm',
      });
      return; // Dừng quá trình tìm kiếm
    }

    // Nếu tất cả các trường đều có giá trị, thực hiện tìm kiếm
    const dataReq = {
      ID_Loainhom,
      ID_NoiNhap,
      ID_NoiXuat,
      ID_Nghiepvu,
      ID_Quy,
    };

    try {
      const res = await axios.post(`https://checklist.pmcweb.vn/pmc-assets/api/v1/tb_phieunx/taisan`, dataReq, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 200) {
        setValue('phieunxct', res.data.data);
      } else {
        enqueueSnackbar({
          variant: 'warning',
          autoHideDuration: 2000,
          message: 'Tìm kiếm thất bại',
        });
      }
    } catch (error) {
      console.log('err', error)
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 2000,
        message: 'Có lỗi xảy ra khi tìm kiếm',
      });
    } finally {
      setLoadingFilter(false); // Dừng loading khi quá trình tìm kiếm hoàn tất
    }
  };

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
                ?.filter((item) => ['1', '9', '3'].includes(`${item?.ID_Nghiepvu}`))
                .map((item) => (
                  <MenuItem key={item?.ID_Nghiepvu} value={item?.ID_Nghiepvu}>
                    {item?.Nghiepvu}
                  </MenuItem>
                ))}
            </RHFSelect>
          )}
          {noiNhap?.length > 0 && (
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
          )}
          {noiXuat?.length > 0 && (
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
            {filteredQuarty?.map((item) => (
              <MenuItem key={item?.value} value={item?.value}>
                {item?.label}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFTextField name="Ghichu" multiline rows={2} label="Ghi chú" />
        </Stack>
        {`${values.ID_Nghiepvu}` === '3' && (
          <LoadingButton
            size="large"
            color="success"
            variant="contained"
            loading={loadingFilter}
            onClick={handleFilter}
            sx={{
              float: 'right',
              m: 2,
            }}
          >
            Tìm kiếm
          </LoadingButton>
        )}
      </Card>
    </Grid>
  );

  return (
    <FormProvider methods={methods}>
      {renderDetails}
      <Card sx={{ mt: 3 }}>
        <PhieuNXNewEditDetails taiSan={taiSan} ID_Nghiepvu={values.ID_Nghiepvu} />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          type="submit"
          size="large"
          variant="contained"
          color="success"
          loading={loading}
          onClick={onSubmit}
        >
          Tạo mới
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
