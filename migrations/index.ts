import * as migration_20260413_175323 from './20260413_175323';
import * as migration_20260413_211012 from './20260413_211012';
import * as migration_20260414_010740 from './20260414_010740';

export const migrations = [
  {
    up: migration_20260413_175323.up,
    down: migration_20260413_175323.down,
    name: '20260413_175323',
  },
  {
    up: migration_20260413_211012.up,
    down: migration_20260413_211012.down,
    name: '20260413_211012',
  },
  {
    up: migration_20260414_010740.up,
    down: migration_20260414_010740.down,
    name: '20260414_010740'
  },
];
