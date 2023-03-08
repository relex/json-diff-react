import React, { useState } from 'react';
import { JsonDiffComponent } from 'json-diff-react';

const initialA = {
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
};

const initialB = {
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

function Editor({ value, callback } : { value: string, callback: any }) {
  return (
    <textarea value={value} onChange={callback} cols={40} rows={40}>
    </textarea>
  );
}

function App() {
  const [a, setA] = useState(JSON.stringify(initialA, null, 2));
  const [b, setB] = useState(JSON.stringify(initialB, null, 2));

  function Result(): JSX.Element {
    try {
      const parsedA = JSON.parse(a);
      const parsedB = JSON.parse(b);

      return <JsonDiffComponent jsonA={parsedA} jsonB={parsedB} />;
    } catch(e: any) {
      return <p>{"Error:" + e.message}</p>;
    }
  }

  return (
    <div>
      <table>
        <tbody>
        <tr>
          <td>
            <Editor
              value={a}
              callback={(e: React.ChangeEvent<HTMLTextAreaElement>) => setA(e.target.value)} />
          </td>
          <td>
            <Editor
              value={b}
              callback={(e: React.ChangeEvent<HTMLTextAreaElement>) => setB(e.target.value)} />
          </td>
        </tr>
        </tbody>
      </table>
      <Result />
    </div>
  );
}

export default App;
