export default function StoreMixin(...stores) {
  return {

    getInitialState() {
      return this.getStateFromStores(this.props);
    },

    componentDidMount() {
      stores.forEach(store =>
        store.addChangeListener(this.handleStoresChanged)
      );
      this.setState(this.getStateFromStores(this.props));
    },

    componentWillUnmount() {
      stores.forEach(store =>
        store.removeChangeListener(this.handleStoresChanged)
      );
    },

    handleStoresChanged() {
      if (this.isMounted()) {
        this.setState(this.getStateFromStores(this.props));
      }
    }

  };
}
