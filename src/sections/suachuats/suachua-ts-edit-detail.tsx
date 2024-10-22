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

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { useGetNhomts, useGetTaisan, useGetTaisanQrCode } from 'src/api/taisan';
import { fCurrency } from 'src/utils/format-number';
// ----------------------------------------------------------------------

export default function SuaChuaTsEditDetails() {
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
    setValue(`suachuact[${index}].isDelete`, 1);
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
      setValue(`suachuact[${index}].Ghichu`, inputValue);
    },
    [setValue]
  );

  const handleTaiSanChange = useCallback(
    (event: any, index: number) => {
      const inputValue = event.target.value;
      setValue(`suachuact[${index}].ID_TaisanQr`, inputValue);
    },
    [setValue]
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
      <Typography variant="h6" sx={{  mb: 3 }}>
        Sửa chữa chi tiết:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <>
            {
              values.suachuact[index].isDelete === 0 &&
              <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                  <RHFSelect
                    name="ID_TaisanQr"
                    defaultValue={watch(`suachuact[${index}].ID_TaisanQr`) || ''}
                    onChange={(event: any) => handleTaiSanChange(event, index)}
                    label="Tài sản"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                  >
                    {taisanqr?.map((i: any) => (
                      <MenuItem key={`${i?.ID_TaisanQr}`} value={`${i?.ID_TaisanQr}`}>
                        {i?.ent_taisan.Tents}
                      </MenuItem>
                    ))}
                  </RHFSelect>

                  <RHFTextField
                    size="medium"
                    type="number"
                    name={`suachuact[${index}].Sotien`}
                    label="Số tiền"
                    placeholder="0"
                    onChange={(event) => handleChangeSotien(event, index)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <DatePicker
                    sx={{ width: '100%' }}
                    label="Ngày nhận"
                    defaultValue={new Date(values.suachuact[index].Ngaynhan)}
                    onChange={(newValue) => setValue(`suachuact[${index}].Ngaynhan`, newValue)}
                  />

                  <RHFTextField
                    size="medium"
                    type="string"
                    name={`suachuact[${index}].Ghichu`}
                    label="Ghi chú"
                    onChange={(event) => handleChangeGhichu(event, index)}
                  />
                </Stack>

                {(`${values.iTinhtrang}` === '0' || `${values.iTinhtrang}` === '') && (
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
            }
          </>
        ))}
      </Stack>

      {(`${values.iTinhtrang}` === '0' || `${values.iTinhtrang}` === '') && (
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
              Thêm phiếu
            </Button>
          </Stack>
        </>
      )}

      {renderTotal}
    </Box>
  );
}
