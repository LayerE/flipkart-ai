import type { ReactNode } from 'react';
import { BsImageFill, BsLayersFill } from 'react-icons/bs';
import { FaInfoCircle, FaCloudDownloadAlt, FaCog } from 'react-icons/fa';
import {LuFrame} from 'react-icons/lu'

export type MenuTabId = 'canvas' | 'layers' | 'download';

export const menuTabsDefinition: {
  id: MenuTabId;
  label: string;
  icon: ReactNode;
}[] = [
  {
    id: 'canvas',
    label: 'Canvas',
    icon: <LuFrame />,
  },
  {
    id: 'download',
    label: 'Download/Save',
    icon: <FaCloudDownloadAlt />,
  },
  {
    id: 'layers',
    label: 'Layers',
    icon: <BsLayersFill />,
  },
  /*{
    id: 'settings',
    label: 'Settings',
    icon: <FaCog />,
  },*/
];
