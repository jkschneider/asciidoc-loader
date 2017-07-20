# asciidoc-loader

This is a Webpack loader that allows you to import Asciidoc `.adoc` files that
contain include and image directives. The result is content that you can pass
directly to asciidoctor.js.

Currently, the `leveloffset` parameter of the include directive is supported, but
lines, tag, and indent are not. All parameters of the image directive are passed
through to asciidoctor unchanged.

```javascript
import index from '!asciidoc-loader!../../docs/index.adoc';

export default function Docs() {
  return (
    <Asciidoc
      source={index}
      attrs={{system: 'atlas'}}/>
  );
}
```

Below is the Asciidoc React component that uses asciidoctor.js to render and
highlight.js to syntax highlight code blocks:

```javascript
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'asciidoctor.js/dist/css/asciidoctor.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

let asciidoctor = require('asciidoctor.js')();

export default class Asciidoc extends Component {
  constructor(props) {
    super(props);
    this.highlightCode = this.highlightCode.bind(this);
  }

  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    this.root.querySelectorAll('pre code').forEach(node => hljs.highlightBlock(node));
  }

  render() {
    let converted = asciidoctor.convert(this.props.source, { attributes: this.props.attrs, safe: 'safe'});
    return (
      <div
        ref={(root) => { this.root = root; }}
        dangerouslySetInnerHTML={{ __html: converted }} />
    )
  }
}

Asciidoc.propTypes = {
  source: PropTypes.string,
  attrs: PropTypes.any,
};
```
