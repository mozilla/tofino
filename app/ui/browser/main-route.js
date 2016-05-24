// @TODO This is a temporary hack to integrate Relay. Should be handled differently.
import Relay from 'react-relay';
export default class MainRoute extends Relay.Route {}
MainRoute.queries = { viewer: () => Relay.QL`query { viewer }` };
MainRoute.routeName = 'MainRoute';