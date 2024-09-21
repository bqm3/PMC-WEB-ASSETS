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
// _mock
import { useGetGroupPolicy, useGetNhomts, useGetSuachuaTs } from 'src/api/taisan';
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
import Dialog, { DialogProps } from '@mui/material/Dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { fTimestamp } from 'src/utils/format-time';

import { useSnackbar } from 'src/components/snackbar';
// types
import { IKhuvucTableFilters, IKhuvucTableFilterValue } from 'src/types/khuvuc';

import { INhomts, ISuachuaTS, ITaisanTableFilterValue, ITaisanTableFilters } from 'src/types/taisan';
//
import SuaChuaTSTableRow from '../suachua-ts-table-row';
import SuaChuaTSTableToolbar from '../suachua-ts-table-toolbar';
import SuaChuaTSTableFiltersResult from '../suachua-ts-table-filters-result';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ID_SuachuaTS', label: 'Mã', width: 140 },
  { id: 'Ngaygiao', label: 'Ngày giao', width: 200 },
  { id: 'Sophieu', label: 'Mã số phiếu', width: 200 },
  { id: 'Nguoitheodoi', label: 'Người theo dõi', width: 200 },
  { id: 'iTinhtrang', label: 'Tình trạng', width: 100 },

  { id: '', width: 88 },
];

const defaultFilters: ITaisanTableFilters= {
  name: '',
  status: 'all',
  startDate: null, 
  endDate: null
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function GroupPolicyListView() {
  const table = useTable({ defaultOrderBy: 'ID_SuachuaTS' });

  const settings = useSettingsContext();

  const router = useRouter();

  const popover = usePopover();

  const confirm = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [filters, setFilters] = useState(defaultFilters);

  const {suachuats, mutateSuachuaTS} = useGetSuachuaTs()

  const [tableData, setTableData] = useState<ISuachuaTS[]>([]);

  const [dataSelect, setDataSelect] = useState<ISuachuaTS>();

  useEffect(() => {
    if (suachuats?.length > 0) {
      setTableData(suachuats);
    }
  }, [suachuats, mutateSuachuaTS]);

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

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const [STATUS_OPTIONS, set_STATUS_OPTIONS] = useState([
    { value: 'all', label: 'Tất cả' },
    { value: '0', label: 'Mở' },
    { value: '1', label: 'Khóa' },
  ]);

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
  });

  const defaultValues = {
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
          `https://checklist.pmcweb.vn/pmc-assets/api/v1/tb_suachuats/delete/${id}`,

          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          // reset();
          const deleteRow = tableData?.filter((row) => row.ID_SuachuaTS !== id);
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
    (id: string) => {
      router.push(paths.dashboard.suachuats.detail(id));
    },
    [router]
  );


  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
    <CustomBreadcrumbs
      heading="Danh sách tài sản sửa chữa"
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
                  (tab.value === '0' && 'success') ||
                  (tab.value === '1' && 'default') ||
                  'default'
                }
              >
                {tab.value === 'all' && suachuats?.length}
                {tab.value === '0' &&
                  suachuats?.filter((item) => `${item.iTinhtrang}` === '0').length}

                {tab.value === '1' &&
                  suachuats?.filter((item) => `${item.iTinhtrang}` === '1').length}
              </Label>
            }
          />
        ))}
      </Tabs>
      <SuaChuaTSTableToolbar
        filters={filters}
        onFilters={handleFilters}
        dateError={dateError}
        canReset={canReset}
        onResetFilters={handleResetFilters}
      />

      {canReset && (
        <SuaChuaTSTableFiltersResult
        filters={filters}
              onFilters={handleFilters}
              //
              dateError={dateError}
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
            table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_SuachuaTS))
          }
          action={
            <Tooltip title="Xóa">
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
              //   table.onSelectAllRows(checked, tableData?.map((row) => row.ID_SuachuaTS))
              // }
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <SuaChuaTSTableRow
                    key={row.ID_SuachuaTS}
                    row={row}
                    selected={table.selected.includes(row.ID_SuachuaTS)}
                    onSelectRow={() => table.onSelectRow(row.ID_SuachuaTS)}
                    onDeleteRow={() => handleDeleteRow(row.ID_SuachuaTS)}
                    onViewRow={() => handleViewRow(row.ID_SuachuaTS)}
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
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters, // 
  dateError,
}: {
  inputData: ISuachuaTS[];
  comparator: (a: any, b: any) => number;
  filters: ITaisanTableFilters;
  dateError: boolean;
}) {
  const { status, name, startDate, endDate } = filters;

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
        order.Sophieu.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.Nguoitheodoi.toLowerCase().indexOf(name.toLowerCase()) !== -1
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
        const nxTimestamp = fTimestamp(item.Ngaygiao);
        return nxTimestamp >= startTimestamp && nxTimestamp < endTimestamp;
      });
    }
  }

  if (status !== 'all') {
    inputData = inputData?.filter((order) => `${order?.iTinhtrang}` === status);
  }

  return inputData;
}

