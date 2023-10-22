import {schemaBuilder} from '@app/schema/builder';

// Pagination
import '@lib/pagination/schema';

// Features
import '@features/schema';

export const schema = schemaBuilder.toSchema();
