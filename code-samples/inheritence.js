import React, {PropTypes} from 'react';

class Hello extends React.Component {
  greeting() {
    return "Hello";
  },
  render() {
    return <div>{this.greeting()} {this.props.name}</div>;
  }
}

class Bonjour extends Hello {
  greeting() {
    return "Bonjour";
  },
}

React.render(<Bonjour name="Vim" />, mountNode);
