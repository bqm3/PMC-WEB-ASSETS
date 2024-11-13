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
import { IPhieuNCC, IPhongbanda, ITaisan } from 'src/types/taisan';
// api
import {
  useGetNghiepvu,
  useGetPhongBanDa,
  useGetLoaiNhom,
  useGetTaisan,
  useGetNhacc,
} from 'src/api/taisan';
// components
import { useSnackbar } from 'src/components/snackbar';
// types
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import { useSettingsContext } from 'src/components/settings';
import axios from 'axios';
import { useBoolean } from 'src/hooks/use-boolean';

import PhieuNCCEditDetails from './phieuncc-edit-details';

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
  currentPhieuNCC?: IPhieuNCC;
  mutate?: any;
};

export default function PhieuNXNewForm({ currentPhieuNCC, mutate }: Props) {
  const router = useRouter();

  const settings = useSettingsContext();

  const loadingSend = useBoolean();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [noiXuat, setNoiXuat] = useState<any[]>([]);
  const [noiNhap, setNoiNhap] = useState<any[]>([]);
  const [taiSan, setTaiSan] = useState<ITaisan[]>([]);

  const mdUp = useResponsive('up', 'md');

  const [filteredQuarty, setFilteredQuarty] = useState(QUARTY); // Default is QUARTY

  const { phongbanda } = useGetPhongBanDa();

  const { nghiepvu } = useGetNghiepvu();
  const { loainhom } = useGetLoaiNhom();
  const { taisan } = useGetTaisan();
  const { nhacc } = useGetNhacc();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    Sophieu: Yup.string().required('Không được để trống'),
    NgayNX: Yup.mixed<any>().nullable().required('Phải có ngày nhập xuất'),
    ID_Nghiepvu: Yup.string().required('Không được để trống'),
    ID_NoiXuat: Yup.mixed<any>().required('Không được để trống'),
    ID_NoiNhap: Yup.mixed<any>().required('Không được để trống'),
    ID_Loainhom: Yup.mixed<any>().nullable(), // Không bắt buộc
  });

  const defaultValues = useMemo(
    () => ({
      ID_PhieuNCC: currentPhieuNCC?.ID_PhieuNCC || '',
      ID_Nghiepvu: currentPhieuNCC?.ID_Nghiepvu || '',
      Sophieu: currentPhieuNCC?.Sophieu || '',
      ID_NoiNhap:
        `${currentPhieuNCC?.ID_Nghiepvu}` === '5' || `${currentPhieuNCC?.ID_Nghiepvu}` === '6' || `${currentPhieuNCC?.ID_Nghiepvu}` === '7'
          ? currentPhieuNCC?.ent_nhacc?.ID_Nhacc
          : currentPhieuNCC?.ent_phongbanda?.ID_Phongban || null,
      ID_NoiXuat:
        `${currentPhieuNCC?.ID_Nghiepvu}` === '2'
          ? currentPhieuNCC?.ent_nhacc?.ID_Nhacc
          : currentPhieuNCC?.ent_phongbanda?.ID_Phongban || null,
      ID_Loainhom: currentPhieuNCC?.ID_Loainhom || null || '',
      iTinhtrang: currentPhieuNCC?.iTinhtrang || '',
      NgayNX: currentPhieuNCC?.NgayNX || new Date(),
      Ghichu: currentPhieuNCC?.Ghichu || '',
      ID_Quy: currentPhieuNCC?.ID_Quy || '',
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

  useEffect(() => {
    if (`${values?.ID_Loainhom}` === '1' || `${values?.ID_Loainhom}` === '4') {
      setFilteredQuarty(QUARTYFILTER);
    } else {
      setFilteredQuarty(QUARTY);
    }
  }, [values?.ID_Loainhom]);

  useEffect(() => {
    if (currentPhieuNCC) {
      reset(defaultValues);
    }
  }, [currentPhieuNCC, defaultValues, reset]);

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
    if (values?.ID_Loainhom) {
      dataTaiSan = taisan.filter(
        (item) => `${item.ent_nhomts.ent_loainhom.ID_Loainhom}` === `${values?.ID_Loainhom}`
      );
    } else {
      dataTaiSan = taisan;
    }
    setTaiSan(dataTaiSan);
  }, [values?.ID_Loainhom, taisan, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .put(
        `http://localhost:8888/api/v1/tb_phieuncc/update/${currentPhieuNCC?.ID_PhieuNCC}`,
        data,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
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
      .post(`http://localhost:8888/api/v1/tb_phieunx/close/${currentPhieuNCC?.ID_PhieuNCC}`, data, {
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
              disabled
              name="ID_Nghiepvu"
              defaultValue={defaultValues?.ID_Nghiepvu}
              label="Nghiệp vụ *"
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
            >
              {nghiepvu
                ?.filter((item) => ['2', '5',].includes(`${item?.ID_Nghiepvu}`))
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
                disabled
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
                disabled
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
                disabled
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
                disabled
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
            disabled
            name="ID_Loainhom"
            label="Loại nhóm"
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
            disabled
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
        <PhieuNCCEditDetails taiSan={taiSan} />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        {currentPhieuNCC && `${currentPhieuNCC.iTinhtrang}` === `0` && (
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
// Ban đầu tạo pheiesu là 100 k qr, 10 có qr,
// tạo phiếu khác là 50 và 1 qr
// mở pheiesu cũ ra sao còn 50
// Phiếu này phiếu nhập mà ?\
// Chưa khóa phiếu mà bh đổi số lượng thfi sao

// Nhập 100 sau đó đổi thành 1
// Phiếu kia xuất 10
// thì phải lỗi chứ

// Giờ phải check api xem phòng ban xuất, phiếu khác đã khóa hay chưa

// Phòng ban nhập từ nha cc => Khóa => Mới xuất dc
// Phòng ban đó chưa khóa phiếu => Thoogn báo
// Check hết chứ

// Nhưng mà chưa khóa vẫn sửa dc
// Vẫn ăn vào tồn kho, bảng kia thì vẫn cập nhật

// tạo phiếu xuất cũng phả check các phiếu phòng ban xuất đã khóa chưa
// Nhưng mà phiếu nhập chưa khóa vẫn htay đổi dc, nhập xong kiểm tra oke => khóa

// Nhập ngoài ID_Phieu1 là gì NoiNhap, auto kiểm tra ID_Phieu1 đúng k. La phòng ban của mifh thây
// kiểm tra hết cả pheiesu tạo, update tát cả các phiếu
// Các phiếu phòng ban khóa thf mới cho tạo tiếp
// Phiếu nhập nhà cc thì lấy ID_Noinhap check xem các IDPong ban = IDNoinhap đã khóa chưa
// Check hết, ví dụ có 2 pheiesu nhập. Thì muốn nhập phiếu thứ 2 thfi phải khóa phiếu 1 đi
// Nch là bh, thì check phòng ban thây. Kể cả xuất nhà cc khác thì phòng ban xuất phải check

