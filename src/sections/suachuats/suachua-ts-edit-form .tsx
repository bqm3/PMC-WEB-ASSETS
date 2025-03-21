import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { PATH_URL } from 'src/config-global';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material';
// hooks
import { useRouter } from 'src/routes/hooks';

// _mock
import { _tags, _roles, USER_GENDER_OPTIONS } from 'src/_mock';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
// types
import { ISuachuaTS } from 'src/types/taisan';
// components
import { useSnackbar } from 'src/components/snackbar';
// types
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import axios from 'axios';
import { useBoolean } from 'src/hooks/use-boolean';
import SuaChuaTSEditDetails from './suachua-ts-edit-detail';


// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

type Props = {
  currentSuaChuaTs?: ISuachuaTS;
  mutate?: any;
};

export default function SuachuatsNewForm({ currentSuaChuaTs, mutate }: Props) {
  const router = useRouter();

  const loadingSend = useBoolean();

  const [loading, setLoading] = useState<Boolean | any>(false);

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    Sophieu: Yup.string().required('Không được để trống'),
    Ngaygiao: Yup.mixed<any>().nullable().required('Phải có ngày giao'),
  });

  const defaultValues = useMemo(
    () => ({
      ID_SuachuaTS: currentSuaChuaTs?.ID_SuachuaTS || '',
      Sophieu: currentSuaChuaTs?.Sophieu || '',
      Ngaygiao: currentSuaChuaTs?.Ngaygiao || new Date(),
      Nguoitheodoi: currentSuaChuaTs?.Nguoitheodoi || '',
      suachuact: currentSuaChuaTs?.tb_suachuact || [
        {
          ID_TaisanQr: null,
          ID_Taisan: null,
          Ngaynhan: new Date(),
          Sotien: 0,
          isDelete: 0,
          Ghichu: '',
        },
      ],
    }),
    [currentSuaChuaTs]
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

  useEffect(() => {
    if (currentSuaChuaTs) {
      reset(defaultValues);
    }
  }, [currentSuaChuaTs, defaultValues, reset]);

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    await axios
      .put(`${PATH_URL}/tb_suachuats/update/${currentSuaChuaTs?.ID_SuachuaTS}`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(async (res) => {
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
      .put(`${PATH_URL}/tb_suachuats/close/${currentSuaChuaTs?.ID_SuachuaTS}`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(async (res) => {
        setLoading(false);
        await mutate()
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 2000,
          message: 'Khóa tài sản thành công',
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
        <Stack spacing={3} sx={{ p: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <RHFTextField
                name="Sophieu"
                defaultValue={defaultValues?.Sophieu}
                label="Số phiếu"
                fullWidth
              />


            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack width="100%">
                <DatePicker
                  label="Ngày giao"
                  value={new Date(values?.Ngaygiao)}
                  onChange={(newValue) => setValue('Ngaygiao', newValue)}

                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4}>
              <RHFTextField
                name="Nguoitheodoi"
                defaultValue={defaultValues?.Nguoitheodoi}
                label="Người theo dõi"
                fullWidth
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Grid>
  );

  return (
    <FormProvider methods={methods}>
      {renderDetails}
      <Card sx={{ mt: 3 }}>
        <SuaChuaTSEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        {currentSuaChuaTs && `${currentSuaChuaTs.iTinhtrang}` === `0` && (
          <>
            <Button size="large" variant="soft" color="primary" onClick={handleClose}>
              Khoá tài sản
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
