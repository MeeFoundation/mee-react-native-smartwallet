import { defineConfig } from 'steiger' 
import fsd from '@feature-sliced/steiger-plugin'


export default  defineConfig([
  ...fsd.configs.recommended,
  {
    // TODO Remove this ignore
    // For now disable the insignificant-slice rule for the attribute entities
    // as it is used in one place, but it should be used in more places
    files: ['./src/entities/attribute/**'],
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
])