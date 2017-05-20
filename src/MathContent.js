import React from 'react';
import ReactDOM from 'react-dom';

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
    // We can async load the math components if they have huge transitive deps
    // otherwise we can just statically import. In this case InlineLatexMathComponent
    // has katex as a dep, so we'll async load this only when required on the page.
    import(
      './InlineLatexMathComponent.js',
    ).then(({ default: InlineLatexMathComponent }) => {
      ReactDOM.render(
        <InlineLatexMathComponent>{el.textContent}</InlineLatexMathComponent>,
        el,
      );
    });
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

export default MathContent;
