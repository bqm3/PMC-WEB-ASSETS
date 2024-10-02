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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import {
  useGetChinhanh,
  useGetGroupPolicy,
  useGetNhomPb,
  useGetPhongBanDa,
  useGetPolicy,
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
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { LoadingButton } from '@mui/lab';

import { useSnackbar } from 'src/components/snackbar';
// types
import { IKhuvucTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc';

import {
  IChinhanh,
  IGroupPolicy,
  INhompb,
  IPhongbanda,
  IPolicy,
  ITaisanTableFilterValue,
  IPhongBanTableFilters,
} from 'src/types/taisan';
//
import PhongBanTableRow from '../phong-ban-table-row';
import PhongBanTableToolbar from '../phong-ban-table-toolbar';
import PhongBanTableFiltersResult from '../phong-ban-table-filters-result';
import PhongBanNewEditForm from '../phong-ban-new-form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_Phongban', label: 'Mã', width: 100 },
  { id: 'Mapb', label: 'Mã phòng ban', width: 150 },
  { id: 'Tenphongban', label: 'Tên phòng ban', width: 150 },
  { id: 'Diachi', label: 'Địa chỉ', width: 150 },
  { id: 'Thuoc', label: 'Thuộc', width: 150 },
  { id: 'ID_Chinhanh', label: 'Chi nhánh', width: 150 },
  { id: 'ID_Nhompb', label: 'Phòng ban', width: 150 },
  { id: '', width: 50 },
];

const defaultFilters: IPhongBanTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  publish: [],
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function GroupPolicyListView() {
  const table = useTable({ defaultOrderBy: 'ID_Phongban' });

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();
  const popoverAdd = usePopover();

  const confirm = useBoolean();
  const confirmAdd = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const { policy } = useGetPolicy();

  const { grouppolicy } = useGetGroupPolicy();

  const { chinhanh } = useGetChinhanh();

  const { nhompb } = useGetNhomPb();

  const { phongbanda, mutatePhongBanDa } = useGetPhongBanDa();

  const [tableData, setTableData] = useState<IPhongbanda[]>([]);

  const [dataSelect, setDataSelect] = useState<IPhongbanda>();

  useEffect(() => {
    if (phongbanda?.length > 0) {
      setTableData(phongbanda);
    }
  }, [phongbanda, mutatePhongBanDa]);

  const [STATUS_OPTIONS, set_STATUS_OPTIONS] = useState<any>([]);

  useEffect(() => {
    if (chinhanh) {
      set_STATUS_OPTIONS(
        chinhanh.map((data) => ({
          value: data.Tenchinhanh,
          label: data.Tenchinhanh,
        }))
      );
    }
  }, [chinhanh]);

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
    Tenphongban: Yup.string().required('Không được để trống'),
  });

  const defaultValues = {
    Tenphongban: '',
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
        .put(`http://localhost:8888/api/v1/ent_policy/delete/${id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_Phongban !== id);
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
    (data: IPhongbanda) => {
      confirm.onTrue();
      popover.onClose();
      setDataSelect(data);
    },
    [confirm, popover]
  );

  const handleUpdate = useCallback(
    async (id: string) => {
      await axios
        .put(`http://localhost:8888/api/v1/ent_phongbanda/update/${id}`, dataSelect, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(async (res) => {
          reset();
          confirm.onFalse();
          popover.onClose();
          await mutatePhongBanDa();

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
    [accessToken, enqueueSnackbar, dataSelect, reset, confirm, popover, mutatePhongBanDa] // Add accessToken and enqueueSnackbar as dependencies
  );

  const handleViewAdd = useCallback(() => {
    confirmAdd.onTrue();
    popoverAdd.onClose();
  }, [popoverAdd, confirmAdd]);

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
            heading="Danh sách phòng ban dự án"
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
          <PhongBanTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
            statusOptions={STATUS_OPTIONS}
          />

          {canReset && (
            <PhongBanTableFiltersResult
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
                table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_Phongban))
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
                  //   table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Phongban))
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <PhongBanTableRow
                        key={row.ID_Phongban}
                        row={row}
                        selected={table.selected.includes(row.ID_Phongban)}
                        onSelectRow={() => table.onSelectRow(row.ID_Phongban)}
                        onDeleteRow={() => handleDeleteRow(row.ID_Phongban)}
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
        chinhanh={chinhanh}
        nhompb={nhompb}
        onClose={confirm.onFalse}
        onChange={handleInputChange}
        handleUpdate={handleUpdate}
        handleSelectChange={handleSelectChange}
      />

      <RoomDialogAdd open={confirmAdd.value} onClose={confirmAdd.onFalse} />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: IPhongbanda[];
  comparator: (a: any, b: any) => number;
  filters: IPhongBanTableFilters;
  // dateError: boolean;
}) {
  const { status, name, publish } = filters;

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
        order.Mapb.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Tenphongban.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Diachi.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Thuoc.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.ent_chinhanh.Tenchinhanh.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.ent_nhompb.Nhompb.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.ent_chinhanh.Tenchinhanh));
  }

  // if (status !== 'all') {
  //   inputData = inputData?.filter((order) => `${order?.ID_GroupPolicy}` === status);
  // }

  return inputData;
}

