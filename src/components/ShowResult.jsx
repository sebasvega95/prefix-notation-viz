import React from 'react';
import { Message } from 'semantic-ui-react';

function ShowResult({ error, result }) {
  return (
    <Message
      icon={error ? 'warning' : result ? 'write' : 'ellipsis horizontal'}
      info={Boolean(!error && result)}
      error={!!error}
      header={error ? 'An error ocurred' : result !== null ? 'Result' : null}
      content={
        error
          ? error.message
          : result !== null ? result : 'Please type an expression'
      }
    />
  );
}

export default ShowResult;
