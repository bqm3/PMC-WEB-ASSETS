import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { PATH_URL } from 'src/config-global';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
// hooks
import { useRouter } from 'src/routes/hooks';
// _mock
import { _tags, _roles, USER_GENDER_OPTIONS } from 'src/_mock';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
// types
import { IPhieuNX, IPhongbanda, ITaisan } from 'src/types/taisan';
// api
import { useGetNghiepvu, useGetPhongBanDa, useGetLoaiNhom, useGetTaisan } from 'src/api/taisan';
// components
import { useSnackbar } from 'src/components/snackbar';
// types
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';
import { useBoolean } from 'src/hooks/use-boolean';

import PhieuNXEditDetails from './phieunx-edit-details';

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

  const [noiXuat, setNoiXuat] = useState<IPhongbanda[]>([]);
  const [noiNhap, setNoiNhap] = useState<IPhongbanda[]>([]);
  const [taiSan, setTaiSan] = useState<ITaisan[]>([]);

  const { phongbanda } = useGetPhongBanDa();

  const { nghiepvu } = useGetNghiepvu();
  const { loainhom } = useGetLoaiNhom();
  const { taisan } = useGetTaisan();

  const [filteredQuarty, setFilteredQuarty] = useState(QUARTY); // Default is QUARTY

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    Sophieu: Yup.mixed<any>().nullable(),
    NgayNX: Yup.mixed<any>().nullable(),
    ID_Nghiepvu: Yup.string().required('Không được để trống'),
    ID_NoiXuat: Yup.mixed<any>().required('Không được để trống'),
    ID_NoiNhap: Yup.mixed<any>().required('Không được để trống'),
    ID_Loainhom: Yup.mixed<any>().required('Không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      ID_PhieuNX: currentPhieuNX?.ID_PhieuNX || '',
      ID_Nghiepvu: currentPhieuNX?.ID_Nghiepvu || '',
      Sophieu: currentPhieuNX?.Sophieu || '',
      ID_NoiNhap: currentPhieuNX?.ID_NoiNhap || null,
      ID_NoiXuat: currentPhieuNX?.ID_NoiXuat || null,
      ID_Loainhom: currentPhieuNX?.ID_Loainhom || null,
      iTinhtrang: currentPhieuNX?.iTinhtrang || '',
      NgayNX: currentPhieuNX?.NgayNX || new Date(),
      Ghichu: currentPhieuNX?.Ghichu || '',
      ID_Quy: currentPhieuNX?.ID_Quy || '',
      phieunxct: currentPhieuNX?.tb_phieunxct || [],
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
    if (values.ID_Loainhom === 1 || values.ID_Loainhom === 4) {
      setFilteredQuarty(QUARTYFILTER);
    } else {
      setFilteredQuarty(QUARTY);
    }
  }, [values.ID_Loainhom]);


  useEffect(() => {
    if (currentPhieuNX) {
      reset(defaultValues);
    }
  }, [currentPhieuNX, defaultValues, reset]);

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
    await axios
      .put(`${PATH_URL}/tb_phieunx/update/${currentPhieuNX?.ID_PhieuNX}`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(async (res) => {
        await mutate();
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
  });

  const handleClose = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .post(`${PATH_URL}/tb_phieunx/close/${currentPhieuNX?.ID_PhieuNX}`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(async (res) => {
        setLoading(false);
        await mutate();
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
        <Stack spacing={2} sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
          {nghiepvu?.length > 0 && (
            <RHFSelect
              name="ID_Nghiepvu"
              defaultValue={defaultValues?.ID_Nghiepvu}
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
              {noiXuat?.map((item) => (
                <MenuItem key={item?.ID_Phongban} value={item?.ID_Phongban}>
                  {item?.Tenphongban}
                </MenuItem>
              ))}
            </RHFSelect>
          )}
          <Stack width="100%">
            <DatePicker
              label="Ngày nhập xuất"
              value={new Date(values.NgayNX)}
              onChange={(newValue) => setValue('NgayNX', newValue)}
            />
          </Stack>
        </Stack>
        <Stack
          spacing={2}
          sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <Stack width="100%">
            <RHFTextField name="Sophieu" label="Số phiếu *" defaultValue={defaultValues?.Sophieu} />
          </Stack>
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
          <RHFTextField
            name="Ghichu"
            multiline
            rows={2}
            label="Ghi chú"
            defaultValue={defaultValues.Ghichu}
          />
        </Stack>
      </Card>
    </Grid>
  );

  return (
    <FormProvider methods={methods}>
      {renderDetails}
      <Card sx={{ mt: 3 }}>
        <PhieuNXEditDetails taiSan={taiSan} />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        {currentPhieuNX && `${currentPhieuNX.iTinhtrang}` === `0` && (
          <>
            {/* <Button size="large" variant="soft" color="primary"  >
              Khoá phiếu
            </Button> */}

            <LoadingButton loading={loading} loadingIndicator="Loading…" variant="outlined" onClick={handleClose}>
              Khoá phiếu
            </LoadingButton>

            <LoadingButton
              type="submit"
              size="large"
              color="success"
              variant="contained"
              loading={loadingSend.value || isSubmitting}
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
