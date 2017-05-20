import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import katex from 'katex';

// This would be the soupified ckhtml math content returned by the server.
const mathContentFromServer = `
<p>
  Solve:
  <span class="mathquill-embedded-latex">e^{x + \ln 8} =  5 e^{x} + 3</span>
  Then check out this formatted list!
  <ul>
    <li><span class="mathquill-embedded-latex">a^{b + c^d} = \\Sigma d_3^2</span></li>
  </ul>
  <h1><span class="mathquill-embedded-latex">a^{b + c^d} = \\Sigma d_3^2</span></h1>
</p>
`;

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

// Given an html string (which represents an html serialization of math content)
// creates a DOM fragment in which any serialized math content is replaced
// with a mounted react component that is specific to that math content.
function hydrateMathContent(serializedContent: string): Node {
  const docFragment = document
    .createRange()
    .createContextualFragment(serializedContent);

  // Perform a series of in-place mutations of the document fragments,
  // replacing serialized math content specifications with the relevant
  // mounted React component.
  mountInlineLatexComponents(docFragment);
  // ...mountSomeOtherComponents(docFragment);
  // There will be a series of function calls here for each component. This is
  // only temporary while we have dumbass ckhtml encoding that uses a bespoke
  // format for each component. Once we have a standardized encoding that allows
  // us to extract component `type` and `props` we can switch on type to determine
  // the component to render, and then spread in the props.

  return docFragment;
}

function mountInlineLatexComponents(docFragment: Node) {
  [...docFragment.querySelectorAll('.mathquill-embedded-latex')].forEach(el => {
    ReactDOM.render(<InlineLatex>{el.textContent}</InlineLatex>, el);
  });
}

// Is given a string of mathContent ckhtml and hydrates all the serialized
// math widgets contained therein, then mounts into the dom.
class MathContent extends React.Component {
  componentDidMount() {
    if (!this.node) return;
    this.node.appendChild(hydrateMathContent(this.props.content));
  }

  render() {
    return <div ref={node => (this.node = node)} />;
  }
}

class App extends Component {
  render() {
    return <MathContent content={mathContentFromServer} />;
  }
}

export default App;
