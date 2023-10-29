#!/usr/bin/env node

import { bootstrap } from '/common/bootstrap';
import { Logger } from '@nestjs/common';

(async () => {
  try {
    await bootstrap();
  } catch (e) {
    Logger.error(e, 'Bootstrap');
    process.exit(1);
  }
})();
