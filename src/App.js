import { useState } from 'react';
import './App.css';

const App = () => {
  const [ruby1, setRuby1] = useState('');
  const [ruby2, setRuby2] = useState('');
  const [ruby3, setRuby3] = useState('');
  const [kanji1, setKanji1] = useState('');
  const [kanji2, setKanji2] = useState('');
  const [kanji3, setKanji3] = useState('');

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
            value={kanji1}
            onChange={(e) => {setKanji1(e.target.value)}}
          ></input>
          <input
            className="kanji"
            value={kanji2}
            onChange={(e) => {setKanji2(e.target.value)}}
          ></input>
          <input
            className="kanji"
            value={kanji3}
            onChange={(e) => {setKanji3(e.target.value)}}
          ></input>
        </div>
        <br />
        <h1>ルビ</h1>
        <h3>1文字</h3>
        <p>
          {"<ruby><rb>"}{kanji1}{"</rb><rp>(</rp><rt>"}{ruby1}{"</rt><rp>)</rp></ruby>"}
        </p>
        <h3>2文字</h3>
        <p>
          {"<ruby><rb>"}{kanji1}{"</rb><rp>(</rp><rt>"}{ruby1}{"</rt><rp>)</rp><rb>"}{kanji2}{"</rb><rp>(</rp><rt>"}{ruby2}{"</rt><rp>)</rp></ruby>"}
        </p>
        <h3>3文字</h3>
        <p>
          {"<ruby><rb>"}{kanji1}{"</rb><rp>(</rp><rt>"}{ruby1}{"</rt><rp>)</rp><rb>"}{kanji2}{"</rb><rp>(</rp><rt>"}{ruby2}{"</rt><rp>)</rp><rb>"}{kanji3}{"</rb><rp>(</rp><rt>"}{ruby3}{"</rt><rp>)</rp></ruby>"}
        </p>
      </header>
    </div>
  );
}

export default App;
