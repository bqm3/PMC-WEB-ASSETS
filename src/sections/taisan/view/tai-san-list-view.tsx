import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
// @mui
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Card from '@mui/material/Card';
import { LoadingButton } from '@mui/lab';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { Pagination, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import {
  useGetTaisan,
  useGetNhomts,
  useGetDonvi,
  useGetLoaiNhom,
  useGetHang,
} from 'src/api/taisan';
// components

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
} from 'src/components/table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';

import { useSnackbar } from 'src/components/snackbar';
// types
import FormProvider, { RHFEditor } from 'src/components/hook-form';

import {
  IDonvi,
  IHang,
  INhomts,
  ITaisan,
  ITaisanFilterValue,
  ITaisanFilters,
} from 'src/types/taisan';
//
import { list_country } from 'src/_mock/map/countries';
import TaiSanTableRow from '../tai-san-table-row';
import TaiSanTableToolbar from '../tai-san-table-toolbar';
import TaiSanCreateView from '../tai-san-new-form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Taisan', label: 'Mã', width: 50 },
  { id: 'Tents', label: 'Tên tài sản', width: 200 },
  { id: 'Mats', label: 'Mã tài sản', width: 100 },
  { id: 'ID_Nhomts', label: 'Nhóm tài sản', width: 100 },
  { id: 'ID_Donvi', label: 'Đơn vị', width: 150 },
  { id: 'ID_Hang', label: 'Tên hãng', width: 100 },
  { id: 'Nuocsx', label: 'Nước sản xuất', width: 100 },

  { id: '', width: 50 },
];

