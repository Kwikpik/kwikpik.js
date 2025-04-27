import axios, { type AxiosInstance } from 'axios';
import { z } from 'zod';

// Schemas
const configurationSchema = z.object({
  apiKey: z.string(),
  interactOn: z.enum(['dev', 'live']).optional().default('live'),
  serverUrl: z.string().url().optional(),
});

const _estimationSchema = z.object({
  pickupLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  }),
  deliveryLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  }),
  vehicleType: z
    .enum(['motorcycle', 'bus', 'car', 'heavy_truck', 'mini_truck', 'bicycle'])
    .optional()
    .default('motorcycle'),
  insured: z.boolean().default(false),
  itemValue: z.number().optional(),
});

const _singleRequestSchema = _estimationSchema.extend({
  senderName: z.string(),
  senderEmail: z.string().email(),
  senderPhoneNumber: z
    .string()
    .regex(
      new RegExp(
        /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/,
      ),
      {
        message: 'Invalid phone number',
      },
    )
    .min(10),
  recipientName: z.string(),
  recipientPhoneNumber: z
    .string()
    .regex(
      new RegExp(
        /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/,
      ),
      {
        message: 'Invalid phone number',
      },
    )
    .min(10),
  itemCategory: z.string(),
  itemName: z.string(),
  description: z.string().optional().nullable(),
  itemWeight: z.number().optional(),
  itemQuantity: z.number().default(1),
  image: z.string().url().optional(),
});

const initializationSchema = z.union([
  _singleRequestSchema,
  z.array(_singleRequestSchema),
]);
const estimationSchema = z.union([
  _estimationSchema,
  z.array(_estimationSchema),
]);

type SDKConfig = z.infer<typeof configurationSchema>;

// Other types
type EstimationPayload = z.infer<typeof estimationSchema>;
type InitializationPayload = z.infer<typeof initializationSchema>;

type HTTPRequestResponseType = 'estimation' | 'initialization';

export class SDK {
  private $instance: AxiosInstance;
  private $promises: Promise<{
    type: HTTPRequestResponseType;
    payload: any;
  }>[] = [];
  protected constructor(config: SDKConfig) {
    config = configurationSchema.parse(config);
    if (!config.serverUrl)
      config.serverUrl =
        config.interactOn === 'live'
          ? 'https://api.kwikpik.io/partners'
          : 'https://staging-api.kwikpik.io/partners';

    const headers = { 'x-api-key': config.apiKey };
    this.$instance = axios.create({ baseURL: config.serverUrl, headers });
  }

  static initialize(config: SDKConfig) {
    return new SDK(config);
  }

  dispatch(payload: InitializationPayload) {
    payload = initializationSchema.parse(payload);
    const outboundPayload = Array.isArray(payload) ? payload : [payload];
    const promises = outboundPayload.map(async (p) => {
      const resp = await this.$instance.post('/requests/initiate', p);
      return {
        type: 'initialization' as HTTPRequestResponseType,
        payload: resp.data.result,
      };
    });
    this.$promises.push(...promises);
    return this;
  }

  estimate(payload: EstimationPayload) {
    payload = estimationSchema.parse(payload);
    const outboundPayload = Array.isArray(payload) ? payload : [payload];
    const promises = outboundPayload.map(async (p) => {
      const resp = await this.$instance.post('/requests/estimate', p);
      return {
        type: 'estimation' as HTTPRequestResponseType,
        payload: resp.data.result,
      };
    });
    this.$promises.push(...promises);
    return this;
  }

  async fulfill() {
    try {
      const fulfilled = await Promise.all(this.$promises);
      this.$promises = [];
      return fulfilled;
    } catch (error: any) {
      this.$promises = [];
      return Promise.reject(error);
    }
  }
}
