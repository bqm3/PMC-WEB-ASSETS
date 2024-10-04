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
import { IConnguoi, IGroupPolicy } from 'src/types/taisan';
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
  row: IConnguoi;
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
  const { ID_Connguoi, MaPMC, Hoten, Gioitinh, Diachi, Sodienthoai, Ghichu, ent_nhansupbda } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const getTinhtrangLabel = (iTinhtrang: number) => {
    switch (iTinhtrang) {
      case 1:
        return (
          <Label color="success" sx={{ textTransform: 'none' }}>
            Đang làm việc
          </Label>
        );
      case 2:
        return (
          <Label color="warning" sx={{ textTransform: 'none' }}>
            Chuyển công tác
          </Label>
        );
      case 3:
        return (
          <Label color="error" sx={{ textTransform: 'none' }}>
            Nghỉ làm
          </Label>
        );
      default:
        return (
          <Label color="default" sx={{ textTransform: 'none' }}>
            Không xác định
          </Label>
        );
    }
  };

  // Generate labels for all ent_nhansupbda entries
  const tinhtrangLabels = ent_nhansupbda
    ? ent_nhansupbda.map(
        (item, index) =>
          `${item.isDelete}` === '0' && (
            <Box key={index} sx={{ mb: 0.5 }}>
              {getTinhtrangLabel(Number(item.iTinhtrang))}
            </Box>
          )
      )
    : 'Không xác định';

  const phongBanDA = ent_nhansupbda.map((item, index) => `${item.isDelete}` === '0' && `${item.ent_phongbanda.Tenphongban}`)

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
          U-{ID_Connguoi}
        </Box>
      </StyledTableCell>

      <StyledTableCell>{MaPMC}</StyledTableCell>
      <StyledTableCell>{Hoten}</StyledTableCell>
      <StyledTableCell>{Diachi}</StyledTableCell>
      <StyledTableCell>{Sodienthoai}</StyledTableCell>
      <StyledTableCell>{tinhtrangLabels}</StyledTableCell>
      <StyledTableCell>{phongBanDA}</StyledTableCell>

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
        <MenuItem
          onClick={() => {
            onShowRow();
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
