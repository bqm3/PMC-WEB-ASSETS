import { useEffect, useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
// auth
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();
  const { user, logout } = useAuthContext();

  useEffect(() => { }, []);

  const data = useMemo(() => {
    const navigationData = [
      // OVERVIEW
      {
        subheader: t('overview'),
        items: [],
      },
      // MANAGEMENT
      {
        subheader: t('lists'),

        items: [
          {
            title: t('grouppolicy'),
            path: paths.dashboard.grouppolicy.root,
            icon: ICONS.folder,
            children: [
              { title: t('list'), path: paths.dashboard.grouppolicy.root },
              { title: t('create'), path: paths.dashboard.grouppolicy.new },
            ],
          },
          {
            title: t('policy'),
            path: paths.dashboard.policy.root,
            icon: ICONS.file,
            children: [
              { title: t('list'), path: paths.dashboard.policy.root },
              { title: t('create'), path: paths.dashboard.policy.new },
            ],
          },

          {
            title: t('nhacc'),
            path: paths.dashboard.nhacc.root,
            icon: ICONS.invoice,
            children: [
              { title: t('list'), path: paths.dashboard.nhacc.root },
              { title: t('create'), path: paths.dashboard.nhacc.new },
            ],
          },
          {
            title: t('phongbanda'),
            path: paths.dashboard.phongbanda.root,
            icon: ICONS.banking,
            children: [
              { title: t('list'), path: paths.dashboard.phongbanda.root },
              { title: t('create'), path: paths.dashboard.phongbanda.new },
            ],
          },
          {
            title: t('donvi-nhom'),
            path: paths.dashboard.donvi.root,
            icon: ICONS.external,
            children: [
              { title: t('list'), path: paths.dashboard.donvi.root },
              { title: t('create'), path: paths.dashboard.donvi.new },
            ],
          },

          {
            title: t('nhomts'),
            path: paths.dashboard.nhomts.root,
            icon: ICONS.ecommerce,
            children: [
              { title: t('list'), path: paths.dashboard.nhomts.root },
              { title: t('create'), path: paths.dashboard.nhomts.new },
            ],
          },
          {
            title: t('taisan'),
            path: paths.dashboard.taisan.root,
            icon: ICONS.product,
            children: [
              { title: t('list'), path: paths.dashboard.taisan.root },
              { title: t('create'), path: paths.dashboard.taisan.new },
            ],
          },

          {
            title: t('phieunx'),
            path: paths.dashboard.phieunx.root,
            icon: ICONS.invoice,
            children: [
              { title: t('list'), path: paths.dashboard.phieunx.root },
              { title: t('create'), path: paths.dashboard.phieunx.new },
            ],
          },
          {
            title: t('phieuncc'),
            path: paths.dashboard.phieuncc.root,
            icon: ICONS.invoice,
            children: [
              { title: t('list'), path: paths.dashboard.phieuncc.root },
              { title: t('create'), path: paths.dashboard.phieuncc.new },
            ],
          },
          {
            title: t('suachuats'),
            path: paths.dashboard.suachuats.root,
            icon: ICONS.disabled,
            children: [
              { title: t('list'), path: paths.dashboard.suachuats.root },
              { title: t('create'), path: paths.dashboard.suachuats.new },
            ],
          },
          {
            title: t('taisanqrcode'),
            path: paths.dashboard.taisanqrcode.root,
            icon: ICONS.external,
            children: [{ title: t('list'), path: paths.dashboard.taisanqrcode.root }],
          },
          {
            title: t('createuser'),
            path: paths.dashboard.createuser.root,
            icon: ICONS.user,
            children: [
              { title: t('list'), path: paths.dashboard.createuser.root },
              { title: t('create'), path: paths.dashboard.createuser.new },
            ],
          },
        ],
      },

      {
        subheader: t('profile'),
        items: [
          {
            title: t('user'),
            path: paths.dashboard.userAdmin.root,
            icon: ICONS.user,

            children: [
              {
                title: t('account'),
                path: paths.dashboard.userAdmin.root
              },
              {
                title: t('list'),
                path: paths.dashboard.userAdmin.list
              },
              {
                title: t('create'),
                path: paths.dashboard.userAdmin.new
              }
            ],
          },
        ],
      },
    ];

    return navigationData;
  }, [t]);

  return data;
}
