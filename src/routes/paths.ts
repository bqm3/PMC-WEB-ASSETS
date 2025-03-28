// utils
import { paramCase } from 'src/utils/change-case';
import { _id, _postTitles } from 'src/_mock/assets';
import { IUser } from 'src/types/khuvuc';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------


export const paths = {
  
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}/analytics`,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      management: `${ROOTS.DASHBOARD}/management`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
      ficilities: `${ROOTS.DASHBOARD}/ficilities`,
    },
    typeRoom: {
      root: `${ROOTS.DASHBOARD}/type-room`,
      new: `${ROOTS.DASHBOARD}/type-room/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/type-room/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/type-room/${MOCK_ID}/edit`,
      },
    },
    typeService: {
      root: `${ROOTS.DASHBOARD}/type-service`,
      new: `${ROOTS.DASHBOARD}/type-service/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/type-service/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/type-service/${MOCK_ID}/edit`,
      },
    },
    service: {
      root: `${ROOTS.DASHBOARD}/service`,
      new: `${ROOTS.DASHBOARD}/service/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/service/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/service/${MOCK_ID}/edit`,
      },
    },
    
    khuvuc: {
      root: `${ROOTS.DASHBOARD}/khuvuc`,
      new: `${ROOTS.DASHBOARD}/khuvuc/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/khuvuc/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/khuvuc/${id}/edit`,
    },
    tang: {
      root: `${ROOTS.DASHBOARD}/tang`,
      new: `${ROOTS.DASHBOARD}/tang/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tang/${id}`,
    },
    hangmuc: {
      root: `${ROOTS.DASHBOARD}/hangmuc`,
      new: `${ROOTS.DASHBOARD}/hangmuc/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/hangmuc/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/hangmuc/${id}/edit`,
    },
    calv: {
      root: `${ROOTS.DASHBOARD}/calv`,
      new: `${ROOTS.DASHBOARD}/calv/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/calv/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/calv/${id}/edit`,
    },
    giamsat: {
      root: `${ROOTS.DASHBOARD}/giamsat`,
      new: `${ROOTS.DASHBOARD}/giamsat/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/giamsat/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/giamsat/${id}/edit`,
    },

    quanlygiamsat: {
      root: `${ROOTS.DASHBOARD}/quan-ly-giam-sat`,
      details: (id: string) => `${ROOTS.DASHBOARD}/quan-ly-giam-sat/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/quan-ly-giam-sat/${id}/edit`,
    },
    userAdmin: {
      root: `${ROOTS.DASHBOARD}/profile/`,
      profile: `${ROOTS.DASHBOARD}/profile/`,
      new: `${ROOTS.DASHBOARD}/profile/new`,
      list: `${ROOTS.DASHBOARD}/profile/list`,
    },
    
    user: {
      root: `${ROOTS.DASHBOARD}/userMinimal`,
      new: `${ROOTS.DASHBOARD}/userMinimal/new`,
      list: `${ROOTS.DASHBOARD}/userMinimal/list`,
      cards: `${ROOTS.DASHBOARD}/userMinimal/cards`,
      profile: `${ROOTS.DASHBOARD}/userMinimal/profile`,
      account: `${ROOTS.DASHBOARD}/userMinimal/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/userMinimal/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/userMinimal/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },

    grouppolicy: {
      root: `${ROOTS.DASHBOARD}/group-policy`,
      new: `${ROOTS.DASHBOARD}/group-policy/new`,
     
    },
    policy: {
      root: `${ROOTS.DASHBOARD}/policy`,
      new: `${ROOTS.DASHBOARD}/policy/new`,
    },
    phongbanda: {
      root: `${ROOTS.DASHBOARD}/departments`,
      new: `${ROOTS.DASHBOARD}/departments/new`,
    },
    nhacc: {
      root: `${ROOTS.DASHBOARD}/nhacc`,
      new: `${ROOTS.DASHBOARD}/nhacc/new`,
    },
    donvi: {
      root: `${ROOTS.DASHBOARD}/unit-group-type`,
      new: `${ROOTS.DASHBOARD}/unit-group-type/new`,
    },
    nhomts: {
      root: `${ROOTS.DASHBOARD}/group-assets`,
      new: `${ROOTS.DASHBOARD}/group-assets/new`,
    },
    createuser: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
    },
    taisan: {
      root: `${ROOTS.DASHBOARD}/asset`,
      new: `${ROOTS.DASHBOARD}/asset/new`,
    },
    giaonhants: {
      root: `${ROOTS.DASHBOARD}/delivery`,
      new: `${ROOTS.DASHBOARD}/delivery/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/delivery/${id}/edit`,
      detail: (id: string) => `${ROOTS.DASHBOARD}/delivery/${id}`,
    },
    phieunx: {
      root: `${ROOTS.DASHBOARD}/inventory-in-out`,
      new: `${ROOTS.DASHBOARD}/inventory-in-out/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/inventory-in-out/${id}/edit`,
      detail: (id: string) => `${ROOTS.DASHBOARD}/inventory-in-out/${id}`,
    },
    phieuncc: {
      root: `${ROOTS.DASHBOARD}/inventory-out-in`,
      new: `${ROOTS.DASHBOARD}/inventory-out-in/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/inventory-out-in/${id}/edit`,
      detail: (id: string) => `${ROOTS.DASHBOARD}/inventory-out-in/${id}`,
    },
    phieuxuat: {
      root: `${ROOTS.DASHBOARD}/inventory-out`,
      new: `${ROOTS.DASHBOARD}/inventory-out/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/inventory-out/${id}/edit`,
      detail: (id: string) => `${ROOTS.DASHBOARD}/inventory-out/${id}`,
    },
    suachuats: {
      root: `${ROOTS.DASHBOARD}/property-repair`,
      new: `${ROOTS.DASHBOARD}/property-repair/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/property-repair/${id}/edit`,
      detail: (id: string) => `${ROOTS.DASHBOARD}/property-repair/${id}`,
    },
    taisanqrcode: {
      root: `${ROOTS.DASHBOARD}/qrcode-property`,
    },
  },
};
