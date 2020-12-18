import { useState } from 'react';
import './App.css';

const App = () => {
  const [ruby1, setRuby1] = useState('');
  const [ruby2, setRuby2] = useState('');
  const [ruby3, setRuby3] = useState('');
  const [ruby4, setRuby4] = useState('');
  const [ruby5, setRuby5] = useState('');
  const [ruby6, setRuby6] = useState('');
  const [kanji, setKanji] = useState('');

  const kanjiSplit = kanji.split('')
  const count = kanjiSplit.length

  const Rubyfuri = () => {
    if (count === 1) {
      return (
        <div>
          <h3>1文字</h3>
          <p>
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>(</rp><rt>"}{ruby1}{"</rt><rp>)</rp></ruby>"}
          </p>
        </div>
      )
    } else if (count === 2) {
      return (
        <div>
          <h3>2文字</h3>
          <p>
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>(</rp><rt>"}{ruby1}{"</rt><rp>)</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>(</rp><rt>"}{ruby2}{"</rt><rp>)</rp></ruby>"}
          </p>
        </div>
      )
    } else if (count === 3) {
      return (
        <div>
          <h3>3文字</h3>
          <p>
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>(</rp><rt>"}{ruby1}{"</rt><rp>)</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>(</rp><rt>"}{ruby2}{"</rt><rp>)</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>(</rp><rt>"}{ruby3}{"</rt><rp>)</rp></ruby>"}
          </p>
        </div>
      )
    } else if (count === 4) {
      return (
        <div>
          <h3>4文字</h3>
          <p>
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>(</rp><rt>"}{ruby1}{"</rt><rp>)</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>(</rp><rt>"}{ruby2}{"</rt><rp>)</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>(</rp><rt>"}{ruby3}{"</rt><rp>)</rp><rb>"}{kanjiSplit[3]}{"</rb><rp>(</rp><rt>"}{ruby4}{"</rt><rp>)</rp></ruby>"}
          </p>
        </div>
      )
    }　else if (count === 5) {
      return (
        <div>
          <h3>5文字</h3>
          <p>
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>(</rp><rt>"}{ruby1}{"</rt><rp>)</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>(</rp><rt>"}{ruby2}{"</rt><rp>)</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>(</rp><rt>"}{ruby3}{"</rt><rp>)</rp><rb>"}{kanjiSplit[3]}{"</rb><rp>(</rp><rt>"}{ruby4}{"</rt><rp>)</rp><rb>"}{kanjiSplit[4]}{"</rb><rp>(</rp><rt>"}{ruby5}{"</rt><rp>)</rp></ruby>"}
          </p>
        </div>
      )
    } else if (count === 6) {
      return (
        <div>
          <h3>6文字</h3>
          <p>
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>(</rp><rt>"}{ruby1}{"</rt><rp>)</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>(</rp><rt>"}{ruby2}{"</rt><rp>)</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>(</rp><rt>"}{ruby3}{"</rt><rp>)</rp><rb>"}{kanjiSplit[3]}{"</rb><rp>(</rp><rt>"}{ruby4}{"</rt><rp>)</rp><rb>"}{kanjiSplit[4]}{"</rb><rp>(</rp><rt>"}{ruby5}{"</rt><rp>)</rp><rb>"}{kanjiSplit[5]}{"</rb><rp>(</rp><rt>"}{ruby6}{"</rt><rp>)</rp></ruby>"}
          </p>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>入力欄</h1>
        <div>
          <input
            className="kanji"
            value={kanji}
            placeholder="漢字を入力"
            autoFocus="true"
            onChange={(e) => {setKanji(e.target.value)}}
          ></input>
        </div>
        <div>
          <input
            className="ruby"
            value={ruby1}
            placeholder="ルビ①"
            onChange={(e) => {setRuby1(e.target.value)}}
          ></input>
          <input
            className="ruby"
            value={ruby2}
            placeholder="ルビ②"
            onChange={(e) => {setRuby2(e.target.value)}}
          ></input>
          <input
            className="ruby"
            value={ruby3}
            placeholder="ルビ③"
            onChange={(e) => {setRuby3(e.target.value)}}
          ></input>
          <input
            className="ruby"
            value={ruby4}
            placeholder="ルビ④"
            onChange={(e) => {setRuby4(e.target.value)}}
          ></input>
          <input
            className="ruby"
            value={ruby5}
            placeholder="ルビ⑤"
            onChange={(e) => {setRuby5(e.target.value)}}
          ></input>
          <input
            className="ruby"
            value={ruby6}
            placeholder="ルビ⑥"
            onChange={(e) => {setRuby6(e.target.value)}}
          ></input>
        </div>
        <br />
        <h1>ルビ</h1>
        <div className="rubyContent">
          <Rubyfuri />
        </div>
      </header>
    </div>
  );
}

export default App;
