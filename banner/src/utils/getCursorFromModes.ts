import type { CSSProperties } from 'react';

import type { UserMode, ActionMode } from '~/config/types';

export default function getCursorFromUserMode({
  userMode,
  actionMode,
}: {
  userMode: UserMode;
  actionMode: ActionMode;
}): CSSProperties['cursor'] {
  switch (userMode) {
    case 'select': {
      if (actionMode?.type === 'isMoving') return 'move';
      if (actionMode?.type === 'isPanning') return 'grabbing';

      switch (actionMode?.option) {
        case 'topLeft':
          return 'nwse-resize';
        case 'topCenter':
          return 'ns-resize';
        case 'topRight':
          return 'nesw-resize';
        case 'middleLeft':
          return 'ew-resize';
        case 'middleRight':
          return 'ew-resize';
        case 'bottomLeft':
          return 'nesw-resize';
        case 'bottomCenter':
          return 'ns-resize';
        case 'bottomRight':
          return 'nwse-resize';
          case 'topLeft1':
          return 'nwse-resize';
        case 'topCenter1':
          return 'ns-resize';
        case 'topRight1':
          return 'nesw-resize';
        case 'middleLeft1':
          return 'ew-resize';
        case 'middleRight1':
          return 'ew-resize';
        case 'bottomLeft1':
          return 'nesw-resize';
        case 'bottomCenter1':
          return 'ns-resize';
        case 'bottomRight1':
          return 'nwse-resize';
        default:
          return 'auto';
      }
    }
    case 'free-draw':
    case 'rectangle':
    case 'ellipse':
      return 'crosshair';
    case 'text':
      return 'text';
    default:
      return 'auto';
  }
}