interface ConfirmTransferDialogProps {
  open: boolean;
  dataSelect?: IPhongbanda;
  onClose: VoidFunction;
  handleUpdate: (id: string) => void;
  chinhanh: IChinhanh[];
  nhompb: INhompb[];
  onChange: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSelectChange: any;
}

function GroupPolicyDialog({
  open,
  dataSelect,
  chinhanh,
  nhompb,
  handleSelectChange,
  onChange,
  onClose,
  onBlur,
  handleUpdate,
}: ConfirmTransferDialogProps) {
  const idPolicy = dataSelect?.ID_Phongban;

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Cập nhật</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ p: 3 }}>
          {chinhanh?.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label-chi-nhanh">Thuộc chi nhánh</InputLabel>
              <Select
                name="ID_Chinhanh"
                labelId="demo-simple-select-label-chi-nhanh"
                id="demo-simple-select"
                value={dataSelect?.ID_Chinhanh}
                label="Chi nhánh"
                onChange={handleSelectChange}
              >
                {chinhanh?.map((item) => (
                  <MenuItem key={item?.ID_Chinhanh} value={item?.ID_Chinhanh}>
                    {item?.Tenchinhanh}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {nhompb?.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label-phong-ban">Thuộc phòng ban</InputLabel>
              <Select
                name="ID_Nhompb"
                labelId="demo-simple-select-label-phong-ban"
                id="demo-simple-select"
                value={dataSelect?.ID_Nhompb}
                label="Phòng ban"
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
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Thuộc</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={dataSelect?.Thuoc}
              onChange={handleSelectChange}
              name="Thuoc"
              style={{ display: 'flex', flexDirection: 'row' }}
            >
              <FormControlLabel value="PMC" control={<Radio />} label="PMC" />
              <FormControlLabel value="Dự án ngoài" control={<Radio />} label="Dự án ngoài" />
            </RadioGroup>
          </FormControl>
          <TextField
            name="Mapb"
            label="Mã phòng ban"
            value={dataSelect?.Mapb}
            onChange={onChange}
            fullWidth
            onBlur={onBlur}
          />
          <TextField
            name="Tenphongban"
            label="Tên phòng ban"
            value={dataSelect?.Tenphongban}
            onChange={onChange}
            fullWidth
          />
          <TextField
            name="Diachi"
            label="Địa chỉ"
            value={dataSelect?.Diachi}
            onChange={onChange}
            fullWidth
          />
          <TextField
            name="Ghichu"
            multiline
            rows={4}
            value={dataSelect?.Ghichu}
            onChange={onChange}
            label="Ghi chú"
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
  );
}

function RoomDialogAdd({ open, onClose }: any) {
  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle>Thêm mới</DialogTitle>

      <DialogContent sx={{ overflow: 'hidden',  height: 'auto' }}>
        <Grid spacing={3}>
          <PhongBanNewEditForm />
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
