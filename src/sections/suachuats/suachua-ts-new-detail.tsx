import sum from 'lodash/sum';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Iconify from 'src/components/iconify';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { useGetNhomts, useGetTaisan, useGetTaisanQrCode } from 'src/api/taisan';
import { fCurrency } from 'src/utils/format-number';
// ----------------------------------------------------------------------

export default function InvoiceNewEditDetails() {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'suachuact',
  });

  const values = watch();

  const totalOnRow = values.suachuact.map((item: any) => item.Sotien);

  const subTotal = sum(totalOnRow);

  const { taisanqr } = useGetTaisanQrCode();

  const handleAdd = () => {
    append({
      ID_TaisanQr: null,
      ID_Taisan: null,
      Ngaynhan: new Date(),
      Sotien: 0,
      isDelete: 0,
      Ghichu: '',
    });
  };

  const handleRemove = (index: number) => {
    remove(index)
  };

  const handleChangeSotien = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      setValue(`suachuact[${index}].Sotien`, Number(event.target.value));
     
    },
    [setValue]
  );

  const handleChangeGhichu = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const inputValue = event.target.value;
      // const numericString = inputValue.replace(/[^\d]/g, '');
      setValue(`suachuact[${index}].Ghichu`, inputValue);

     
    },
    [setValue]
  );

  const handleTaiSanChange = useCallback(
    (event: any, newValue: any, index: number) => {
      if (newValue) {
        // Find the selected option from taisan
        const selectedOption = taisanqr.find((option) => option.ID_TaisanQr === newValue.ID_TaisanQr);
        if (selectedOption) {
          // Set the corresponding ID_Taisan value in the form state
          setValue(`suachuact[${index}].ID_TaisanQr`, selectedOption.ID_TaisanQr);
        }
      }
    },
    [setValue, taisanqr]
  );

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
        Sửa chữa chi tiết:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <Controller
                name={`suachuact[${index}].ID_TaisanQr`}
                control={control}
                render={() => (
                  <Autocomplete
                    options={taisanqr.map((option: any) => option)}
                    getOptionLabel={(option) =>
                      typeof option.ent_taisan.Tents === 'string' ? option.ent_taisan.Tents : String(option.ent_taisan.Tents)
                    }
                    onChange={(event, newValue) => handleTaiSanChange(event, newValue, index)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tài sản Qr"
                        variant="outlined"
                        size="medium"
                        sx={{ minWidth: { md: 400, xs: 250 } }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.ID_TaisanQr}>
                        {option.ent_taisan.Tents}
                      </li>
                    )}
                  />
                )}
              />

              <RHFTextField
                size="medium"
                type="number"
                name={`suachuact[${index}].Sotien`}
                label="Số tiền"
                placeholder="0"
                onChange={(event) => handleChangeSotien(event, index)}
                InputLabelProps={{ shrink: true }}
                // sx={{ maxWidth: { md: 96 } }}
              />

              <Controller
                name={`suachuact[${index}].Ngaynhan`}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Ngày nhận"
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

              <RHFTextField
                size="medium"
                type="string"
                name={`suachuact[${index}].Ghichu`}
                label="Ghi chú"
                onChange={(event) => handleChangeGhichu(event, index)}
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
          Thêm
        </Button>
      </Stack>

      {renderTotal}
    </Box>
  );
}
