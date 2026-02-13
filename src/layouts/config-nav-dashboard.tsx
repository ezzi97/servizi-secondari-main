import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Analisi',
    path: '/analisi',
    icon: icon('ic-blog'),
  },
  {
    title: 'Servizi',
    path: '/tutti-servizi',
    icon: icon('ic-user'),
  },
  {
    title: 'Servizi archiviati',
    path: '/servizi-archiviati',
    icon: icon('ic-disabled'),
  }
];
