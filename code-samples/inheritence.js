import React from 'react';

class Hello extends React.Component {
  greeting() {
    return "Hello";
  },
  render() {
    return (
      <h1>
        { this.greeting() } { this.props.name }
      </h1>
    );
  }
}

class Bonjour extends Hello {
  greeting() {
    return "Bonjour";
  },
}

React.render(<Bonjour name="Le Vim" />, element);
