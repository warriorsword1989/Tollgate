import RdnodeSearch from './RdnodeSearch';

class SearchFactory {
  constructor(connection) {
    this.connection = connection;
  }

  createSearch(type) {
    let search = null;
    switch (type){
      case "RDNODE":
        search = new RdnodeSearch(this.connection);
        break;
      case "RDLINK":
        break;
    }

    return search;
  }
}

export default SearchFactory
