import { format } from 'date-fns';
import { styled } from '@mui/material/styles';
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
import { IGroupPolicy, INhaCC, INhomts } from 'src/types/taisan';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import moment from 'moment';

// ----------------------------------------------------------------------
const StyledTableCell = styled(TableCell)({
  overflow: 'hidden',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  whiteSpace: 'nowrap', // Prevent wrapping
  textOverflow: 'ellipsis', // Display ellipsis for truncated text
  maxWidth: '200px', // Set a max width for truncation
});

type Props = {
  row: INhaCC;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function CalvTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { ID_Nhacc, TenNhacc,MaNhacc, Masothue, Sodienthoai, Sotaikhoan, Nganhang, Nguoilienhe, Email, Thanhpho, Diachi, Ghichu } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow
      hover
      selected={selected}
      sx={{
        '& .MuiTableCell-root': {
          borderBottom: '2px solid rgba(0, 0, 0, 0.05)', // Thicker border
        },
      }}
    >
      <StyledTableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          NCC-{ID_Nhacc}
        </Box>
      </StyledTableCell>

      <StyledTableCell sx={{ alignItems: 'center' }}>{MaNhacc}</StyledTableCell>
      <StyledTableCell sx={{ alignItems: 'center' }}>{TenNhacc}</StyledTableCell>
      <StyledTableCell sx={{ alignItems: 'center' }}>{Masothue}</StyledTableCell>
      <StyledTableCell sx={{ alignItems: 'center' }}>{Sodienthoai}</StyledTableCell>
      <StyledTableCell sx={{ alignItems: 'center' }}>{Sotaikhoan}</StyledTableCell>
      <StyledTableCell sx={{ alignItems: 'center' }}>{Nganhang}</StyledTableCell>
      {/* <StyledTableCell sx={{ alignItems: 'center' }}>{Nguoilienhe || "null"}</StyledTableCell>
      <StyledTableCell sx={{ alignItems: 'center' }}>{Email || "null"}</StyledTableCell> */}
      <StyledTableCell sx={{ alignItems: 'center' }}>{Thanhpho}</StyledTableCell>
      {/* <StyledTableCell sx={{ alignItems: 'center' }}>{Diachi}</StyledTableCell> */}
      <StyledTableCell sx={{ alignItems: 'center' }}>{Ghichu}</StyledTableCell>
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
            confirm.onTrue();
            popover.onClose();
            onDeleteRow()
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>
      </CustomPopover>
    </>
  );
}
