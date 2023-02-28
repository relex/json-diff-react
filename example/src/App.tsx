import React, { useState } from 'react';
import { JsonDiffComponent } from 'json-diff-react';

import './App.css';

function Editor({ value, callback } : { value: string, callback: any }) {
  return ( 
    <textarea value={value} onChange={callback} cols={40} rows={40}>
    </textarea>
  );
}

const originalObject = {
  a: 1,
  b: "test",
  c: [
    1,
    2,
    3
  ],
  d: {
    e: "test",
    f: {
      g: [1, "asdf"]
    }
  }
}

const latestObject = {
  a: 1,
  b: "changed",
  c: [
    1,
    3
  ],
  d: {
    e: "test",
    f: {
      g: [1, 2]
    }
  }
}

function App() {
  const [original, setOriginal] = useState(JSON.stringify(originalObject, null, 2));
  const [latest, setLatest] = useState(JSON.stringify(latestObject, null, 2));

  const onChangeOriginal = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setOriginal(e.target.value);
  }

  const onChangeLatest = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setLatest(e.target.value);
  }

  const onError = (e: Error): JSX.Element => {
    return <p>{e.message}</p>;
  }

  return (
    <div className="App">
      <table>
        <tbody>
        <tr>
          <td>
            <Editor value={original} callback={onChangeOriginal} />
          </td>
          <td>
            <Editor value={latest} callback={onChangeLatest} />
          </td>
        </tr>
        </tbody>
      </table>
      <JsonDiffComponent 
        original={original} 
        latest={latest} 
        onError={onError}
        />
    </div>
  );
}

export default App;

