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
  dataPhieu: any;
  loadingFilter: boolean;
};

export default function PhieuNXNewEditDetails({ dataPhieu, loadingFilter }: Props) {
  loadingFilter = true;
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'giaonhantsct',
  });

  const values = watch();

  const totalOnRow = values.giaonhantsct.map((item: any) => {
    if (item.isDelete === 0) {
      return item.Soluong * item.Dongia;
    }
    return 0; // Return 0 or whatever default value you prefer when isDelete is not 0
  });
  const subTotal = sum(totalOnRow);

  const handleAdd = () => {
    append({
      ID_Taisan: null,
      ID_TaisanQrcode: null,
      Soluong: 0,
      Dongia: 0,
      isUpdate: 0,
      Tong: 0,
      Namsx: 0,
      isDelete: 0,
    });
  };

  // const handleRemove = (index: number) => {
  //   setValue(`giaonhantsct[${index}].isDelete`, 1);
  //   setValue(`giaonhantsct[${index}].isUpdate`, 1);
  // };

  const handleRemove = (index: number) => {
    remove(index);
  };
  

  const handleChangeQuantity = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const newValue = Number(event.target.value);
      if (newValue === 1) {
        // Nếu số lượng nhập vào là 1, không cho phép sửa
        setValue(`giaonhantsct[${index}].Soluong`, 1);
      } else {
        setValue(`giaonhantsct[${index}].isUpdate`, 1);
        setValue(`giaonhantsct[${index}].Soluong`, newValue);
      }

      
    },
    [setValue]
  );

  const handleChangeTinhtrangmay = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const newValue = event.target.value;
      setValue(`giaonhantsct[${index}].Tinhtrangmay`, newValue);
      setValue(`giaonhantsct[${index}].isUpdate`, 1);
    },
    [setValue]
  );

  const handleChangeCactllienquan = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const newValue = event.target.value;
      setValue(`giaonhantsct[${index}].Cactllienquan`, newValue);
      setValue(`giaonhantsct[${index}].isUpdate`, 1);
    },
    [setValue]
  );

  const handleTaiSanChange = useCallback(
    (event: any, newValue: any, index: number) => {
      if (newValue) {
        // Find the selected option from taisan
        const selectedOption = dataPhieu?.resultTS?.find(
          (option: any) => `${option.ID_Taisan}` === `${newValue.ID_Taisan}`
        );
        if (selectedOption) {
          // Set the corresponding ID_Taisan value in the form state
          setValue(`giaonhantsct[${index}].ID_Taisan`, selectedOption.ID_Taisan);
          setValue(`giaonhantsct[${index}].ID_TaisanQrcode`, selectedOption.ID_TaisanQrcode);
          setValue(`giaonhantsct[${index}].Namsx`, selectedOption.Namsx || 0);
          setValue(
            `giaonhantsct[${index}].Soluong`,
            selectedOption.MaQrCode ? 1 : selectedOption.Tonsosach
          );
        }
      }
    },
    [setValue, dataPhieu]
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Phiếu nhập xuất chi tiết:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields?.map((item, index) => (
          <>
            {`${values?.giaonhantsct[index]?.isDelete}` === '0' && (
              <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <Controller
                    name={`giaonhantsct[${index}].ID_Taisan`}
                    control={control}
                    render={() => (
                      <Autocomplete
                        options={dataPhieu?.resultTS?.map((option: any) => option) || []}
                        getOptionLabel={(option: any) =>
                          typeof option?.ent_taisan?.Tents === 'string'
                            ? `${option?.ent_taisan?.Tents} ${option?.MaQrCode || ``}`
                            : String(option?.ent_taisan?.Tents)
                        }
                        onChange={(event, newValue) => handleTaiSanChange(event, newValue, index)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tài sản"
                            variant="outlined"
                            size="medium"
                            sx={{ minWidth: { md: 350, xs: 200 } }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} key={option?.ID_Taisan}>
                            {option?.ent_taisan?.Tents} (
                            {option?.MaQrCode || `Tài sản không có mã qrcode`})
                          </li>
                        )}
                      />
                    )}
                  />

                  <RHFTextField
                    size="medium"
                    type="number"
                    name={`giaonhantsct[${index}].Namsx`}
                    label="Năm sản xuất"
                    placeholder="0"
                    InputLabelProps={{ shrink: true }}
                    disabled
                    // sx={{ maxWidth: { md: 96 } }}
                  />

                  <RHFTextField
                    size="medium"
                    type="number"
                    name={`giaonhantsct[${index}].Soluong`}
                    label="Số lượng"
                    placeholder="0"
                    onChange={(event) => handleChangeQuantity(event, index)}
                    InputLabelProps={{ shrink: true }}
                    disabled={values.giaonhantsct[index]?.Soluong === 1}
                  />

                  <RHFTextField
                    size="medium"
                    name={`giaonhantsct[${index}].Tinhtrangmay`}
                    label="Tình trạng máy"
                    placeholder="Tình trạng máy"
                    onChange={(event) => handleChangeTinhtrangmay(event, index)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <RHFTextField
                    size="medium"
                    name="Cactllienquan"
                    label="Các tài liệu liên quan"
                    placeholder="Các tài liệu liên quan"
                    onChange={(event) => handleChangeCactllienquan(event, index)}
                    InputLabelProps={{ shrink: true }}
                    // sx={{ maxWidth: { md: 96 } }}
                  />
                </Stack>

                <Button
                  size="medium"
                  color="error"
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  onClick={() => handleRemove(index)}
                >
                  Xóa
                </Button>
              </Stack>
            )}
          </>
        ))}
      </Stack>

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
    </Box>
  );
}
