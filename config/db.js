const models = require('carpinteria-erp-models');

const {
  user,
  pass,
  host,
  port,
  dataBaseName,
  options: mongoOptions,
} = require('.').mongo;

/* istanbul ignore next */
const userPass = user && pass ? `${user}:${pass}@` : '';

const hostProperty = [].concat(host);
const portProperty = [].concat(port);
/* istanbul ignore next */
const hosts = hostProperty.reduce((s, h, i) => `${s}${i > 0 ? ',' : ''}${h}:${portProperty[i] || portProperty[0]}`, '');

const authSource = process.env.NODE_ENV === 'production' ? '?authSource=admin' : '';
const uri = process.env.MONGODB || `mongodb://${userPass}${hosts}/${dataBaseName}${authSource}`;

const options = mongoOptions || {};

module.exports = () => {
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') models.connect(uri, options);
};
