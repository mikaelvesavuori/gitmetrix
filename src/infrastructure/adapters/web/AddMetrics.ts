import { MikroLog } from 'mikrolog';
import { MikroMetric } from 'mikrometric';

import { EventInput } from '../../../interfaces/Lambda';
import { MetricInputDto } from '../../../interfaces/MetricInput';

import { addMetric } from '../../../usecases/addMetric';

import { end } from '../../frameworks/end';

import { metadataConfig } from '../../../config/metadata';

/**
 * @description This handles the intake of new metrics.
 *
 * At this point, the intake will not previously have been able
 * to ascertain the exact type of event, so we need to take care
 * of that at this stage.
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
    const body: Record<string, any> =
      event.body && typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const headers: Record<string, any> = event.headers;

    const inputDto: MetricInputDto = Object.freeze({
      headers,
      body
    });

    await addMetric(inputDto);

    return end(204);
  } catch (error: any) {
    const statusCode: number = error?.['cause']?.['statusCode'] || 400;
    const message: string = error.message;
    logger.error(message);
    return end(statusCode, message);
  }
}
