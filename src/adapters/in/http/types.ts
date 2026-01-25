/**
 * HTTP Adapter Types
 */

import type { Container } from '@/container';
import type { UserContext } from '@/env';

export type AppVariables = {
  requestId: string;
  user: UserContext;
  container: Container;
};
