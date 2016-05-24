// @TODO This is a temporary hack to integrate Relay. Should be handled differently.
import Relay from 'react-relay';
export default class PageRoute extends Relay.Route {}
PageRoute.queries = { viewer: () => Relay.QL`query { viewer }`, bookmark: () => Relay.QL`query { bookmarkByUri(uri: $location) }` };
PageRoute.routeName = 'PageRoute';