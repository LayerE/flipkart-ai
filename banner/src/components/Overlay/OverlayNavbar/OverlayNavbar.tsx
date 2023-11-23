// @ts-nocheck

import styled from '@emotion/styled';
import { ActionIcon, Tooltip } from '@mantine/core';
import React, { type ReactNode } from 'react';
import { BsSquare, BsCircle, BsImageFill } from 'react-icons/bs';
import { FaMousePointer,FaBeer,FaArrowLeft } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi';
import { RiImageLine } from 'react-icons/ri';
import { RxText } from 'react-icons/rx';

import type { UserMode } from '~/config/types';
import useActiveObjectId from '~/store/useActiveObjectId';
import useUserMode from '~/store/useUserMode';
import theme from '~/theme';
import { useRouter } from 'next/router';


const Nav = styled('div')`
  display: flex;
  align-items: center;
  gap: ${theme.variables.overlayItemsGutter};
`;

const Div = styled('div')`
  pointer-events: auto;
  background: var(--color-bgPrimary);
  border-radius: 0.25rem;
  padding: 0.3rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  border: 0.0625rem solid var(--color-borderPrimary);
`;

const Ul = styled('ul')`
  width: 100%;
  height: 100%;
  list-style: none;
  padding: 0;
  display: grid;
  grid-gap: 0.15rem;
  align-items: center;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  & > li {
    width: 100%;
    height: 100%;
  }
`;

interface UserModeButton {
  mode: UserMode;
  label: string;
  icon: ReactNode;
}

interface UtilButton {
  label: string;
  icon: ReactNode
}

const utilButtons:UtilButton[] = [
  {
    label: 'Back',
    icon: <FaArrowLeft/>
  }
]

const userModeButtonsPrimary: UserModeButton[] = [
  {
    mode: 'select',
    label: 'Select mode',
    icon: <FaMousePointer />,
  },
];

const userModeButtonsSecondary: UserModeButton[] = [
  {
    mode: 'free-draw',
    label: 'Draw',
    icon: <HiPencil />,
  },
  {
    mode: 'rectangle',
    label: 'Rectangle',
    icon: <BsSquare />,
  },
  {
    mode: 'ellipse',
    label: 'Ellipse',
    icon: <BsCircle />,
  },
  {
    mode: 'text',
    label: 'Text',
    icon: <RxText />,
  },
  {
    mode: 'icon',
    label: 'Asset',
    icon: <RiImageLine />,
  },
  {
    mode: 'image',
    label: 'Image',
    icon: <BsImageFill />,
  },
];

export default function OverlayNavbar() {
  const setActiveObjectId = useActiveObjectId((state) => state.setActiveObjectId);
  const router = useRouter();

  const userMode = useUserMode((state) => state.userMode);
  const setUserMode = useUserMode((state) => state.setUserMode);

  const renderUserModeButtons = (buttons: UserModeButton[]) => (
    <Div>
      <Ul style={{ gridTemplateColumns: `repeat(${buttons.length}, minmax(0, 1fr))` }}>
        {buttons.map(({ mode, label, icon }) => {
          const isActive = userMode === mode;
          return (
            <li key={mode}>
              <Tooltip
                position="bottom-start"
                label={`${label}${label.endsWith('mode') ? '' : ' tool'}${isActive ? ` (active)` : ''}`}
                offset={16}
              >
                <ActionIcon
                  color="dark"
                  variant={isActive ? 'gradient' : 'dark'}
                  size="lg"
                  onClick={() => {
                    setUserMode(mode);
                    setActiveObjectId(null);
                  }}
                >
                  {icon}
                </ActionIcon>
              </Tooltip>
            </li>
          );
        })}
      </Ul>
    </Div>
  );

  const renderUtilButtons = (buttons: UtilButton[]) => (
    <Div>
      <Ul style={{ gridTemplateColumns: `repeat(${buttons.length}, minmax(0, 1fr))` }}>
        {buttons.map(({ label, icon }) => {
          return (
            <li key={label}>
              <Tooltip
                position="bottom-start"
                label={`${label}`}
                offset={16}
              >
                <ActionIcon
                  color="dark"
                  variant={'gradient'}
                  size="lg"
                  onClick={() => {
                    window.location.href = process.env.NEXT_PUBLIC_FLIPKART_APP_URL as string
                  }}
                >
                  
                  {icon}
                </ActionIcon>
              </Tooltip>
            </li>
          );
        })}
      </Ul>
    </Div>
  );

  return (
    <Nav>
      {renderUtilButtons(utilButtons)}
      {renderUserModeButtons(userModeButtonsPrimary)}
      {renderUserModeButtons(userModeButtonsSecondary)}
    </Nav>
  );
}
