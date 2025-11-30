import { Logger } from '@nestjs/common';

export async function benchmark<T>(
  fn: () => Promise<T>,
  functionName: string,
  logger: Logger,
): Promise<T> {
  const startTime = performance.now();

  const result = await fn();

  const endTime = performance.now();
  const duration = endTime - startTime;
  logger.log(`${functionName} executed in ${duration.toFixed(2)}ms`);

  return result;
}
