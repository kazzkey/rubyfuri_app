import { useEffect, useState } from 'react';
import firebase from './firebase';
import { Button, Popup } from 'semantic-ui-react'
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
  const [edit, setEdit] = useState(false);

  // 履歴表示の状態監視
  useEffect(() => {
    const unsubscribe = db
      .collection('logs')
      .orderBy('createdAt', 'desc')
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
    if (edit) {
      return (
        <i id={log.logId}
          className="logList_delete"
          onClick={() => deleteItem(log.logId)}
        >
          {log.kanji || log.jukuji}
        </i>
      )
    } else {
      return (
        <i id={log.logId}
          className="logList"
          onClick={() => displayHistory(log)}
        >
          {log.kanji || log.jukuji}
        </i>
      )
    }
  })

  // 履歴を削除する関数
  const deleteItem = async (id) => {
    const result = window.confirm("この履歴を削除してもよろしいですか？");
    if (result) {
      try {
        const db = firebase.firestore();
        await db.collection('logs').doc(id).delete();
      } catch (error) {
        console.error(error);
      };
    } else {
      return;
    };
  };

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

  // リセットボタンの関数
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

  // コピーボタンとその関数
  const copyToClipboard = async () => {
    if (Rubyfuri) {
      const copyData = document.getElementsByClassName("rubyText")[0].innerText
      await navigator.clipboard.writeText(copyData)
    }
  }
  const CopyBtn = () => {
    return (
      <Popup
        trigger={<Button onClick={()=> copyToClipboard()}>COPY</Button>}
        content='コピーしたなり'
        on='click'
        style={{"opacity":0.8}}
        inverted
        position="bottom left"
        hideOnScroll
      />
    )
  }

  // 漢字の文字数カウント
  const kanjiSplit = kanji.split('')
  const count = kanjiSplit.length

  // 履歴削除ボタンのコンポーネント
  const DeleteBtn = () => {
    if (edit) {
      const red = {
        color: "white",
        backgroundColor: "red"
      }
      return (
        <Popup
          trigger={<button
            className="deleteBtn"
            style={red}
            onClick={() => setEdit(false)}>戻る</button>}
          content='不要な履歴をクリックしてください。確認ダイアログをOKすると削除が完了します。'
          open
          style={{"opacity":0.8}}
          inverted
          position="top right"
          hideOnScroll
        />
      )
    } else {
      return (
        <Popup
          trigger={<button
            className="deleteBtn"
            onClick={() => setEdit(true)}>履歴を削除する</button>}
          content='履歴を削除できるモードです。'
          on='hover'
          style={{"opacity":0.8}}
          inverted
          position="top right"
          hideOnScroll
        />
      )
    }
  }

  // ルビ振り表示コンポーネント
  const Rubyfuri = () => {
    if (jukuji) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{jukuji}</rb><rp>（</rp><rt>{ruby_j}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p className="rubyText">
            {"<ruby><rb>"}{jukuji}{"</rb><rp>（</rp><rt>"}{ruby_j}{"</rt><rp>）</rp></ruby>"}
          </p>
          <CopyBtn/>
        </div>
      )
    } else if (count === 1) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p className="rubyText">
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp></ruby>"}
          </p>
          <CopyBtn/>
        </div>
      )
    } else if (count === 2) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp><rb>{kanjiSplit[1]}</rb><rp>（</rp><rt>{ruby2}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p className="rubyText">
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>（</rp><rt>"}{ruby2}{"</rt><rp>）</rp></ruby>"}
          </p>
          <CopyBtn/>
        </div>
      )
    } else if (count === 3) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp><rb>{kanjiSplit[1]}</rb><rp>（</rp><rt>{ruby2}</rt><rp>）</rp><rb>{kanjiSplit[2]}</rb><rp>（</rp><rt>{ruby3}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p className="rubyText">
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>（</rp><rt>"}{ruby2}{"</rt><rp>）</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>（</rp><rt>"}{ruby3}{"</rt><rp>）</rp></ruby>"}
          </p>
          <CopyBtn/>
        </div>
      )
    } else if (count === 4) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp><rb>{kanjiSplit[1]}</rb><rp>（</rp><rt>{ruby2}</rt><rp>）</rp><rb>{kanjiSplit[2]}</rb><rp>（</rp><rt>{ruby3}</rt><rp>）</rp><rb>{kanjiSplit[3]}</rb><rp>（</rp><rt>{ruby4}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p className="rubyText">
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>（</rp><rt>"}{ruby2}{"</rt><rp>）</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>（</rp><rt>"}{ruby3}{"</rt><rp>）</rp><rb>"}{kanjiSplit[3]}{"</rb><rp>（</rp><rt>"}{ruby4}{"</rt><rp>）</rp></ruby>"}
          </p>
          <CopyBtn/>
        </div>
      )
    } else if (count === 5) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp><rb>{kanjiSplit[1]}</rb><rp>（</rp><rt>{ruby2}</rt><rp>）</rp><rb>{kanjiSplit[2]}</rb><rp>（</rp><rt>{ruby3}</rt><rp>）</rp><rb>{kanjiSplit[3]}</rb><rp>（</rp><rt>{ruby4}</rt><rp>）</rp><rb>{kanjiSplit[4]}</rb><rp>（</rp><rt>{ruby5}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p className="rubyText">
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>（</rp><rt>"}{ruby2}{"</rt><rp>）</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>（</rp><rt>"}{ruby3}{"</rt><rp>）</rp><rb>"}{kanjiSplit[3]}{"</rb><rp>（</rp><rt>"}{ruby4}{"</rt><rp>）</rp><rb>"}{kanjiSplit[4]}{"</rb><rp>（</rp><rt>"}{ruby5}{"</rt><rp>）</rp></ruby>"}
          </p>
          <CopyBtn/>
        </div>
      )
    } else if (count === 6) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp><rb>{kanjiSplit[1]}</rb><rp>（</rp><rt>{ruby2}</rt><rp>）</rp><rb>{kanjiSplit[2]}</rb><rp>（</rp><rt>{ruby3}</rt><rp>）</rp><rb>{kanjiSplit[3]}</rb><rp>（</rp><rt>{ruby4}</rt><rp>）</rp><rb>{kanjiSplit[4]}</rb><rp>（</rp><rt>{ruby5}</rt><rp>）</rp><rb>{kanjiSplit[5]}</rb><rp>（</rp><rt>{ruby6}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p className="rubyText">
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>（</rp><rt>"}{ruby2}{"</rt><rp>）</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>（</rp><rt>"}{ruby3}{"</rt><rp>）</rp><rb>"}{kanjiSplit[3]}{"</rb><rp>（</rp><rt>"}{ruby4}{"</rt><rp>）</rp><rb>"}{kanjiSplit[4]}{"</rb><rp>（</rp><rt>"}{ruby5}{"</rt><rp>）</rp><rb>"}{kanjiSplit[5]}{"</rb><rp>（</rp><rt>"}{ruby6}{"</rt><rp>）</rp></ruby>"}
          </p>
          <CopyBtn/>
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
        <h1 className="subtitle">入力欄</h1>
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
          <Popup
            trigger={<button className="resetBtn" onClick={resetBtn}>RESET</button>}
            content='入力欄がリセットされると同時に履歴欄に追加されます。（すでにあるものは追加されません）'
            on='hover'
            style={{"opacity":0.8}}
            inverted
            position="right center"
            hideOnScroll
            wide
          />
        </div>
        <br />
        <h1 className="subtitle">ルビタグ表示欄</h1>
        <div className="rubyContent">
          <Rubyfuri />
        </div>
        <br/>
        <DeleteBtn/>
        <h1 className="subtitle">最近の履歴</h1>
        <div className="historyContent">
          {logItems}
        </div>
        <p style={{"text-align":"right"}}>ver 1.2.2</p>
      </header>
    </div>
  );
}

export default App;
