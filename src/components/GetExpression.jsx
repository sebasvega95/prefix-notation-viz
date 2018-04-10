import React from 'react';
import { Form } from 'semantic-ui-react';

const MAX_LENGTH = 50;

class GetExpresson extends React.Component {
  state = {
    input: ''
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e, { name, value }) {
    if (name === 'input') {
      const re = /^[+\-*/0-9 ]+$/;
      if (value === '' || (re.test(value) && value.length < MAX_LENGTH)) {
        this.setState({ [name]: value });
      }
    }
  }

  handleSubmit() {
    this.props.handleSubmit(this.state.input);
  }

  render() {
    const { input } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Input
            placeholder="Prefix notation expression"
            name="input"
            value={input}
            onChange={this.handleChange}
          />
          <Form.Button disabled={input.length === 0} primary content="Submit" />
        </Form.Group>
      </Form>
    );
  }
}

export default GetExpresson;
