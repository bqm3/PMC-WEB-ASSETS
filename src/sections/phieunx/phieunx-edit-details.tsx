import sum from 'lodash/sum';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Iconify from 'src/components/iconify';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { inputBaseClasses } from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
// utils
import { fCurrency } from 'src/utils/format-number';
// _mock
import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';
// types
import { IInvoiceItem } from 'src/types/invoice';
// components
import { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { useGetNhomts, useGetTaisan } from 'src/api/taisan';
import { ITaisan } from 'src/types/taisan';

// ----------------------------------------------------------------------
type Props = {
  taiSan: ITaisan[];
};

export default function PhieuNXEditDetails({ taiSan }: Props) {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phieunxct',
  });

  const values = watch();

  const totalOnRow = values.phieunxct.map((item: any) => {
    if (item.isDelete === 0) {
      return item.Soluong * item.Dongia;
    }
    return 0; // Return 0 or whatever default value you prefer when isDelete is not 0
  });

  const subTotal = sum(totalOnRow);

  const handleAdd = () => {
    append({
      ID_Taisan: null,
      Soluong: 0,
      Dongia: 0,
      Namsx: 0,
      Tong: 0,
      isDelete: 0,
    });
  };

  const handleRemove = (index: number) => {
    setValue(`phieunxct[${index}].isDelete`, 1);
  };

  const handleChangeQuantity = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      setValue(`phieunxct[${index}].Soluong`, Number(event.target.value));
      setValue(
        `phieunxct[${index}].Tong`,
        values.phieunxct.map((item: any) => item.Soluong * item.Dongia)[index]
      );
    },
    [setValue, values.phieunxct]
  );

  const handleChangePrice = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const inputValue = event.target.value;
      // const numericString = inputValue.replace(/[^\d]/g, '');
      setValue(`phieunxct[${index}].Dongia`, inputValue);

      setValue(
        `phieunxct[${index}].Tong`,
        values.phieunxct.map((item: any) => item.Soluong * item.Dongia)[index]
      );
    },
    [setValue, values.phieunxct]
  );

  const handleChangeYear = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const inputValue = event.target.value;
      setValue(`phieunxct[${index}].Namsx`, Number(inputValue));
    },
    [setValue]
  );

  const handleTaiSanChange = useCallback(
    (event: any, newValue: any, index: number) => {
      if (newValue) {
        // Find the selected option from taisan
        const selectedOption = taiSan.find((option) => option.ID_Taisan === newValue.ID_Taisan);
        if (selectedOption) {
          // Set the corresponding ID_Taisan value in the form state
          setValue(`phieunxct[${index}].ID_Taisan`, selectedOption.ID_Taisan);
        }
      }
    },
    [setValue, taiSan]
  );

  const formatCash = (input: string) => {
    const str = String(input);
    // Loại bỏ tất cả các ký tự không phải số
    const numericString = str.replace(/[^\d]/g, '');

    // Chuyển chuỗi thành mảng các ký tự
    const reversedArray = numericString.split('').reverse();

    // Tạo mảng để lưu trữ các phần đã định dạng
    const formattedArray = reversedArray.reduce((acc: string[], digit: string, index: number) => {
      // Thêm dấu phẩy sau mỗi 3 ký tự (trừ khi ở cuối mảng)
      if (index > 0 && index % 3 === 0) {
        acc.push(',');
      }
      acc.push(digit);
      return acc;
    }, []);

    // Đảo ngược lại mảng và nối các phần lại thành chuỗi
    return formattedArray.reverse().join('');
  };

  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>Tổng tiền</Box>
        <Box sx={{ width: 160 }}>{fCurrency(subTotal) || '-'}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Phiếu nhập xuất chi tiết:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <>
            {values.phieunxct[index].isDelete === 0 && (
              <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <Controller
                    name={`phieunxct[${index}].ID_Taisan`}
                    control={control}
                    defaultValue={`phieunxct[${index}].ent_taisan` || ''} // Ensure item?.ID_Taisan is correctly populated
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={taiSan}
                        getOptionLabel={(option: any) =>
                          taiSan.find((i: any) => `${i.ID_Taisan}` === `${option}`)?.Tents || ''
                        }
                        onChange={(event, newValue) => handleTaiSanChange(event, newValue, index)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tài sản"
                            variant="outlined"
                            size="medium"
                            sx={{ minWidth: { md: 400, xs: 250 } }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option.ID_Taisan}>
                            {option.Tents}
                          </li>
                        )}
                      />
                    )}
                  />

                  <RHFTextField
                    size="medium"
                    type="number"
                    name={`phieunxct[${index}].Namsx`}
                    label="Năm sản xuất"
                    placeholder="0"
                    onChange={(event) => handleChangeYear(event, index)}
                    InputLabelProps={{ shrink: true }}
                    // sx={{ maxWidth: { md: 96 } }}
                  />

                  <RHFTextField
                    size="medium"
                    type="number"
                    name={`phieunxct[${index}].Soluong`}
                    label="Số lượng"
                    placeholder="0"
                    onChange={(event) => handleChangeQuantity(event, index)}
                    InputLabelProps={{ shrink: true }}
                    // sx={{ maxWidth: { md: 96 } }}
                  />

                  <RHFTextField
                    size="medium"
                    type="number"
                    name={`phieunxct[${index}].Dongia`}
                    label="Đơn giá"
                    onChange={(event) => handleChangePrice(event, index)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
                            <span>&#8363;</span>
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <RHFTextField
                    disabled
                    size="medium"
                    type="string"
                    name={`phieunxct[${index}].Tong`}
                    label="Tổng tiền"
                    placeholder="0.00"
                    value={
                      values.phieunxct[index]?.Tong === 0 ||
                      values.phieunxct[index]?.Tong === undefined
                        ? values.phieunxct[index].Soluong * values.phieunxct[index].Dongia
                        : formatCash(values.phieunxct[index]?.Tong)
                    }
                    onChange={(event) => handleChangePrice(event, index)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>
                            <span>&#8363;</span>
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      minWidth: { md: 150 },
                      maxWidth: { md: 180 },
                      [`& .${inputBaseClasses.input}`]: {
                        textAlign: { md: 'left' },
                      },
                    }}
                  />
                </Stack>

                {(values.iTinhtrang === '0' || values.iTinhtrang === '') && (
                  <Button
                    size="medium"
                    color="error"
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    onClick={() => handleRemove(index)}
                  >
                    Xóa
                  </Button>
                )}
              </Stack>
            )}
          </>
        ))}
      </Stack>

      {(values.iTinhtrang === '0' || values.iTinhtrang === '') && (
        <>
          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

          <Stack
            spacing={3}
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
        </>
      )}

      {renderTotal}
    </Box>
  );
}
