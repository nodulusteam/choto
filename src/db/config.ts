const env = process.env.NODE_CONFIG_ENV || 'local';
export const configuration = require(`../../config/${env}`).Config;
