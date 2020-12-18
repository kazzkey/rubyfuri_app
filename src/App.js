import { useState } from 'react';
import './App.css';

const App = () => {
  const [ruby1, setRuby1] = useState('');
  const [ruby2, setRuby2] = useState('');
  const [ruby3, setRuby3] = useState('');
  const [kanji, setKanji] = useState('');

  const kanjiSplit = kanji.split('')

  return (
    <div className="App">
      <header className="App-header">
        <h1>漢字</h1>
        <div>
          <input
            className="ruby"
            value={ruby1}
            onChange={(e) => {setRuby1(e.target.value)}}
          ></input>
          <input
            className="ruby"
            value={ruby2}
            onChange={(e) => {setRuby2(e.target.value)}}
          ></input>
          <input
            className="ruby"
            value={ruby3}
            onChange={(e) => {setRuby3(e.target.value)}}
          ></input>
        </div>
        <div>
          <input
            className="kanji"
            value={kanji}
            onChange={(e) => {setKanji(e.target.value)}}
          ></input>
        </div>
        <br />
        <h1>ルビ</h1>
        <h3>1文字</h3>
        <p>
          {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>(</rp><rt>"}{ruby1}{"</rt><rp>)</rp></ruby>"}
        </p>
        <h3>2文字</h3>
        <p>
          {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>(</rp><rt>"}{ruby1}{"</rt><rp>)</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>(</rp><rt>"}{ruby2}{"</rt><rp>)</rp></ruby>"}
        </p>
        <h3>3文字</h3>
        <p>
          {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>(</rp><rt>"}{ruby1}{"</rt><rp>)</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>(</rp><rt>"}{ruby2}{"</rt><rp>)</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>(</rp><rt>"}{ruby3}{"</rt><rp>)</rp></ruby>"}
        </p>
      </header>
    </div>
  );
}

export default App;
