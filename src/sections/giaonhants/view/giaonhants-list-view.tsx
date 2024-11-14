import { useState, useCallback, useEffect } from 'react';
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
import { fTimestamp } from 'src/utils/format-time';
// _mock
import {
  useGetChinhanh,
  useGetNhomPb,
  useGetPhieuGiaoNhanTS,
  useGetPhongBanDa,
} from 'src/api/taisan';
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
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { useSnackbar } from 'src/components/snackbar';
// types
import {
  IChinhanh,
  INhompb,
  IPhieuGN,
  IPhongBanTableFilterValue,
  IPhongBanTableFilters,
} from 'src/types/taisan';
//
import PhieuGNTableRow from '../giaonhants-table-row';
import PhieuGNTableToolbar from '../giaonhants-table-toolbar';
import PhieuGNTableFiltersResult from '../giaonhants-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Giaonhan', label: 'Mã', width: 60 },
  { id: 'iGiaonhan', label: 'Giao nhận', width: 100 },
  { id: 'ID_Phongban', label: 'Phòng ban', width: 140 },
  { id: 'Nguoinhan', label: 'Người nhận', width: 120 },
  { id: 'Nguoigiao', label: 'Người giao', width: 120 },
  { id: 'Ngay', label: 'Ngày nhận', width: 80 },
  { id: 'ID_Quy', label: 'Quý', width: 60 },
  { id: 'ID_Nam', label: 'Năm', width: 60 },
  { id: '', width: 50 },
];

const defaultFilters: IPhongBanTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  publish: []
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function PhieuGNListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();

  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { phieugn, mutatePhieuGN } = useGetPhieuGiaoNhanTS();
  const { phongbanda } = useGetPhongBanDa();

  const [tableData, setTableData] = useState<IPhieuGN[]>([]);

  const [dataSelect, setDataSelect] = useState<IPhieuGN>();

  useEffect(() => {
    if (phieugn?.length > 0) {
      setTableData(phieugn);
    }
  }, [phieugn, mutatePhieuGN]);

  const [STATUS_OPTIONS_PB, set_STATUS_OPTIONS_PB] = useState<any>([]);

  useEffect(() => {
    if (phongbanda) {
      set_STATUS_OPTIONS_PB(
        phongbanda.map((data: any) => ({
          value: data.Tenphongban,
          label: data.Tenphongban,
        }))
      );
    }
  }, [phongbanda]);

  const [STATUS_OPTIONS, set_STATUS_OPTIONS] = useState([
    { value: 'all', label: 'Tất cả' },
    { value: '1', label: 'Giao tài sản' },
    { value: '2', label: 'Trả tài sản' },
  ]);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered?.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (dataSelect) {
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
    (name: string, value: IPhongBanTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const PhieuGNSchema = Yup.object().shape({
    PhieuGN: Yup.string().required('Không được để trống'),
  });

  const defaultValues = {
    PhieuGN: '',
  };

  const methods = useForm({
    resolver: yupResolver(PhieuGNSchema),
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
        .put(`http://localhost:8888/api/v1/tb_giaonhan/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_Giaonhan !== id);
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

  const handleCloseRow = useCallback(
    async (id: string) => {
      await axios
        .put(`http://localhost:8888/api/v1/tb_giaonhan/close-fast/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const updatedTableData = tableData?.map((row) =>
            row.ID_Giaonhan === id ? { ...row, iTinhtrang: '1' } : row
          );
          confirm.onFalse()
          setTableData(updatedTableData);

          table.onUpdatePageDeleteRow(dataInPage.length);
          enqueueSnackbar('Khóa phiếu thành công!');
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
    [accessToken, enqueueSnackbar, dataInPage.length, table, tableData, confirm] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.giaonhants.detail(id));
    },
    [router]
  );

  const handleUpdate = useCallback(
    async (id: string) => {
      await axios
        .put(`http://localhost:8888/api/v1/tb_phieuGN/update/${id}`, dataSelect, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          reset();
          confirm.onFalse();
          popover.onClose();
          await mutatePhieuGN();

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
    [accessToken, enqueueSnackbar, dataSelect, reset, confirm, popover, mutatePhieuGN] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Danh sách phiếu giao nhận"
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
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === '1' && 'success') ||
                      (tab.value === '2' && 'info') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && phieugn?.length}
                    {tab.value === '1' &&
                      phieugn?.filter((item) => `${item.iGiaonhan}` === '1').length}

                    {tab.value === '2' &&
                      phieugn?.filter((item) => `${item.iGiaonhan}` === '2').length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <PhieuGNTableToolbar
            filters={filters}
            onFilters={handleFilters}
            dateError={dateError}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
            statusOptions={STATUS_OPTIONS_PB}
          />

          {canReset && (
            <PhieuGNTableFiltersResult
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
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_Giaonhan))
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
                //   table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Giaonhan))
                // }
                />

                <TableBody>
                  {dataInPage.map((row) => (
                    <PhieuGNTableRow
                      key={row.ID_Giaonhan}
                      row={row}
                      selected={table.selected.includes(row.ID_Giaonhan)}
                      onSelectRow={() => table.onSelectRow(row.ID_Giaonhan)}
                      onDeleteRow={() => handleDeleteRow(row.ID_Giaonhan)}
                      onViewRow={() => handleViewRow(row.ID_Giaonhan)}
                      onCloseRow={() => handleCloseRow(row.ID_Giaonhan)}
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

      {/* <PhieuGNDialog
        open={confirm.value}
        dataSelect={dataSelect}
        chinhanh={chinhanh}
        nhompb={nhompb}
        onClose={confirm.onFalse}
        onChange={handleInputChange}
        handleUpdate={handleUpdate}
        handleSelectChange={handleSelectChange}
      /> */}

    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IPhieuGN[];
  comparator: (a: any, b: any) => number;
  filters: IPhongBanTableFilters;
  dateError: boolean;
}) {
  const { status, name, startDate, endDate, publish } = filters;

  // console.log('startDate, endDate', startDate, endDate)

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (item) =>
        `${item.NguoigiaoInfo.ent_connguoi.Hoten}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${item.NguoinhanInfo.ent_connguoi.Hoten}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${item.ent_phongbanda.Tenphongban}`.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      // Đặt endDate vào cuối ngày
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      const startTimestamp = fTimestamp(startDate);
      const endTimestamp = fTimestamp(endDate);
      inputData = inputData.filter((item) => {
        const nxTimestamp = fTimestamp(item.Ngay);
        return nxTimestamp >= startTimestamp && nxTimestamp < endTimestamp;
      });
    }
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product?.ent_phongbanda?.Tenphongban));
  }

  if (status !== 'all') {
    inputData = inputData?.filter((item) => `${item?.iGiaonhan}` === status);
  }

  return inputData;
}

