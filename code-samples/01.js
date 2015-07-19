import React from 'react';
import { Node } from '../models';
import Container from '../../client/scripts/stores/container';
import ContainerComponent from './container-component-wrapper.coffee';

module.exports = ({ documentId, containerId }) => {

    return Node.getActiveByDocumentAndContainer(documentId, containerId)
    .then((nodes) => {

      const container = new Container({
        id: containerId,
        nodes,
        createdAt: new Date()
      });

      const page = container.getPage();
      const containerComponent = React.createFactory(ContainerComponent)({ container });

      return {
        width: page.properties.w,
        height: page.properties.h,
        html: React.renderToString(containerComponent)
      };
    });
};
