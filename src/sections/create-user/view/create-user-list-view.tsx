import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
// @mui
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import { useGetConNguoi, useGetGroupPolicy, useGetNhomPb } from 'src/api/taisan';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useSnackbar } from 'src/components/snackbar';
// types
import { IKhuvucTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc';

import {
  IConnguoi,
  INhompb,
  ITaisanTableFilters,
} from 'src/types/taisan';
//
import CreateUserTableRow from '../create-user-table-row';
import GiamsatTableToolbar from '../create-user-table-toolbar';
import GiamsatTableFiltersResult from '../create-user-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Connguoi', label: 'Mã', width: 100 },
  { id: 'MaPMC', label: 'Mã truy cập', width: 150 },
  { id: 'Hoten', label: 'Họ tên', width: 150 },
  { id: 'Gioitinh', label: 'Giới tính', width: 150 },
  { id: 'Diachi', label: 'Địa chỉ', width: 180 },
  { id: 'Sodienthoai', label: 'Số điện thoại', width: 150 },
  { id: '', width: 88 },
];

const defaultFilters: ITaisanTableFilters= {
  name: '',
  status: 'all',startDate: null, endDate: null
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function GroupPolicyListView() {
  const table = useTable({ defaultOrderBy: 'ID_Connguoi' });

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();

  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { connguoi, mutateConnguoi } = useGetConNguoi();

  const { nhompb } = useGetNhomPb();

  const [tableData, setTableData] = useState<IConnguoi[]>([]);

  const [dataSelect, setDataSelect] = useState<IConnguoi>();

  useEffect(() => {
    if (connguoi?.length > 0) {
      setTableData(connguoi);
    }
  }, [connguoi, mutateConnguoi]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (dataSelect) {
      // Update the corresponding field in `dataSelect`
      setDataSelect({
        ...dataSelect,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setDataSelect((prev: any) => ({
      ...prev,
      [name]: `${value}`,
    }));
  };

  const handleFilters = useCallback(
    (name: string, value: IKhuvucTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const GroupPolicySchema = Yup.object().shape({
    GroupPolicy: Yup.string().required('Không được để trống'),
  });

  const defaultValues = {
    GroupPolicy: '',
  };

  const methods = useForm({
    resolver: yupResolver(GroupPolicySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await axios
        .put(
          `https://checklist.pmcweb.vn/pmc-assets/api/ent_connguoi/delete/${id}`,

          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_Connguoi !== id);
          setTableData(deleteRow);

          table.onUpdatePageDeleteRow(dataInPage.length);
          enqueueSnackbar('Xóa thành công!');
        })
        .catch((error) => {
          if (error.response) {
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `${error.response.data.message}`,
            });
          } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `Không nhận được phản hồi từ máy chủ`,
            });
          } else {
            // Lỗi khi cấu hình request
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `Lỗi gửi yêu cầu`,
            });
          }
        });
    },
    [accessToken, enqueueSnackbar, dataInPage.length, table, tableData] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (data: IConnguoi) => {
      confirm.onTrue();
      popover.onClose();
      setDataSelect(data);
    },
    [confirm, popover]
  );

  const handleUpdate = useCallback(
    async (id: string) => {
      await axios
        .put(`https://checklist.pmcweb.vn/pmc-assets/api/ent_connguoi/update/${id}`, dataSelect, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          reset();
          confirm.onFalse();
          popover.onClose();
          await mutateConnguoi();

          enqueueSnackbar({
            variant: 'success',
            autoHideDuration: 2000,
            message: 'Cập nhật thành công',
          });
        })
        .catch((error) => {
          if (error.response) {
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `${error.response.data.message}`,
            });
          } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `Không nhận được phản hồi từ máy chủ`,
            });
          } else {
            // Lỗi khi cấu hình request
            enqueueSnackbar({
              variant: 'error',
              autoHideDuration: 2000,
              message: `Lỗi gửi yêu cầu`,
            });
          }
        });
    },
    [accessToken, enqueueSnackbar, reset, dataSelect, confirm, popover, mutateConnguoi] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Danh sách tài khoản"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            { name: 'Danh sách' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          
          <GiamsatTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <GiamsatTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered?.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_Connguoi))
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData?.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Connguoi))
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <CreateUserTableRow
                        key={row.ID_Connguoi}
                        row={row}
                        selected={table.selected.includes(row.ID_Connguoi)}
                        onSelectRow={() => table.onSelectRow(row.ID_Connguoi)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Connguoi)}
                        onViewRow={() => handleViewRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData?.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered?.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <GroupPolicyDialog
        open={confirm.value}
        dataSelect={dataSelect}
        onClose={confirm.onFalse}
        onChange={handleInputChange}
        handleUpdate={handleUpdate}
        nhompb={nhompb}
        handleSelectChange={handleSelectChange}
      />

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: IConnguoi[];
  comparator: (a: any, b: any) => number;
  filters: ITaisanTableFilters;
  // dateError: boolean;
}) {
  const { status, name } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (order) =>
        order.Hoten.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Diachi.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Sodienthoai.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.MaPMC.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.ent_nhompb.Nhompb.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

interface ConfirmTransferDialogProps {
  open: boolean;
  dataSelect?: IConnguoi;
  onClose: VoidFunction;
  nhompb: INhompb[];
  handleUpdate: (id: string) => void;
  onChange: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSelectChange: any;
}

function GroupPolicyDialog({
  open,
  dataSelect,
  nhompb,
  onChange,
  onClose,
  onBlur,
  handleUpdate,
  handleSelectChange,
}: ConfirmTransferDialogProps) {
  const idGroupPolicy = dataSelect?.ID_Connguoi;

  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Cập nhật</DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        <Stack spacing={3} sx={{ p: 3 }}>
          {nhompb?.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Nhóm phòng ban</InputLabel>
              <Select
                name="ID_Nhompb"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dataSelect?.ID_Nhompb}
                label="Nhóm phòng ban"
                onChange={handleSelectChange}
              >
                {nhompb?.map((item) => (
                  <MenuItem key={item?.ID_Nhompb} value={item?.ID_Nhompb}>
                    {item?.Nhompb}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            name="Hoten"
            label="Họ tên" // Vietnamese for "Category Name"
            value={dataSelect?.Hoten}
            onChange={onChange} // Update local state and notify parent
            fullWidth
            onBlur={onBlur}
          />
          <TextField
            name="Diachi"
            label="Địa chỉ" // Vietnamese for "Category Name"
            value={dataSelect?.Diachi}
            onChange={onChange} // Update local state and notify parent
            fullWidth
          />
          <Stack spacing={1} sx={{ p: 1.5 }}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Giới tính</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={dataSelect?.Gioitinh}
                name="Gioitinh"
                onChange={handleSelectChange}
                row
              >
                <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
              </RadioGroup>
            </FormControl>
          </Stack>
          <TextField
            name="Sodienthoai"
            label="Số điện thoại" // Vietnamese for "Category Name"
            value={dataSelect?.Sodienthoai}
            onChange={onChange} // Update local state and notify parent
            fullWidth
            onBlur={onBlur}
          />
          <TextField
            multiline
            rows={3}
            name="Ghichu"
            label="Ghi chú" // Vietnamese for "Category Name"
            value={dataSelect?.Ghichu}
            onChange={onChange} // Update local state and notify parent
            fullWidth
            onBlur={onBlur}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>

        <Button
          variant="contained"
          color="info"
          onClick={() => {
            if (idGroupPolicy) {
              handleUpdate(idGroupPolicy);
            }
          }}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
}