const defaultFilters: ITaisanFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  units: [],
  groups: [],
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function GroupPolicyListView() {
  const table = useTable({ defaultOrderBy: 'ID_Taisan' });

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();
  const popoverAdd = usePopover();

  const confirm = useBoolean();
  const confirmAdd = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { taisan, mutateTaisan } = useGetTaisan();

  const { nhomts } = useGetNhomts();
  const { loainhom } = useGetLoaiNhom();
  const { donvi } = useGetDonvi();
  const { hang } = useGetHang();
  const [rowsPerPageCustom, setRowsPerPageCustom] = useState(table?.rowsPerPage || 30); // Giá trị mặc định của số mục trên mỗi trang

  const [tableData, setTableData] = useState<ITaisan[]>([]);

  const [dataSelect, setDataSelect] = useState<ITaisan>();

  const [STATUS_OPTIONS, set_STATUS_OPTIONS] = useState<any>([]);

  useEffect(() => {
    if (loainhom) {
      set_STATUS_OPTIONS(
        loainhom.map((data: any) => ({
          value: data.Loainhom,
          label: data.Loainhom,
        }))
      );
    }
  }, [loainhom]);

  useEffect(() => {
    if (taisan?.length > 0) {
      setTableData(taisan);
    }
  }, [taisan, mutateTaisan]);

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataSelect((prev: any) => ({
      ...prev,
      i_MaQrCode: event.target.checked ? '0' : '1',
    }));
  };

  const handleFilters = useCallback(
    (name: string, value: ITaisanFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const GroupPolicySchema = Yup.object().shape({
    Tents: Yup.string().required('Không được để trống'),
    ID_Nhomts: Yup.string().required('Không được để trống'),
    ID_Donvi: Yup.string().required('Không được để trống'),
    ID_Hang: Yup.string().required('Không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      ID_Nhomts: dataSelect?.ID_Nhomts || '',
      ID_Donvi: dataSelect?.ID_Donvi || '',
      ID_Hang: dataSelect?.ID_Hang || '',
      Mats: dataSelect?.Mats || '',
      Tents: dataSelect?.Tents || '',
      Thongso: dataSelect?.Thongso || '',
      Nuocsx: dataSelect?.Nuocsx || '',
      Ghichu: dataSelect?.Ghichu || '',
    }),
    [dataSelect]
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
        .put(`http://localhost:8888/api/v1/ent_taisan/delete/${id}`, [], {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_Taisan !== id);
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

  const handleViewAdd = useCallback(() => {
    confirmAdd.onTrue();
    popoverAdd.onClose();
  }, [popoverAdd, confirmAdd]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback(
    (data: ITaisan) => {
      confirm.onTrue();
      popover.onClose();
      setDataSelect(data);
    },
    [confirm, popover]
  );

  const handleUpdate = useCallback(
    async (id: string) => {
      await axios
        .put(`http://localhost:8888/api/v1/ent_taisan/update/${id}`, dataSelect, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          reset();
          confirm.onFalse();
          popover.onClose();
          await mutateTaisan();

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
    [accessToken, enqueueSnackbar, reset, confirm, dataSelect, popover, mutateTaisan] // Add accessToken and enqueueSnackbar as dependencies
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
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <CustomBreadcrumbs
            heading="Danh sách phân loại tài sản"
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
          <LoadingButton
            variant="contained"
            startIcon={<Iconify icon="eva:add-upload-fill" />}
            onClick={handleViewAdd}
          >
            Thêm mới
          </LoadingButton>
        </Stack>

        <Card>
          <TaiSanTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
            statusOptions={STATUS_OPTIONS}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData?.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_Taisan))
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
                  //   table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Taisan))
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <TaiSanTableRow
                        key={row.ID_Taisan}
                        row={row}
                        selected={table.selected.includes(row.ID_Taisan)}
                        onSelectRow={() => table.onSelectRow(row.ID_Taisan)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Taisan)}
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

          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '16px',
            }}
          >
            {/* Bộ chọn số mục hiển thị mỗi trang */}
            <FormControl variant="outlined" size="small">
              <InputLabel>Số mục mỗi trang</InputLabel>
              <Select
                value={rowsPerPageCustom}
                onChange={(event: any) => {
                  setRowsPerPageCustom(Number(event.target.value));
                  table.onChangeRowsPerPage(event); // Truyền trực tiếp event vào table.onChangeRowsPerPage
                }}
                label="Số mục mỗi trang"
                style={{ width: '150px' }}
              >
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>

            {/* Thành phần phân trang */}
            <Stack>
              <Pagination
                count={Math.ceil(dataFiltered.length / rowsPerPageCustom)} // Số trang
                page={table.page + 1} // Phân trang bắt đầu từ 1
                onChange={(event, newPage) => table.onChangePage(event, newPage - 1)} // Điều chỉnh để bắt đầu từ 0
                boundaryCount={2}
                sx={{
                  my: 1,
                  // mx: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{ textAlign: 'right', fontSize: 14, paddingRight: 1 }}
              >
                Tổng: {dataFiltered?.length}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </Container>

      <TaiSanDialog
        open={confirm.value}
        dataSelect={dataSelect}
        nhomts={nhomts}
        donvi={donvi}
        hang={hang}
        onClose={confirm.onFalse}
        onChange={handleInputChange}
        handleUpdate={handleUpdate}
        handleSelectChange={handleSelectChange}
        methods={methods}
        setDataSelect={setDataSelect}
        handleChange={handleChange}
      />

      <TaiSanDialogAdd open={confirmAdd.value} onClose={confirmAdd.onFalse} />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: ITaisan[];
  comparator: (a: any, b: any) => number;
  filters: ITaisanFilters;
  // dateError: boolean;
}) {
  const { status, name, units } = filters;

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
        `${order?.ent_nhomts?.Manhom}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.ent_nhomts?.Tennhom}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.Mats}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.Nuocsx}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.Tents}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.ent_hang?.Tenhang}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.ent_donvi?.Donvi}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.ent_nhomts?.ent_loainhom?.Loainhom}`.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        `${order?.Thongso}`.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (units.length) {
    inputData = inputData.filter((product) =>
      units.includes(product.ent_nhomts.ent_loainhom.Loainhom)
    );
  }

  return inputData;
}

interface ConfirmTransferDialogProps {
  open: boolean;
  dataSelect?: ITaisan;
  onClose: VoidFunction;
  handleUpdate: (id: string) => void;
  handleChange: any;
  donvi: IDonvi[];
  hang: IHang[];
  nhomts: INhomts[];
  onChange: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSelectChange: any;
  methods: any;
  setDataSelect: any;
}

function TaiSanDialog({
  open,
  dataSelect,
  donvi,
  hang,
  nhomts,
  methods,
  handleSelectChange,
  onChange,
  onClose,
  onBlur,
  handleUpdate,
  handleChange,
  setDataSelect,
}: ConfirmTransferDialogProps) {
  const idPolicy = dataSelect?.ID_Taisan;
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  return (
    <FormProvider methods={methods}>
      <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
        <DialogTitle>Cập nhật</DialogTitle>

        <DialogContent dividers={scroll === 'paper'}>
          <Stack spacing={4} sx={{ p: 4 }}>
            <Stack style={{ display: 'flex', flexDirection: 'row' }} spacing={3}>
              <TextField
                name="Tents"
                label="Tên tài sản *"
                value={dataSelect?.Tents}
                onChange={onChange}
                fullWidth
                onBlur={onBlur}
              />
              {nhomts?.length > 0 && (
                <FormControl
                  fullWidth
                  sx={{
                    '& .MuiInputLabel-root': {
                      backgroundColor: 'white',
                      padding: '0 4px',
                    },
                  }}
                >
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
                        {item?.Tennhom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {donvi?.length > 0 && (
                <FormControl
                  fullWidth
                  sx={{
                    '& .MuiInputLabel-root': {
                      backgroundColor: 'white',
                      padding: '0 4px',
                    },
                  }}
                >
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

              {hang?.length > 0 && (
                <FormControl
                  fullWidth
                  sx={{
                    '& .MuiInputLabel-root': {
                      backgroundColor: 'white',
                      padding: '0 4px',
                    },
                  }}
                >
                  <InputLabel id="demo-simple-select-label">Tên hãng</InputLabel>
                  <Select
                    name="ID_Hang"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={dataSelect?.ID_Hang}
                    onChange={handleSelectChange}
                  >
                    {hang?.map((item) => (
                      <MenuItem key={item?.ID_Hang} value={item?.ID_Hang}>
                        {item?.Tenhang}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
            <Stack style={{ display: 'flex', flexDirection: 'row' }} spacing={3}>
              <TextField
                name="Tentscu"
                label="Tên tài sản cũ"
                value={dataSelect?.Tentscu}
                onChange={onChange}
                fullWidth
                onBlur={onBlur}
              />
              <TextField
                name="Model"
                label="Model"
                value={dataSelect?.Model}
                onChange={onChange}
                fullWidth
                onBlur={onBlur}
              />
              <TextField
                name="SerialNumber"
                label="Serial Number"
                value={dataSelect?.SerialNumber}
                onChange={onChange}
                fullWidth
                onBlur={onBlur}
              />
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                fullWidth
                disableClearable
                value={dataSelect?.Nuocsx || ''}
                options={list_country.map((option) => option.name)}
                onChange={(event, newValue) => {
                  // Handle the change event and update state
                  setDataSelect((prevData: any) => ({
                    ...prevData,
                    Nuocsx: newValue,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nước sản xuất"
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                    }}
                  />
                )}
              />
            </Stack>

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
            />

            <TextField
              name="Ghichu"
              label="Ghi chú"
              value={dataSelect?.Ghichu}
              onChange={onChange}
              fullWidth
              multiline
              rows={2}
              onBlur={onBlur}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={`${dataSelect?.i_MaQrCode}` === '0'}
                  onChange={handleChange}
                  color="success"
                />
              }
              label="Qr Code"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
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
          <Button onClick={onClose}>Hủy</Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

function TaiSanDialogAdd({ open, onClose }: any) {
  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle>Thêm mới</DialogTitle>

      <DialogContent
        sx={{
          overflow: 'scroll',
          height: 'auto',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        }}
      >
        <Grid spacing={3} mb={2}>
          <TaiSanCreateView />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
