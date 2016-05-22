import schema from '../app/shared/graphql-schema';
import getbabelRelayPlugin from 'babel-relay-plugin';

module.exports = getbabelRelayPlugin(schema.data);