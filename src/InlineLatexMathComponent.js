import React from 'react';
import katex from 'katex';

// Example math component
class InlineLatex extends React.Component {
  componentDidMount() {
    if (!this.node || !this.props.children) return;
    katex.render(this.props.children, this.node);
  }

  render() {
    return <div ref={node => (this.node = node)} />;
  }
}

export default InlineLatex;
