import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import {
  useGetGroupPolicy,
  useGetPolicy,
  useGetTaisan,
  useGetNhomts,
  useGetDonvi,
  useGetTaisanQrCode,
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
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { useSnackbar } from 'src/components/snackbar';
// types
import FormProvider, { RHFEditor } from 'src/components/hook-form';

import {
  IDonvi,
  IGroupPolicy,
  INhomts,
  ITaisan,
  ITaisanQrCode,
  ITaisanTableFilterValue,
  ITaisanTableFilters,
} from 'src/types/taisan';
//
import GroupPolicyTableRow from '../tai-san-table-row';
import GiamsatTableToolbar from '../tai-san-table-toolbar';
import GiamsatTableFiltersResult from '../tai-san-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_TaisanQr', label: 'Mã', width: 60 },
  { id: 'ID_Taisan', label: 'Tên tài sản', width: 200 },
  { id: 'Ngaykhoitao', label: 'Ngày', width: 200 },
  { id: 'MaQrCode', label: 'Mã Qr', width: 150 },
  { id: 'Giatri', label: 'Giá trị', width: 150 },
  { id: 'iTinhTrang', label: 'Tình trạng', width: 150 },
  { id: 'ID_PhongBan', label: 'Phòng ban', width: 150 },
  { id: 'ID_Connguoi', label: 'Người tạo', width: 150 },
  { id: '', width: 88 },
];

const defaultFilters: ITaisanTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function GroupPolicyListView() {
  const table = useTable({ defaultOrderBy: 'ID_TaisanQr' });

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();

  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { taisan, mutateTaisan } = useGetTaisan();
  const { taisanqr, mutateTaisanQr } = useGetTaisanQrCode();

  const { nhomts } = useGetNhomts();

  const { donvi } = useGetDonvi();

  const [tableData, setTableData] = useState<ITaisanQrCode[]>([]);

  const [dataSelect, setDataSelect] = useState<ITaisanQrCode>();

  console.log(tableData)
  useEffect(() => {
    if (taisanqr?.length > 0) {
      setTableData(taisanqr);
    }
  }, [taisanqr, mutateTaisanQr]);

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
    (name: string, value: ITaisanTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const GroupPolicySchema = Yup.object().shape({
    // Tents: Yup.string().required('Không được để trống'),
    // ID_Nhomts: Yup.string().required('Không được để trống'),
    // ID_Donvi: Yup.string().required('Không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      // ID_Nhomts: dataSelect?.ID_Nhomts || '',
      // ID_Donvi: dataSelect?.ID_Donvi || '',
      // Mats: dataSelect?.Mats || '',
      // Tents: dataSelect?.Tents || '',
      // Thongso: dataSelect?.Thongso || '',
      // Ghichu: dataSelect?.Ghichu || '',
    }),
    []
  );

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
        .put(`https://checklist.pmcweb.vn/pmc-assets/api/tb_taisanqrcode/delete/${id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_TaisanQr !== id);
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
    (data: ITaisanQrCode) => {
      confirm.onTrue();
      popover.onClose();
      setDataSelect(data);
    },
    [confirm, popover]
  );

  const handleUpdate = useCallback(
    async (id: string) => {
      await axios
        .put(`https://checklist.pmcweb.vn/pmc-assets/api/tb_taisanqrcode/update/${id}`, dataSelect, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          reset();
          confirm.onFalse();
          popover.onClose();
          await mutateTaisanQr();

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
    [accessToken, enqueueSnackbar, reset, confirm, dataSelect, popover, mutateTaisanQr] // Add accessToken and enqueueSnackbar as dependencies
  );


  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Danh sách tài sản"
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
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_TaisanQr))
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
                  //   table.onSelectAllRows(checked, tableData?.map((row) => row.ID_TaisanQr))
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <GroupPolicyTableRow
                        key={row.ID_TaisanQr}
                        row={row}
                        selected={table.selected.includes(row.ID_TaisanQr)}
                        onSelectRow={() => table.onSelectRow(row.ID_TaisanQr)}
                        onDeleteRow={() => handleDeleteRow(row.ID_TaisanQr)}
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
        nhomts={nhomts}
        donvi={donvi}
        onClose={confirm.onFalse}
        onChange={handleInputChange}
        handleUpdate={handleUpdate}
        handleSelectChange={handleSelectChange}
        methods={methods}
        setDataSelect={setDataSelect}
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
  inputData: ITaisanQrCode[];
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
        order.ent_phongbanda.Tenphongban.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order?.ent_phongbanda?.Mapb.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.MaQrCode.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.ent_taisan.Tents.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.ent_connguoi.Hoten.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}

interface ConfirmTransferDialogProps {
  open: boolean;
  dataSelect?: ITaisanQrCode;
  onClose: VoidFunction;
  handleUpdate: (id: string) => void;
  donvi: IDonvi[];
  nhomts: INhomts[];
  onChange: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSelectChange: any;
  methods: any;
  setDataSelect: any;
}

function GroupPolicyDialog({
  open,
  dataSelect,
  donvi,
  nhomts,
  methods,
  handleSelectChange,
  onChange,
  onClose,
  onBlur,
  handleUpdate,
  setDataSelect,
}: ConfirmTransferDialogProps) {
  const idPolicy = dataSelect?.ID_TaisanQr;
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  return (
    <FormProvider methods={methods}>
      <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
        <DialogTitle>Cập nhật</DialogTitle>

        <DialogContent dividers={scroll === 'paper'}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack style={{ display: 'flex', flexDirection: 'row', gap: 30 }} spacing={3}>
              {/* {nhomts?.length > 0 && (
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Tài sản</InputLabel>
                  <Select
                    name="ID_Nhomts"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={dataSelect?.ID_Nhomts}
                    onChange={handleSelectChange}
                  >
                    {nhomts?.map((item) => (
                      <MenuItem key={item?.ID_Nhomts} value={item?.ID_Nhomts}>
                        {item?.Loaits}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )} */}

              {donvi?.length > 0 && (
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Đơn vị</InputLabel>
                  <Select
                    name="ID_Donvi"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={dataSelect?.ID_Donvi}
                    onChange={handleSelectChange}
                  >
                    {donvi?.map((item) => (
                      <MenuItem key={item?.ID_Donvi} value={item?.ID_Donvi}>
                        {item?.Donvi}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
            {/* <TextField
              name="Tents"
              label="Tên tài sản" // Vietnamese for "Category Name"
              value={dataSelect?.Tents}
              onChange={onChange} // Update local state and notify parent
              fullWidth
              onBlur={onBlur}
            />
            <RHFEditor
              simple
              name="Thongso"
              value={dataSelect?.Thongso}
              onChange={(value, delta, source, editor) => {
                // Xử lý thay đổi giá trị
                setDataSelect((prevData: any) => ({
                  ...prevData,
                  Thongso: value,
                }));
              }}
            /> */}

            <TextField
              name="Ghichu"
              label="Ghi chú" // Vietnamese for "Category Name"
              value={dataSelect?.Ghichu}
              onChange={onChange} // Update local state and notify parent
              fullWidth
              multiline
              rows={3}
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
              if (idPolicy) {
                handleUpdate(idPolicy);
              }
            }}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
