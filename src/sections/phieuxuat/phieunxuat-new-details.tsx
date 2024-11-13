import sum from 'lodash/sum';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

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
  ID_Nghiepvu: any;
};

export default function PhieuNXNewEditDetails({ taiSan, ID_Nghiepvu }: Props) {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phieunccct',
  });

  const values = watch();
  const [open, setOpen] = useState(false);
  const [indexPhieu, setIndexPhieu] = useState<any>(0);

  // Mở hộp thoại xác nhận
  const handleClickOpen = (index: number) => {
    setOpen(true);
    setIndexPhieu(index);
  };

  // Đóng hộp thoại xác nhận
  const handleClose = () => {
    setOpen(false);
  };

  // Xử lý xác nhận xóa
  const handleConfirmRemove = () => {
    // Thực hiện hành động xóa
    handleRemove(indexPhieu);
    handleClose(); // Đóng hộp thoại sau khi xóa
  };

  const totalOnRow = values?.phieunccct?.map((item: any) => {
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
      Tents: "",
      Tong: 0,
      Namsx: 0,
      isDelete: 0,
      isUpdate: 0,
    });
  };

  const handleRemove = (index: number) => {
    setValue(`phieunccct[${index}].isDelete`, 1);
    setValue(`phieunccct[${index}].isUpdate`, 1);
  };

  const handleChangeQuantity = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      setValue(`phieunccct[${index}].Soluong`, Number(event.target.value));
      setValue(
        `phieunccct[${index}].Tong`,
        values.phieunccct.map((item: any) => item.Soluong * item.Dongia)[index]
      );
      setValue(`phieunccct[${index}].isUpdate`, 1);
    },
    [setValue, values.phieunccct]
  );

  const handleChangePrice = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const inputValue = event.target.value;
      // const numericString = inputValue.replace(/[^\d]/g, '');
      setValue(`phieunccct[${index}].Dongia`, inputValue);
      setValue(`phieunccct[${index}].isUpdate`, 1);

      setValue(
        `phieunccct[${index}].Tong`,
        values.phieunccct.map((item: any) => item.Soluong * item.Dongia)[index]
      );
    },
    [setValue, values.phieunccct]
  );

  const handleChangeYear = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const inputValue = event.target.value;
      setValue(`phieunccct[${index}].Namsx`, Number(inputValue));
      setValue(`phieunccct[${index}].isUpdate`, 1);
    },
    [setValue]
  );

  const handleTaiSanChange = useCallback(
    (event: any, newValue: any, index: number) => {
      if (newValue) {
        // Find the selected option from taisan
        const selectedOption = taiSan?.find((option) => option.ID_Taisan === newValue.ID_Taisan);
        if (selectedOption) {
          // Set the corresponding ID_Taisan value in the form state
          setValue(`phieunccct[${index}].ID_Taisan`, selectedOption.ID_Taisan);
          setValue(`phieunccct[${index}].Tents`, selectedOption.Tents);
          setValue(`phieunccct[${index}].isUpdate`, 1);
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
      sx={{ mt: 2, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row" sx={{ typography: 'subtitle1', gap: 1 }}>
        <Box>Tổng tiền: </Box>
        <Box>{fCurrency(subTotal) || '-'}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Phiếu nhập xuất chi tiết:
      </Typography>

      <Stack spacing={2}>
        {fields?.map((item, index) => (
          <>
            {`${values?.phieunccct[index]?.isDelete}` === '0' && (
              <Stack
                divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
                key={item.id}
                alignItems="flex-end"
                spacing={1.5}
              >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <Controller
                    name={`phieunccct[${index}].ID_Taisan`}
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        disabled={ID_Nghiepvu !== 2 && true}
                        options={taiSan?.map((option: any) => option)}
                        getOptionLabel={(option) =>
                          typeof option.Tents === 'string' ? option.Tents : String(option.Tents)
                        }
                        value={
                          taiSan.find((option: any) => option.ID_Taisan === field.value) || null
                        }
                        onChange={(event, newValue) => {
                          handleTaiSanChange(event, newValue, index);
                          field.onChange(newValue ? newValue.ID_Taisan : null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tài sản"
                            variant="outlined"
                            size="medium"
                            sx={{ minWidth: { md: 400, xs: 300 } }}
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
                    disabled={ID_Nghiepvu !== 2 && true}
                    size="medium"
                    type="number"
                    name={`phieunccct[${index}].Namsx`}
                    label="Năm sản xuất"
                    placeholder="0"
                    onChange={(event) => handleChangeYear(event, index)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ maxWidth: { md: 120 } }}
                  />

                  <RHFTextField
                    disabled={
                      ID_Nghiepvu !== 2 &&
                      values?.phieunccct[index]?.ID_TaisanQrcode !== null &&
                      true
                    }
                    size="medium"
                    type="number"
                    name={`phieunccct[${index}].Soluong`}
                    label="Số lượng"
                    placeholder="0"
                    onChange={(event) => handleChangeQuantity(event, index)}
                    InputLabelProps={{ shrink: true }}

                    sx={{ maxWidth: { md: 120 } }}
                  />

                  <RHFTextField
                    disabled={ID_Nghiepvu !== 2 && true}
                    size="medium"
                    type="number"
                    name={`phieunccct[${index}].Dongia`}
                    label="Đơn giá"
                    sx={{ maxWidth: { md: 180 } }}
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
                    name={`phieunccct[${index}].Tong`}
                    label="Tổng tiền"
                    placeholder="0.00"
                    value={
                      values.phieunccct[index]?.Tong === 0
                        ? ''
                        : formatCash(values.phieunccct[index]?.Tong)
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
                      [`& .${inputBaseClasses.input}`]: {
                        textAlign: { md: 'left' },
                      },
                    }}
                  />
                </Stack>

                <Button
                  size="medium"
                  color="error"
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  onClick={() => handleClickOpen(index)}
                >
                  Xóa
                </Button>
              </Stack>
            )}
          </>
        ))}
      </Stack>

      {ID_Nghiepvu !== 5 && (
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
      )}

      {renderTotal}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa tài sản này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmRemove} color="error" autoFocus variant="contained">
            Xóa
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
