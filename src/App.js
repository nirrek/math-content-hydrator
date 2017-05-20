import React, { Component } from 'react';
import MathContent from './MathContent.js';

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

class App extends Component {
  render() {
    return <MathContent content={mathContentFromServer} />;
  }
}

export default App;
