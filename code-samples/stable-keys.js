import React, {PropTypes} from 'react';
import NewProjectComponent from './new-project-component.cjsx';
import ProjectCardComponent from './project-card-component.jsx';

export default React.createClass({

  displayName: 'ProjectsPage',

  propTypes: {
    projects: PropTypes.array.isRequired,
    collaborators: PropTypes.object.isRequired
  },

  renderProjects(projects) {
    return projects.map(project => {
      return (<ProjectCardComponent
        project={project}
        key={project.id}
        collaborators={ this.props.collaborators[project.id] }
      />);
    });
  },

  render() {

    document.title = 'Projects | Atomic';

    let projects = this.props.projects
      .filter(project => !project.creating);

    let classes = React.addons.classSet({
      'hub-projects': true,
      'four-plus': projects.length > 3
    });

    return (
      <div className={classes}>
        <h1>Projects</h1>
        <NewProjectComponent projects={ projects }/>
        { this.renderProjects(projects) }
      </div>
    );

  }

});
