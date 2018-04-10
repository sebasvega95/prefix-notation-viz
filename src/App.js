import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

import GetExpression from './components/GetExpression';
import ShowResult from './components/ShowResult';
import DrawAst from './components/DrawAst';
import * as prefixNotation from './services/prefixNotation';

class App extends React.Component {
  state = {
    astString: '',
    error: null,
    result: null
  };

  constructor(props) {
    super(props);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleUserInput(input) {
    try {
      const ast = prefixNotation.computeAst(input);
      const result = prefixNotation.computeResultFromAst(ast);
      const astString = JSON.stringify(ast);
      this.setState({ astString, error: null, result });
    } catch (error) {
      this.setState({ astString: '', error, result: null });
    }
  }

  render() {
    const { astString, error, result } = this.state;

    return (
      <Grid stackable divided padded>
        <Grid.Row columns={2}>
          <Grid.Column textAlign="center">
            <GetExpression handleSubmit={this.handleUserInput} error={error} />
          </Grid.Column>
          <Grid.Column>
            <ShowResult error={error} result={result} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Container text>
              {astString && <DrawAst astString={astString} />}
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
