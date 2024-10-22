import { useCallback } from 'react';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// types
import { IPhongBanTableFilters, IPhongBanTableFilterValue } from 'src/types/taisan';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  filters: IPhongBanTableFilters;
  onFilters: (name: string, value: IPhongBanTableFilterValue) => void;
  //
  canReset: boolean;
  dateError: boolean;
  onResetFilters: VoidFunction;
  statusOptions: {
    value: string | null;
    label: string | null;
  }[];
};

export default function OrderTableToolbar({
  filters,
  onFilters,
  //
  canReset,
  dateError,
  onResetFilters,
  statusOptions,
}: Props) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  const handleFilterPublish = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'publish',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      {statusOptions && statusOptions.length > 0 && (
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>Phòng ban dự án</InputLabel>

          <Select
            multiple
            value={filters.publish}
            onChange={handleFilterPublish}
            input={<OutlinedInput label="Phòng ban dự án" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            sx={{ textTransform: 'capitalize' }}
          >
            {statusOptions?.map((option: any) => (
              <MenuItem key={option?.value} value={option?.value}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.publish.includes(option?.value)}
                />
                {option?.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <DatePicker
          label="Ngày bắt đầu"
          value={filters.startDate}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 180 },
          }}
        />

        <DatePicker
          label="Ngày kết thúc"
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
            },
          }}
          sx={{
            maxWidth: { md: 180 },
          }}
        />

        <TextField
          fullWidth
          value={filters.name}
          onChange={handleFilterName}
          placeholder="Tìm kiếm..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <IconButton onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>

      {canReset && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      )}
    </Stack>
  );
}
