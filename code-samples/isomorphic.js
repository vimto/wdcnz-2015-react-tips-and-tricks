import React from 'react';
import { Node } from '../models';
import ContainerStore from '../../client/scripts/stores/container';
import ContainerComponent from './container-component-wrapper.coffee';

module.exports = ({ documentId, containerId }) => {

    return Node.getActiveByDocumentAndContainer(documentId, containerId)
    .then((nodes) => {

      const containerStore = new ContainerStore({
        id: containerId,
        nodes,
        createdAt: new Date()
      });

      const page = containerStore.getPage();
      const containerComponent = React.createFactory(ContainerComponent)({
        container: containerStore
      });

      return {
        width: page.properties.w,
        height: page.properties.h,
        html: React.renderToStaticMarkup(containerComponent)
      };
    });

};
