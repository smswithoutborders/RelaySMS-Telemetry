// assets
import { GithubOutlined, DashboardOutlined } from '@ant-design/icons';

// ==============================|| MENU ITEMS - MORE ||============================== //

const support = {
  id: 'more',
  title: 'More',
  type: 'group',
  children: [
    {
      id: 'github',
      title: 'GitHub',
      type: 'item',
      url: 'https://github.com/smswithoutborders',
      icon: GithubOutlined,
      external: true,
      target: true
    },
    {
      id: 'status',
      title: 'Status',
      type: 'item',
      url: 'https://status.smswithoutborders.afkanerd.com/dashboard',
      icon: DashboardOutlined,
      external: true,
      target: true
    }
  ]
};

export default support;
