import {MaybePromise} from '@pothos/core';
import {DefaultConnectionArguments, offsetToCursor, resolveOffsetConnection} from '@pothos/plugin-relay';
import {PageCursor, PageCursors} from '@lib/pagination/types';

const DEFAULT_MAX_AROUND = 1;

/**
 * Resolves a "windowed" pagination connection, which offers an efficient way to navigate
 * through large sets of data by providing cursors around the current page.
 *
 * This function essentially generates a set of cursors that point to specific pages,
 * optimizing the user experience by not displaying all page numbers at once.
 * Instead, a "window" of pages is displayed around the current page, along with the
 * first and last page.
 *
 * @example
 * For a dataset with 100 pages and currently on page 50, the windowed pagination might look like:
 * 1 ... 49 50 51 ... 100
 *
 * Inspired by https://artsy.github.io/blog/2020/01/21/graphql-relay-windowed-pagination/.
 *
 * @param options - The pagination options.
 * @param options.args - The default relay connection arguments.
 * @param [options.defaultSize] - The default page size.
 * @param [options.maxSize] - The maximum page size that can be requested.
 * @param [options.around] - The number of pages to display around the current page.
 * @param resolve - The resolver function that fetches items based on offset and limit.
 *
 * @returns - Returns the paginated result with the addition of `pageCursors` which gives cursors
 * for the first, last, and surrounding pages.
 */
export async function resolveWindowedConnection<T>(
  options: {
    args: DefaultConnectionArguments;
    defaultSize?: number;
    maxSize?: number;
    around?: number;
  },
  resolve: (params: {offset: number; limit: number}) => MaybePromise<{items: T[]; totalCount: number}>
) {
  let pageCursors!: PageCursors;

  const result = await resolveOffsetConnection(options, async ({offset, limit}) => {
    // Subtracting 1 from limit for offset calculations.
    // Example:
    // For a page of 4 with a size of 10, returns the elements numbered 30 - 39 in that list.
    // So a page of 4 (and size of 10), is equivalent to an offset of 29 (and size of 10)
    const pageSize = limit - 1;
    const {totalCount, items} = await resolve({offset, limit});

    // Calculate the last page number; ensure it's at least 1.
    const lastPage = Math.max(Math.ceil(totalCount / pageSize), 1);
    const lastOffset = (lastPage - 1) * pageSize;
    const around: PageCursor[] = [];
    const maxAround = options.around ?? DEFAULT_MAX_AROUND;

    // Generate page cursors for surrounding pages.
    for (let i = -maxAround; i <= maxAround; i += 1) {
      const pageOffset = offset + i * pageSize;

      // Skip offsets that are out of bounds.
      if (pageOffset < -1) {
        continue;
      } else if (pageOffset >= totalCount) {
        break;
      }

      around.push({
        cursor: offsetToCursor(pageOffset - 1),
        pageNumber: Math.floor(pageOffset / pageSize) + 1,
        isCurrent: pageOffset === offset,
      });
    }

    pageCursors = {
      first: {cursor: offsetToCursor(-1), pageNumber: 1, isCurrent: offset === 0},
      around,
      last: {
        cursor: offsetToCursor(lastOffset - 1),
        pageNumber: lastPage,
        isCurrent: offset === lastOffset,
      },
    };

    return items;
  });

  return {...result, pageCursors};
}
