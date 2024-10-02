import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// types
import { IGroupPolicy, IPolicy, ITaisan, ITaisanQrCode } from 'src/types/taisan';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import moment from 'moment';

// ----------------------------------------------------------------------

type Props = {
  row: ITaisanQrCode;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onCreateRow: VoidFunction;
};

export default function TaiSanQrTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  onCreateRow,
}: Props) {
  const {
    ID_TaisanQr,
    ID_Taisan,
    Ngaykhoitao,
    ID_Donvi,
    MaQrCode,
    Giatri,
    iTinhtrang,
    Ghichu,
    ID_Phongban,
    ID_Connguoi,
    ent_phongbanda,
    ent_user,
    ent_taisan,
  } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}  sx={{
      '& .MuiTableCell-root': {
        borderBottom: '2px solid rgba(0, 0, 0, 0.05)', // Thicker border
      },
    }}>
      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          TS-{ID_Taisan}
        </Box>
      </TableCell>
      <TableCell> {ent_taisan.Tents} </TableCell>

      <TableCell> { moment(Ngaykhoitao).format('DD-MM-YYYY')} </TableCell>
      <TableCell> {MaQrCode} </TableCell>
      <TableCell> {fCurrency(Giatri) || ''} </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={
            (`${iTinhtrang}` === '1' && 'warning') ||
            (`${iTinhtrang}` === '0' && 'success') || 'default'
          }
        >
          {`${iTinhtrang}` === '1'  && 'Sửa chữa'}
          {`${iTinhtrang}` === '0'  && 'Sử dụng'}
          {`${iTinhtrang}` === '2'  && 'Thanh lý'}
        </Label>
        </TableCell>
      <TableCell> {ent_phongbanda?.Tenphongban} </TableCell>
      <TableCell> {ent_user?.Hoten} </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Xem
        </MenuItem>

        <MenuItem
          onClick={() => {
            onCreateRow();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:qrcode" />
          Ảnh Qr
        </MenuItem>
       
      </CustomPopover>

    
    </>
  );
}
