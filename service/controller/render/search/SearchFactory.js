import RdNodeSearch from './RdNodeSearch';
import RdLinkSearch from './RdLinkSearch';

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
      default:
        break;
    }

    return search;
  }
}

export default SearchFactory
