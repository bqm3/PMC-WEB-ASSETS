import { useCallback } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Iconify from 'src/components/iconify';
import Typography from '@mui/material/Typography';
// utils
import { fCurrency } from 'src/utils/format-number';
// types
import { ITaisan } from 'src/types/taisan';
// components
import { RHFTextField } from 'src/components/hook-form';

type Props = {
  taiSan: ITaisan[];
};

export default function PhieuNXNewEditDetails({ taiSan }: Props) {
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phieunxct',
  });

  const values = watch();

  const totalOnRow = values.phieunxct.map((item: any) => {
    if (item.isDelete === 0) {
      return item.Soluong * item.Dongia;
    }
    return 0;
  });
  const subTotal = totalOnRow.reduce((acc: number, curr: number) => acc + curr, 0);

  const handleAdd = () => {
    append({
      ID_Taisan: null,
      Soluong: 0,
      Dongia: 0,
      Tents: '',
      Tong: 0,
      Namsx: 0,
      isDelete: 0,
      isUpdate: 0,
    });
  };

  const handleRemove = (index: number) => {
    setValue(`phieunxct[${index}].isDelete`, 1);
    setValue(`phieunxct[${index}].isUpdate`, 1);
  };

  // const handleChangeQuantity = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
  //     setValue(`phieunxct[${index}].Soluong`, Number(event.target.value));
  //     setValue(
  //       `phieunxct[${index}].Tong`,
  //       values?.phieunxct[index]?.Soluong * values?.phieunxct[index]?.Dongia
  //     );
  //     setValue(`phieunxct[${index}].isUpdate`, 1);
  //   },
  //   [setValue, values?.phieunxct]
  // );

  // const handleChangePrice = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
  //     const inputValue = event.target.value;
  //     setValue(`phieunxct[${index}].Dongia`, inputValue);
  //     setValue(
  //       `phieunxct[${index}].Tong`,
  //       values.phieunxct[index]?.Soluong * Number(inputValue)
  //     );
  //     setValue(`phieunxct[${index}].isUpdate`, 1);
  //   },
  //   [setValue, values.phieunxct]
  // );

  const handleTaiSanChange = useCallback(
    (event: any, newValue: any, index: number) => {
      if (newValue) {
        const selectedOption = taiSan?.find((option) => option.ID_Taisan === newValue.ID_Taisan);
        if (selectedOption) {
          setValue(`phieunxct[${index}].ID_Taisan`, selectedOption.ID_Taisan);
          setValue(`phieunxct[${index}].Tents`, selectedOption.Tents);
          setValue(`phieunxct[${index}].isUpdate`, 1);
        }
      }
    },
    [setValue, taiSan]
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Phiếu nhập xuất chi tiết
      </Typography>
      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields?.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            {values?.phieunxct[index]?.isDelete === 0 && (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                <Controller
                  name={`phieunxct[${index}].ID_Taisan`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tài sản"
                      variant="outlined"
                      size="medium"
                      sx={{ minWidth: { md: 350, xs: 200 } }}
                      onChange={(event) => handleTaiSanChange(event, field.value, index)}
                    />
                  )}
                />
                <RHFTextField
                  size="medium"
                  type="number"
                  name={`phieunxct[${index}].Namsx`}
                  label="Năm sản xuất"
                  placeholder="0"
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
                <RHFTextField
                  size="medium"
                  type="number"
                  name={`phieunxct[${index}].Soluong`}
                  label="Số lượng"
                  placeholder="0"
                 // onChange={(event) => handleChangeQuantity(event, index)}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            )}
            <Button
              size="medium"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleRemove(index)}
            >
              Xóa
            </Button>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 1, borderStyle: 'dashed' }} />

      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="medium"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Thêm tài sản
        </Button>
      </Stack>

      <Stack spacing={2} alignItems="flex-end" sx={{ mt: 2, textAlign: 'right', typography: 'body2' }}>
        <Stack direction="row" sx={{ typography: 'subtitle1', gap: 1 }}>
          <Box>Tổng tiền:</Box>
          <Box>{fCurrency(subTotal) || '-'}</Box>
        </Stack>
      </Stack>
    </Box>
  );
}