interface ConfirmTransferDialogProps {
  open: boolean;
  dataSelect?: IPhieuGN;
  onClose: VoidFunction;
  handleUpdate: (id: string) => void;
  chinhanh: IChinhanh[];
  nhompb: INhompb[];
  onChange: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSelectChange: any;
}

// function PhieuGNDialog({
//   open,
//   dataSelect,
//   chinhanh,
//   nhompb,
//   handleSelectChange,
//   onChange,
//   onClose,
//   onBlur,
//   handleUpdate,
// }: ConfirmTransferDialogProps) {
//   const idPolicy = dataSelect?.ID_Giaonhan;

//   return (
//     <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
//       <DialogTitle>Cập nhật</DialogTitle>
//       <Stack spacing={3} sx={{ px: 3 }}>
//         {/* {chinhanh?.length > 0 && (
//           <FormControl fullWidth>
//             <InputLabel id="demo-simple-select-label-chi-nhanh">Thuộc chi nhánh</InputLabel>
//             <Select
//               name="ID_Chinhanh"
//               labelId="demo-simple-select-label-chi-nhanh"
//               id="demo-simple-select"
//               value={dataSelect?.ID_Chinhanh}
//               label="Chi nhánh"
//               onChange={handleSelectChange}
//             >
//               {chinhanh?.map((item) => (
//                 <MenuItem key={item?.ID_Chinhanh} value={item?.ID_Chinhanh}>
//                   {item?.Tenchinhanh}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}

//         {nhompb?.length > 0 && (
//           <FormControl fullWidth>
//             <InputLabel id="demo-simple-select-label-phong-ban">Thuộc phòng ban</InputLabel>
//             <Select
//               name="ID_Nhompb"
//               labelId="demo-simple-select-label-phong-ban"
//               id="demo-simple-select"
//               value={dataSelect?.ID_Nhompb}
//               label="Phòng ban"
//               onChange={handleSelectChange}
//             >
//               {nhompb?.map((item) => (
//                 <MenuItem key={item?.ID_Nhompb} value={item?.ID_Nhompb}>
//                   {item?.Nhompb}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         )}

//         <TextField
//           name="Mapb"
//           label="Mã phòng ban" // Vietnamese for "Category Name"
//           value={dataSelect?.Mapb}
//           onChange={onChange} // Update local state and notify parent
//           fullWidth
//           onBlur={onBlur}
//         />
//         <TextField
//           name="Tenphongban"
//           label="Tên danh mục" // Vietnamese for "Category Name"
//           value={dataSelect?.Tenphongban}
//           onChange={onChange} // Update local state and notify parent
//           fullWidth
//         />
//         <TextField
//           name="Diachi"
//           label="Địa chỉ" // Vietnamese for "Category Name"
//           value={dataSelect?.Diachi}
//           onChange={onChange} // Update local state and notify parent
//           fullWidth
//         />
//         <TextField
//           name="Ghichu"
//           multiline
//           rows={4}
//           value={dataSelect?.Ghichu}
//           onChange={onChange}
//           label="Ghi chú"
//         /> */}
//       </Stack>

//       <DialogActions>
//         <Button
//           variant="contained"
//           color="info"
//           onClick={() => {
//             if (idPolicy) {
//               handleUpdate(idPolicy);
//             }
//           }}
//         >
//           Cập nhật
//         </Button>
//         <Button onClick={onClose}>Hủy</Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
