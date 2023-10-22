import {schemaBuilder} from '@app/schema/builder';
import {PageCursor, PageCursors} from './types';

export const PageCursorType = schemaBuilder.objectRef<PageCursor>('PageCursor').implement({
  fields: t => ({
    cursor: t.exposeString('cursor'),
    pageNumber: t.exposeInt('pageNumber'),
    isCurrent: t.exposeBoolean('isCurrent'),
  }),
});

export const PageCursorsType = schemaBuilder.objectRef<PageCursors>('PageCursors').implement({
  fields: t => ({
    first: t.field({
      type: PageCursorType,
      resolve: ({first}) => first,
    }),
    last: t.field({
      type: PageCursorType,
      resolve: ({last}) => last,
    }),
    around: t.field({
      type: [PageCursorType],
      resolve: ({around}) => around,
    }),
  }),
});

schemaBuilder.globalConnectionField('pageCursors', t =>
  t.field({
    type: PageCursorsType,
    resolve: ({pageCursors}) => pageCursors,
  })
);
