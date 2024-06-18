import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// _mock
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
  _ecommerceSalesOverview,
  _appInstalled,
} from 'src/_mock';

// hooks
import { useAuthContext } from 'src/auth/hooks';
// components
import { useSettingsContext } from 'src/components/settings';
// api
import axios from 'axios';
import { useGetKhoiCV } from 'src/api/khuvuc';
//
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AppCurrentDownload from '../app-current-download';
import ChecklistsYear from '../checklist-yearly';
import EcommerceSalesOverview from '../checklist-percent-overview';
import AnaLyticsDuan from '../analytics-areas';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
type widgetData = {
  percent: number;
  chart: number[] | any;
  chart_month: string[];
  total_orders_this_week: number | any;
  total_users: number | any;
  total_orders_status_4: number | any;
  total_orders: number | any;
  series: any | number;
  result: any | number;
};

const STORAGE_KEY = 'accessToken';

type SeriesData = {
  label: string;
  value: number;
};

type SeriesDataYear = {
  name: string;
  data: number[];
};

type ChartSeries = {
  type: string;
  data: SeriesDataYear[];
};

type ChartData = {
  categories: string[];
  series: ChartSeries[];
};

export default function OverviewAnalyticsView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { user, logout } = useAuthContext();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, {user?.Hoten}
      </Typography>
    </Container>
  );
}
