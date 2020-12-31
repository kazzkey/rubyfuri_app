import { useEffect, useState } from 'react';
import firebase from './firebase';
import './App.css';

const db = firebase.firestore();

const App = () => {
  // ステート郡
  const [logs, setLogs] = useState([]);
  const [ruby1, setRuby1] = useState('');
  const [ruby2, setRuby2] = useState('');
  const [ruby3, setRuby3] = useState('');
  const [ruby4, setRuby4] = useState('');
  const [ruby5, setRuby5] = useState('');
  const [ruby6, setRuby6] = useState('');
  const [kanji, setKanji] = useState('');
  const [jukuji, setJukuji] = useState('');
  const [ruby_j, setRuby_j] = useState('');

  // 履歴表示の状態監視
  useEffect(() => {
    const unsubscribe = db
      .collection('logs')
      .orderBy('createdAt', 'desc')
      .limit(15)
      .onSnapshot((querysnapshot) => {
        const _logs = querysnapshot.docs.map(doc => {
          return ({
            logId: doc.id,
            ...doc.data()
          });
        });
      setLogs(_logs);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // 履歴アイテム
  const logItems = logs.map(log => {
    return (
      <i id={log.logId}
        className="logList"
        onClick={() => displayHistory(log)}
      >
        {log.kanji || log.jukuji}
      </i>
    )
  })

  // 履歴タグを表示させる関数
  const displayHistory = (id) => {
    if (id.kanji) {
      setKanji(id.kanji)
      setRuby1(id.ruby1)
      setRuby2(id.ruby2)
      setRuby3(id.ruby3)
      setRuby4(id.ruby4)
      setRuby5(id.ruby5)
      setRuby6(id.ruby6)
      setJukuji("")
      setRuby_j("")
    } else if (id.jukuji) {
      setJukuji(id.jukuji)
      setRuby_j(id.ruby_j)
      setKanji('')
      setRuby1('')
      setRuby2('')
      setRuby3('')
      setRuby4('')
      setRuby5('')
      setRuby6('')
    }
  }

  // 入力された漢字・熟字訓を保存する関数
  const HistoryLog = async () => {
    if (kanji) {
      await db.collection('logs').add({
        kanji: kanji,
        ruby1: ruby1,
        ruby2: ruby2,
        ruby3: ruby3,
        ruby4: ruby4,
        ruby5: ruby5,
        ruby6: ruby6,
        createdAt: new Date(),
      })
    } else if (jukuji) {
      await db.collection('logs').add({
        jukuji: jukuji,
        ruby_j: ruby_j,
        createdAt: new Date(),
      })
    }
  }

  // リセットボタン
  const resetBtn = () => {
    const existence = logs.some(log => log.kanji === kanji) || logs.some(log => log.jukuji === jukuji)
    if (!existence) {
      HistoryLog()
    }
    setKanji('')
    setRuby1('')
    setRuby2('')
    setRuby3('')
    setRuby4('')
    setRuby5('')
    setRuby6('')
    setJukuji('')
    setRuby_j('')
  }

  // 漢字の文字数カウント
  const kanjiSplit = kanji.split('')
  const count = kanjiSplit.length

  // ルビ振り表示コンポーネント
  const Rubyfuri = () => {
    if (jukuji) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{jukuji}</rb><rp>（</rp><rt>{ruby_j}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p>
            {"<ruby><rb>"}{jukuji}{"</rb><rp>（</rp><rt>"}{ruby_j}{"</rt><rp>）</rp></ruby>"}
          </p>
        </div>
      )
    } else if (count === 1) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p>
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp></ruby>"}
          </p>
        </div>
      )
    } else if (count === 2) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp><rb>{kanjiSplit[1]}</rb><rp>（</rp><rt>{ruby2}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p>
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>（</rp><rt>"}{ruby2}{"</rt><rp>）</rp></ruby>"}
          </p>
        </div>
      )
    } else if (count === 3) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp><rb>{kanjiSplit[1]}</rb><rp>（</rp><rt>{ruby2}</rt><rp>）</rp><rb>{kanjiSplit[2]}</rb><rp>（</rp><rt>{ruby3}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p>
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>（</rp><rt>"}{ruby2}{"</rt><rp>）</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>（</rp><rt>"}{ruby3}{"</rt><rp>）</rp></ruby>"}
          </p>
        </div>
      )
    } else if (count === 4) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp><rb>{kanjiSplit[1]}</rb><rp>（</rp><rt>{ruby2}</rt><rp>）</rp><rb>{kanjiSplit[2]}</rb><rp>（</rp><rt>{ruby3}</rt><rp>）</rp><rb>{kanjiSplit[3]}</rb><rp>（</rp><rt>{ruby4}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p>
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>（</rp><rt>"}{ruby2}{"</rt><rp>）</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>（</rp><rt>"}{ruby3}{"</rt><rp>）</rp><rb>"}{kanjiSplit[3]}{"</rb><rp>（</rp><rt>"}{ruby4}{"</rt><rp>）</rp></ruby>"}
          </p>
        </div>
      )
    } else if (count === 5) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp><rb>{kanjiSplit[1]}</rb><rp>（</rp><rt>{ruby2}</rt><rp>）</rp><rb>{kanjiSplit[2]}</rb><rp>（</rp><rt>{ruby3}</rt><rp>）</rp><rb>{kanjiSplit[3]}</rb><rp>（</rp><rt>{ruby4}</rt><rp>）</rp><rb>{kanjiSplit[4]}</rb><rp>（</rp><rt>{ruby5}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p>
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>（</rp><rt>"}{ruby2}{"</rt><rp>）</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>（</rp><rt>"}{ruby3}{"</rt><rp>）</rp><rb>"}{kanjiSplit[3]}{"</rb><rp>（</rp><rt>"}{ruby4}{"</rt><rp>）</rp><rb>"}{kanjiSplit[4]}{"</rb><rp>（</rp><rt>"}{ruby5}{"</rt><rp>）</rp></ruby>"}
          </p>
        </div>
      )
    } else if (count === 6) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp><rb>{kanjiSplit[1]}</rb><rp>（</rp><rt>{ruby2}</rt><rp>）</rp><rb>{kanjiSplit[2]}</rb><rp>（</rp><rt>{ruby3}</rt><rp>）</rp><rb>{kanjiSplit[3]}</rb><rp>（</rp><rt>{ruby4}</rt><rp>）</rp><rb>{kanjiSplit[4]}</rb><rp>（</rp><rt>{ruby5}</rt><rp>）</rp><rb>{kanjiSplit[5]}</rb><rp>（</rp><rt>{ruby6}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p>
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>（</rp><rt>"}{ruby2}{"</rt><rp>）</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>（</rp><rt>"}{ruby3}{"</rt><rp>）</rp><rb>"}{kanjiSplit[3]}{"</rb><rp>（</rp><rt>"}{ruby4}{"</rt><rp>）</rp><rb>"}{kanjiSplit[4]}{"</rb><rp>（</rp><rt>"}{ruby5}{"</rt><rp>）</rp><rb>"}{kanjiSplit[5]}{"</rb><rp>（</rp><rt>"}{ruby6}{"</rt><rp>）</rp></ruby>"}
          </p>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

  // 基本的なレンダー部分
  return (
    <div className="App">
      <header className="App-header">
        <h1>入力欄</h1>
        <div className="form">
          <input
            className="kanji"
            value={kanji}
            placeholder="漢字を入力"
            autoFocus="true"
            onChange={(e) => {setKanji(e.target.value)}}
          ></input><br />
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
        <div className="form">
          <input
            className="jukuji"
            value={jukuji}
            placeholder="熟字訓を入力"
            onChange={(e) => {setJukuji(e.target.value)}}
          ></input><br />
          <input
            className="ruby_j"
            value={ruby_j}
            placeholder="ルビ"
            onChange={(e) => {setRuby_j(e.target.value)}}
          ></input>
        </div>
        <div>
          <button onClick={resetBtn}>RESET</button>
        </div>
        <br />
        <h1>ルビ</h1>
        <div className="rubyContent">
          <Rubyfuri />
        </div>
        <br/>
        <h1>最近の履歴</h1>
        <div className="historyContent">
          {logItems}
        </div>
      </header>
    </div>
  );
}

export default App;
