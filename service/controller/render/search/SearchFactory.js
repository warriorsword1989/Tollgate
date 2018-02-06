import RdNodeSearch from './RdNodeSearch';
import RdLinkSearch from './RdLinkSearch';
import AdLinkSearch from './AdLinkSearch';
import AdAdminSearch from './AdAdminSearch';
import AdFaceSearch from './AdFaceSearch';
import RwLinkSearch from './RwLinkSearch';
import RdGateSearch from './RdGateSearch';
import TipTollGateSearch from './TipTollGateSearch';

class SearchFactory {
  constructor(connection) {
    this.connection = connection;
  }

  createSearch(type) {
    let search = null;
    switch (type){
      case "RDNODE":
        search = new RdNodeSearch(this.connection);
        break;
      case "RDLINK":
        search = new RdLinkSearch(this.connection);
        break;
      case "ADLINK":
        search = new AdLinkSearch(this.connection);
        break;
      case "ADADMIN":
        search = new AdAdminSearch(this.connection);
        break;
      case "ADFACE":
        search = new AdFaceSearch(this.connection);
        break;
      case "RWLINK":
        search = new RwLinkSearch(this.connection);
        break;
      case "RDTOLLGATE":
        search = new RdGateSearch(this.connection);
        break;
      case "1107":
        search = new TipTollGateSearch(this.connection);
        break;
      default:
        search = [];
        break;
    }

    return search;
  }
}

export default SearchFactory
