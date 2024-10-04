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
import Label from 'src/components/label';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// types
import { IConnguoi, IGroupPolicy, IUser } from 'src/types/taisan';
// components
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
  row: IUser;
  selected: boolean;
  onViewRow: VoidFunction;
  onShowRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function CalvTableRow({
  row,
  selected,
  onViewRow,
  onShowRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { ID_User,Anh, Diachi, Gioitinh,Hoten, Emails, ent_chinhanh, ent_chucvu, ent_phongbanda, ent_nhompb, MaPMC, Sodienthoai  } = row;

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
          U-{ID_User}
        </Box>
      </StyledTableCell>

      <StyledTableCell>{MaPMC}</StyledTableCell>
      <StyledTableCell>{Hoten}</StyledTableCell>
      
      <StyledTableCell>{ent_phongbanda?.Tenphongban}</StyledTableCell>
      
      <StyledTableCell>{ent_chucvu?.Chucvu}</StyledTableCell>
      <StyledTableCell>{ent_nhompb?.Nhompb}</StyledTableCell>
      <StyledTableCell>{ent_chinhanh?.Tenchinhanh}</StyledTableCell>

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
          <Iconify icon="solar:pen-bold" />
          Cập nhật
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            onShowRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Xem
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="PMC thông báo"
        content="Bạn có thực sự muốn xóa không?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Xóa
          </Button>
        }
      />
    </>
  );
}
