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
import Button from '@mui/material/Button';
// hooks
import { useRouter } from 'src/routes/hooks';
// _mock
import { _tags, _roles, USER_GENDER_OPTIONS } from 'src/_mock';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
// types
import { IPhieuGN, IPhieuNX, IPhongbanda, ITaisan } from 'src/types/taisan';
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

import PhieuGNEditDetails from './giaonhants-edit-details';

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
  currentPhieuGN?: IPhieuGN;
  mutate?: any;
};

export default function PhieuGNNewForm({ currentPhieuGN, mutate }: Props) {
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
    // Sophieu: Yup.string().required('Không được để trống'),
    // NgayNX: Yup.mixed<any>().nullable().required('Phải có ngày nhập xuất'),
    // ID_Nghiepvu: Yup.string().required('Không được để trống'),
    // ID_NoiXuat: Yup.mixed<any>().required('Không được để trống'),
    // ID_NoiNhap: Yup.mixed<any>().required('Không được để trống'),
    // ID_Loainhom: Yup.mixed<any>().required('Không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      ID_Giaonhan: currentPhieuGN?.ID_Giaonhan || '',
      Nguoigiao: currentPhieuGN?.Nguoigiao || null,
      Nguoinhan: currentPhieuGN?.Nguoinhan || null,
      iGiaonhan: currentPhieuGN?.iGiaonhan || '',
      Ngay: currentPhieuGN?.Ngay || new Date(),
      Ghichu: currentPhieuGN?.Ghichu || '',
      ID_Quy: currentPhieuGN?.ID_Quy || '',
      ID_Nam: currentPhieuGN?.ID_Nam || '',
      giaonhantsct: currentPhieuGN?.giaonhantsct || [
        {
          ID_Taisan: null,
          ID_TaisanQrcode: null,
          Tinhtrangmay: "",
          Cacttlienquan: "",
          isUpdate: 0,
          Soluong: 0,
          Tong: 0,
          isDelete: 0,
        },
      ],
    }),
    [currentPhieuGN]
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

  // useEffect(() => {
  //   if (values.ID_Loainhom === 1 || values.ID_Loainhom === 4) {
  //     setFilteredQuarty(QUARTYFILTER);
  //   } else {
  //     setFilteredQuarty(QUARTY);
  //   }
  // }, [values.ID_Loainhom]);


  useEffect(() => {
    if (currentPhieuGN) {
      reset(defaultValues);
    }
  }, [currentPhieuGN, defaultValues, reset]);

  // useEffect(() => {
  //   let dataTaiSan: any = [];
  //   if (values.ID_Loainhom) {
  //     dataTaiSan = taisan.filter(
  //       (item) => `${item.ent_nhomts.ent_loainhom.ID_Loainhom}` === `${values.ID_Loainhom}`
  //     );
  //   } else {
  //     dataTaiSan = taisan;
  //   }
  //   setTaiSan(dataTaiSan);
  // }, [values.ID_Loainhom, taisan, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .put(`http://localhost:8888/api/v1/tb_phieunx/update/${currentPhieuGN?.ID_Giaonhan}`, data, {
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
      .post(`http://localhost:8888/api/v1/tb_phieunx/close/${currentPhieuGN?.ID_Giaonhan}`, data, {
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
          {/* {nghiepvu?.length > 0 && (
            <RHFSelect
              name="ID_Nghiepvu"
              defaultValue={defaultValues?.ID_Nghiepvu}
              label="Nghiệp vụ *"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {nghiepvu
                ?.filter((item) => ['1', '9', '7', '6', '3'].includes(`${item?.ID_Nghiepvu}`))
                .map((item) => (
                  <MenuItem key={item?.ID_Nghiepvu} value={item?.ID_Nghiepvu}>
                    {item?.Nghiepvu}
                  </MenuItem>
                ))}
            </RHFSelect>
          )} */}
          {/* {noiNhap?.length > 0 && (
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
          )} */}
          {/* {noiXuat?.length > 0 && (
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
              value={new Date(values.Ngay)}
              onChange={(newValue) => setValue('Ngay', newValue)}
            />
          </Stack> */}
        </Stack>
        <Stack
          spacing={2}
          sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
        >
          {/* <Stack width="100%">
            <RHFTextField name="Sophieu" label="Số phiếu *" defaultValue={defaultValues?.Sophieu} />
          </Stack> */}
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
        {/* <PhieuGNEditDetails taiSan={taiSan} /> */}
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        {currentPhieuGN && `${currentPhieuGN?.iGiaonhan}` === `0` && (
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
