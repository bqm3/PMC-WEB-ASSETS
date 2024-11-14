import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useWatch } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
// types
// api
import { IPhieuNCC, ITaisan } from 'src/types/taisan';
import {
  useGetNghiepvu,
  useGetPhongBanDa,
  useGetNhacc,
  useGetLoaiNhom,
  useGetTaisan,
} from 'src/api/taisan';
// components
import { useSnackbar } from 'src/components/snackbar';
// types
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { useBoolean } from 'src/hooks/use-boolean';

import PhieuNCCNewEditDetails from './phieunxuat-new-details';

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

  const [currentPhieuNCC, setCurrentPhieuNCC] = useState<IPhieuNCC>();

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

  const [filteredQuarty, setFilteredQuarty] = useState(QUARTY); // Default is QUARTY

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    Sophieu: Yup.mixed<any>().nullable().required('Không được để trống'),
    NgayNX: Yup.mixed<any>().nullable().required('Phải có ngày nhập xuất'),
    ID_Nghiepvu: Yup.mixed<any>().required('Không được để trống'),
    ID_NoiXuat: Yup.mixed<any>().required('Không được để trống'),
    ID_NoiNhap: Yup.mixed<any>().required('Không được để trống'),
    ID_Loainhom: Yup.mixed<any>().required('Không được để trống'),
    ID_Quy: Yup.mixed<any>().required('Không được để trống'),
    phieunccct: Yup.array()
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
      .notRequired(),
  });

  const defaultValues = useMemo(
    () => ({
      // ID_PhieuNCC: currentPhieuNCC?.ID_PhieuNCC || null,
      ID_Nghiepvu: currentPhieuNCC?.ID_Nghiepvu || null,
      Sophieu: currentPhieuNCC?.Sophieu || '',
      ID_NoiNhap:
        `${currentPhieuNCC?.ID_Nghiepvu}` === '5'
          ? currentPhieuNCC?.ent_nhacc?.ID_Nhacc
          : currentPhieuNCC?.ent_phongbanda?.ID_Phongban || null,
      ID_NoiXuat:
        `${currentPhieuNCC?.ID_Nghiepvu}` === '2'
          ? currentPhieuNCC?.ent_nhacc?.ID_Nhacc
          : currentPhieuNCC?.ent_phongbanda?.ID_Phongban || null,
      ID_Loainhom: currentPhieuNCC?.ID_Loainhom || null,
      NgayNX: currentPhieuNCC?.NgayNX || new Date(),
      Ghichu: currentPhieuNCC?.Ghichu || '',
      ID_Quy: currentPhieuNCC?.ID_Quy || null,
      phieunccct: currentPhieuNCC?.tb_phieunccct || [],
    }),
    [currentPhieuNCC]
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
  const LOAINHOM_OPTIONS = useMemo(
    () => [
      { ID_Loainhom: null, Loainhom: 'Tất cả' },
      ...loainhom.map((item) => ({
        ID_Loainhom: item.ID_Loainhom,
        Loainhom: item.Loainhom,
      })),
    ],
    [loainhom]
  );

  useEffect(() => {
    if (`${values.ID_Loainhom}` === '1' || `${values.ID_Loainhom}` === '4') {
      setFilteredQuarty(QUARTYFILTER);
    } else {
      setFilteredQuarty(QUARTY);
    }
  }, [values.ID_Loainhom]);

  useEffect(() => {
    let dataNoiNhap: any = [];
    let dataNoiXuat: any = [];

    if (`${values.ID_Nghiepvu}` === '2') {
      dataNoiXuat = nhacc;
      dataNoiNhap = phongbanda;
    } else {
      dataNoiXuat = phongbanda;
      dataNoiNhap = nhacc;
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


  const nghiepvuValue = useWatch({ control, name: 'ID_Nghiepvu' });

  const [previousNghiepvuValue, setPreviousNghiepvuValue] = useState(null);

  // Theo dõi sự thay đổi của nghiepvu và cập nhật phieunccct
  useEffect(() => {
    if (nghiepvuValue !== previousNghiepvuValue) {
      // Tạo một mảng mới với tất cả phần tử có isDelete = 0
      const updatedPhieuNccct = values?.phieunccct?.map(item => ({
        ...item,
        isDelete: 1,
      }));

      // Cập nhật lại state phieunccct
      setValue('phieunccct', updatedPhieuNccct);
      setPreviousNghiepvuValue(nghiepvuValue);

    }
  }, [nghiepvuValue, setValue, values.phieunccct, previousNghiepvuValue]);



  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .post(`https://checklist.pmcweb.vn/pmc-assets/api/v1/tb_phieuncc/create`, data, {
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
      const res = await axios.post(`https://checklist.pmcweb.vn/pmc-assets/api/v1/tb_phieuncc/taisan`, dataReq, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 200) {
        setValue('phieunccct', res.data.data);
      } else {
        enqueueSnackbar({
          variant: 'warning',
          autoHideDuration: 2000,
          message: 'Tìm kiếm thất bại',
        });
      }
    } catch (error) {
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
                ?.filter((item) => ['6', '7'].includes(`${item?.ID_Nghiepvu}`))
                .map((item) => (
                  <MenuItem key={item?.ID_Nghiepvu} value={item?.ID_Nghiepvu}>
                    {item?.Nghiepvu}
                  </MenuItem>
                ))}
            </RHFSelect>
          )}
          {noiNhap?.length > 0 && noiXuat?.length > 0 && `${values?.ID_Nghiepvu}` === '2' ? (
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
          ) : (
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
            label="Loại nhóm"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {LOAINHOM_OPTIONS?.map((item: any) => (
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
        {(`${values.ID_Nghiepvu}` === '5' ||
          `${values.ID_Nghiepvu}` === '7' ||
          `${values.ID_Nghiepvu}` === '6') && (
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
        <PhieuNCCNewEditDetails taiSan={taiSan} ID_Nghiepvu={values.ID_Nghiepvu} />
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
