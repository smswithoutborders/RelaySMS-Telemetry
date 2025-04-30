// assets
import { DashboardOutlined, MessageOutlined, CheckSquareOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  MessageOutlined,
  CheckSquareOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'open-telemetry',
      title: 'OpenTelemetry',
      type: 'item',
      url: '/open-telemetry',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'publications',
      title: 'Publications',
      type: 'item',
      url: '/publications',
      icon: icons.MessageOutlined,
      breadcrumbs: false
    },
    {
      id: 'reliability',
      title: 'Reliability',
      type: 'item',
      url: '/reliability',
      icon: icons.CheckSquareOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
