import {schemaBuilder} from '@app/schema/builder';

// Features
import '@features/schema';

export const schema = schemaBuilder.toSchema();
