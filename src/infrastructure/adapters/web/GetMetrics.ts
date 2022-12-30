import { MikroLog } from 'mikrolog';
import { MikroMetric } from 'mikrometric';

import { EventInput } from '../../../interfaces/Aws';

import { getMetricsUsecase } from '../../../usecases/getMetrics';

import { getDTO } from '../../frameworks/getDTO';
import { getRepo } from '../../frameworks/getRepo';
import { end } from '../../frameworks/end';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description This handles getting repository metrics.
 */
export async function handler(event: EventInput, context: Record<string, any>) {
  const logger = MikroLog.start({ metadataConfig, event, context });
  MikroMetric.start({
    namespace: metadataConfig.service,
    serviceName: metadataConfig.service,
    event,
    context
  });

  try {
    const { repoName, fromDate, toDate } = getDTO(event);
    const repository = getRepo(process.env.NODE_ENV === 'test');
    const metrics = await getMetricsUsecase({ repository, repoName, fromDate, toDate });
    return end(200, metrics);
  } catch (error: any) {
    const message: string = error.message;
    logger.error(message);
    return end(400, message);
  }
}
