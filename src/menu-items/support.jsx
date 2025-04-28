// assets
import { QuestionOutlined, GithubOutlined, XOutlined } from '@ant-design/icons';

// icons
const icons = {
  QuestionOutlined,
  GithubOutlined,
  XOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Support',
  type: 'group',
  children: [
    {
      id: 'documentation',
      title: 'Documentation',
      type: 'item',
      url: '/documentation',
      icon: icons.QuestionOutlined,
      breadcrumbs: false
    },
    {
      id: 'github',
      title: 'GitHub',
      type: 'item',
      url: 'https://github.com/smswithoutborders',
      icon: icons.GithubOutlined,
      external: true,
      target: true
    },
    {
      id: 'x',
      title: 'X',
      type: 'item',
      url: 'https://x.com/RelaySMS',
      icon: icons.XOutlined,
      external: true,
      target: true
    }
  ]
};

export default support;
