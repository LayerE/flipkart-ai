import styled from '@emotion/styled';
import { ActionIcon, Menu, Tooltip } from '@mantine/core';
import React from 'react';
import { FaBars } from 'react-icons/fa';

import useModalContext from '~/context/useModalContext';
import useActiveObjectId from '~/store/useActiveObjectId';

import { menuTabsDefinition } from './menuTabsDefinition';
import theme from '~/theme';

const WrapperDiv = styled('div')`
  pointer-events: auto;
`;

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

export default function OverlayMenu() {
  const { openMenuModal } = useModalContext();

  const setActiveObjectId = useActiveObjectId((state) => state.setActiveObjectId);

  return (
    <Div>
    <Ul style={{ gridTemplateColumns: `repeat(3, minmax(0, 1fr))` }}>
      {menuTabsDefinition.map((tab) => {

        return (
          <li key={tab.id}>
            <Tooltip
              position="bottom-start"
              label={tab.label}
              offset={16}
            >
              <ActionIcon
                color="dark"
                size="lg"
                onClick={() => {
                  setActiveObjectId(null);
                  openMenuModal(tab.id);
                }}
              >
                {tab.icon}
              </ActionIcon>
            </Tooltip>
          </li>
        );
      })}
    </Ul>
  </Div>
  );
}


