// assets
import {
  DashboardOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  MobileOutlined,
  TeamOutlined,
  FileSearchOutlined
} from '@ant-design/icons';

// project imports
import { SCOPES } from 'utils/scopes';

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

// Grouped by job: watching delivery, the delivery network, and who has access.
// `scope` hides an item from users without it; a group with no visible items is hidden.

export const analytics = {
  id: 'group-analytics',
  title: 'Analytics',
  type: 'group',
  children: [
    {
      id: 'overview',
      title: 'Overview',
      type: 'item',
      url: '/',
      icon: DashboardOutlined,
      breadcrumbs: false,
      scope: SCOPES.STATS_READ
    },
    {
      id: 'publication-log',
      title: 'Publication log',
      type: 'item',
      url: '/publications/log',
      icon: UnorderedListOutlined,
      breadcrumbs: false,
      scope: SCOPES.STATS_READ
    }
  ]
};

export const network = {
  id: 'group-network',
  title: 'Network',
  type: 'group',
  children: [
    {
      id: 'routing-numbers',
      title: 'Routing numbers',
      type: 'item',
      url: '/routing-numbers',
      icon: MobileOutlined,
      breadcrumbs: false
    },
    {
      id: 'platforms',
      title: 'Platforms',
      type: 'item',
      url: '/platforms',
      icon: AppstoreOutlined,
      breadcrumbs: false
    }
  ]
};

export const administration = {
  id: 'group-administration',
  title: 'Administration',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: TeamOutlined,
      breadcrumbs: false,
      scope: SCOPES.CREDS_READ
    },
    {
      id: 'logs',
      title: 'Logs',
      type: 'item',
      url: '/logs',
      icon: FileSearchOutlined,
      breadcrumbs: false,
      scope: SCOPES.AUDIT_READ
    }
  ]
};
