import { MikroLog } from 'mikrolog';
import { MikroMetric } from 'mikrometric';

import { EventInput } from '../../../interfaces/Lambda';

import { getMetrics } from '../../../usecases/getMetrics';

import { createQueryStringParamsObjectFromString } from '../../../application/createQueryStringParamsObjectFromString';
import { getRequestDTO } from '../../../application/getRequestDTO';

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
    const queryStringParameters = createQueryStringParamsObjectFromString(event);
    const input = getRequestDTO(queryStringParameters);
    const repository = getRepo(process.env.NODE_ENV === 'test');
    const metrics = await getMetrics(repository, input);
    return end(200, metrics);
  } catch (error: any) {
    const message: string = error.message;
    logger.error(message);
    return end(400, message);
  }
}
