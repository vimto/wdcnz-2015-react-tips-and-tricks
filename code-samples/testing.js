import {addons as ReactAddons} from 'react/addons';
import AddCollaboratorComponent from '../scripts/components/add-collaborator-component.jsx';
import React from 'react';
import flux from '../scripts/flux';

describe('AddCollaboratorOverlayComponent', function() {
  // Render the component
  const projectId = 1;
  const renderedComponent = ReactAddons.testUtils.renderIntoDocument(
    <AddCollaboratorOverlayComponent { ...{ projectId } } />
  );
  // Find the elements we want want to interact with
  const submitButton = testUtils.findRenderedDOMComponentWithClass(
    renderedComponent, 'c_add_collaborator-send'
  );
  const emailInput = testUtils.findRenderedDOMComponentWithTag(
    renderedComponent, 'input'
  );
  // Stub the real API call
  const addCollaboratorAction = this.sinon.stub(flux.actions, 'addCollaborator').returns(true);

  // Simulate the form being submitted
  testUtils.Simulate.change(emailInput, { target: { value: 'vim@atomic.io' } });
  testUtils.Simulate.click(submitButton);

  // Check the API was called
  expect(addCollaboratorAction.calledOnce).to.be.true();

  // Restore the stub
  flux.actions.addCollaborator.restore();

});
