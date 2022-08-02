import { useEffect, useState } from 'react';
import firebase from './firebase';
import { Button, Popup, Header, Grid, Segment, Icon, Modal, Menu, Input, List} from 'semantic-ui-react'
import './App.css';

const db = firebase.firestore();

const App = () => {
  // ステート郡
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('rubyfuriMode')
  // ルビ振り関連のステート
  const [ruby1, setRuby1] = useState('');
  const [ruby2, setRuby2] = useState('');
  const [ruby3, setRuby3] = useState('');
  const [ruby4, setRuby4] = useState('');
  const [ruby5, setRuby5] = useState('');
  const [ruby6, setRuby6] = useState('');
  const [ruby7, setRuby7] = useState('');
  const [ruby8, setRuby8] = useState('');
  const [kanji, setKanji] = useState('');
  const [jukuji, setJukuji] = useState('');
  const [ruby_j, setRuby_j] = useState('');
  const [logs, setLogs] = useState([]);
  const [watchLogs, setWatchLogs] = useState([]);
  const [edit, setEdit] = useState(false);
  const [search, setSearch] = useState('');
  // 正規表現関連のステート
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [word3, setWord3] = useState('');
  const [word4, setWord4] = useState('');
  const [hiragana1, setHiragana1] = useState('');
  const [hiragana2, setHiragana2] = useState('');
  const [hiragana3, setHiragana3] = useState('');
  const [hiragana4, setHiragana4] = useState('');

  // 更新のお知らせの管理
  useEffect(() => {
    window.addEventListener('mouseover', () => {
      if (localStorage.getItem('disp_popup') !== 'n5') {
        setOpen(true)
        localStorage.setItem('disp_popup', 'n5')
      };
    });
  },[])
  // 履歴表示の状態監視
  useEffect(() => {
    if(search) {
      const searchLogs = db
        .collection('logs')
        .where("yomigana", ">=", search)
        .where("yomigana", "<", search + '\uf8ff')
        .limit(100)
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
        searchLogs();
      };
    } else if (!search) {
      db
        .collection('logs')
        .onSnapshot((querysnapshot) => {
          const watchlogs = querysnapshot.docs.map(doc => {
            return ({
              logId: doc.id,
              ...doc.data()
            });
          });
        setWatchLogs(watchlogs);
      });
      const unsubscribe = db
        .collection('logs')
        .orderBy('createdAt', 'desc')
        .limit(30)
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
    }
  }, [search]);

  // 更新メッセージ
  const updateMessage = 
  `いつもご利用ありがとうございます！　アップデートがあります！


  ①　ルビの履歴検索機能がより便利になりました！
  　　・頭文字だけでなく、全文字検索できるようになりました
  　　・熟字訓も検索できるようになりました

  ②　その他、軽微な変更を行っています。`

  // 履歴アイテム
  const logItems = logs.map(log => {
    if (edit) {
      return (
        <List.Item id={log.logId}
        className="logList_delete"
        onClick={() => deleteItem(log.logId)}
        >
          {log.kanji || log.jukuji}
        </List.Item>
      )
    } else if (search) {
      return (
        <List.Item id={log.logId}
          className="logList"
          onClick={() => displayHistory(log)}
        >
           {log.kanji || log.jukuji}
        </List.Item>
      )
    } else {
      return (
        <List.Item id={log.logId}
          className="logList"
          onClick={() => displayHistory(log)}
        >
          {log.kanji || log.jukuji}
        </List.Item>
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
      setRuby7(id.ruby7)
      setRuby8(id.ruby8)
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
      setRuby7('')
      setRuby8('')
    }
  }

  // 入力された漢字・熟字訓を保存する関数
  const HistoryLog = async () => {
    if (kanji && count < 8) {
      await db.collection('logs').add({
        kanji: kanji,
        ruby1: ruby1,
        ruby2: ruby2,
        ruby3: ruby3,
        ruby4: ruby4,
        ruby5: ruby5,
        ruby6: ruby6,
        ruby7: ruby7,
        ruby8: ruby8,
        count: 1,
        yomigana: ruby1+ruby2+ruby3+ruby4+ruby5+ruby6+ruby7+ruby8,
        createdAt: new Date(),
      })
    } else if (jukuji) {
      await db.collection('logs').add({
        jukuji: jukuji,
        ruby_j: ruby_j,
        count: 1,
        yomigana: ruby_j,
        createdAt: new Date(),
      })
    }
  }

  const addCount = async (id) => {
    const increment = (await db.collection("logs").doc(id).get()).data().count + 1
    db.collection('logs').doc(id)
    .set({
      count: increment,
      createdAt: new Date()
    }, {merge: true})
  }

  // リセットボタンの関数
  const resetBtn = () => {
    const existence = (watchLogs.some(log => log.kanji === kanji && log.ruby1 === ruby1)) || (watchLogs.some(log => log.jukuji === jukuji))
    if (!existence) {
      HistoryLog()
    } else {
      if (kanji) {
        db.collection('logs')
        .where("kanji", "==", kanji)
        .where("ruby1", "==", ruby1)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
              console.log('結果は空です')
          } else {
            querySnapshot.forEach(doc => {
              addCount(doc.id)
            })
          }
        })
      } else if (jukuji) {
        db.collection('logs')
        .where("jukuji", "==", jukuji)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
              console.log('結果は空です')
          } else {
            querySnapshot.forEach(doc => {
              addCount(doc.id)
            })
          }
        })
      }
    }
    setKanji('')
    setRuby1('')
    setRuby2('')
    setRuby3('')
    setRuby4('')
    setRuby5('')
    setRuby6('')
    setRuby7('')
    setRuby8('')
    setJukuji('')
    setRuby_j('')
    setSearch('')
    setWatchLogs([])
  }

  const RegresetBtn = () => {
    setWord1('')
    setWord2('')
    setWord3('')
    setWord4('')
    setHiragana1('')
    setHiragana2('')
    setHiragana3('')
    setHiragana4('')
  }

  // コピーボタンとその関数
  const copyToClipboard = async () => {
    if (activeItem === 'rubyfuriMode') {
      const copyData = document.getElementsByClassName("rubyText")[0].innerText
      await navigator.clipboard.writeText(copyData)
    } else if (activeItem === 'regexMode') {
      const copyData = document.getElementsByClassName("regText")[0].innerText
      await navigator.clipboard.writeText(copyData)
    }
  }
  const CopyBtn = () => {
    let n = Math.random()
    let message = "コピーしたよ！"
    if (n > 0.95) {
      message = "コピーしたよ、いつもおつかれさま"
    } else if (n > 0.85) {
      message = "コピーしたってばよ！"
    } else if (n > 0.75) {
      message = "コピーしたにゃ"
    } else if (n > 0.5) {
      message = "コピーしたなり"
    }
    return (
      <Popup
        trigger={<Button onClick={()=> copyToClipboard()}><Icon name='copy outline'/>COPY</Button>}
        content={message}
        on='click'
        style={{"opacity":0.8}}
        inverted
        position="bottom left"
        hideOnScroll
        wide
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
        backgroundColor: "#d63333",
        border: "2px solid white"
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
    } else if (count === 7) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp><rb>{kanjiSplit[1]}</rb><rp>（</rp><rt>{ruby2}</rt><rp>）</rp><rb>{kanjiSplit[2]}</rb><rp>（</rp><rt>{ruby3}</rt><rp>）</rp><rb>{kanjiSplit[3]}</rb><rp>（</rp><rt>{ruby4}</rt><rp>）</rp><rb>{kanjiSplit[4]}</rb><rp>（</rp><rt>{ruby5}</rt><rp>）</rp><rb>{kanjiSplit[5]}</rb><rp>（</rp><rt>{ruby6}</rt><rp>）</rp><rb>{kanjiSplit[6]}</rb><rp>（</rp><rt>{ruby7}</rt><rp>）</rp></ruby>
          <br />
          <h3>タグ</h3>
          <p className="rubyText">
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>（</rp><rt>"}{ruby2}{"</rt><rp>）</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>（</rp><rt>"}{ruby3}{"</rt><rp>）</rp><rb>"}{kanjiSplit[3]}{"</rb><rp>（</rp><rt>"}{ruby4}{"</rt><rp>）</rp><rb>"}{kanjiSplit[4]}{"</rb><rp>（</rp><rt>"}{ruby5}{"</rt><rp>）</rp><rb>"}{kanjiSplit[5]}{"</rb><rp>（</rp><rt>"}{ruby6}{"</rt><rp>）</rp><rb>"}{kanjiSplit[6]}{"</rb><rp>（</rp><rt>"}{ruby7}{"</rt><rp>）</rp></ruby>"}
          </p>
          <CopyBtn/>
        </div>
      )
    } else if (count === 8) {
      return (
        <div>
          <h3>イメージ</h3>
          <ruby><rb>{kanjiSplit[0]}</rb><rp>（</rp><rt>{ruby1}</rt><rp>）</rp><rb>{kanjiSplit[1]}</rb><rp>（</rp><rt>{ruby2}</rt><rp>）</rp><rb>{kanjiSplit[2]}</rb><rp>（</rp><rt>{ruby3}</rt><rp>）</rp><rb>{kanjiSplit[3]}</rb><rp>（</rp><rt>{ruby4}</rt><rp>）</rp><rb>{kanjiSplit[4]}</rb><rp>（</rp><rt>{ruby5}</rt><rp>）</rp><rb>{kanjiSplit[5]}</rb><rp>（</rp><rt>{ruby6}</rt><rp>）</rp><rb>{kanjiSplit[6]}</rb><rp>（</rp><rt>{ruby7}</rt><rp>）</rp><rb>{kanjiSplit[7]}</rb><rp>（</rp><rt>{ruby8}</rt><rp>）</rp></ruby>
          <h3>タグ</h3>
          <p className="rubyText">
            {"<ruby><rb>"}{kanjiSplit[0]}{"</rb><rp>（</rp><rt>"}{ruby1}{"</rt><rp>）</rp><rb>"}{kanjiSplit[1]}{"</rb><rp>（</rp><rt>"}{ruby2}{"</rt><rp>）</rp><rb>"}{kanjiSplit[2]}{"</rb><rp>（</rp><rt>"}{ruby3}{"</rt><rp>）</rp><rb>"}{kanjiSplit[3]}{"</rb><rp>（</rp><rt>"}{ruby4}{"</rt><rp>）</rp><rb>"}{kanjiSplit[4]}{"</rb><rp>（</rp><rt>"}{ruby5}{"</rt><rp>）</rp><rb>"}{kanjiSplit[5]}{"</rb><rp>（</rp><rt>"}{ruby6}{"</rt><rp>）</rp><rb>"}{kanjiSplit[6]}{"</rb><rp>（</rp><rt>"}{ruby7}{"</rt><rp>）</rp><rb>"}{kanjiSplit[7]}{"</rb><rp>（</rp><rt>"}{ruby8}{"</rt><rp>）</rp></ruby>"}
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

  // 正規表現の表示コンポーネント
  const Regexfuri = () => {
    let reg1 = ""
    let reg2 = ""
    let reg3 = ""
    let reg4 = ""

    if (word1 && hiragana1) {
      reg1 = `(${word1}|${hiragana1})`
    } else if (word1 && !hiragana1){
      reg1 = `${word1}`
    }
    if (word2 && hiragana2) {
      reg2 = `(${word2}|${hiragana2})`
    } else if (word2 && !hiragana2){
      reg2 = `${word2}`
    }
    if (word3 && hiragana3) {
      reg3 = `(${word3}|${hiragana3})`
    } else if (word3 && !hiragana3){
      reg3 = `${word3}`
    } 
    if (word4 && hiragana4) {
      reg4 = `(${word4}|${hiragana4})`
    } else if (word4 && !hiragana4){
      reg4 = `${word4}`
    }

    if  (reg1&&reg2&&reg3&&reg4) {
      return (
        <div>
          <h3 className="regText">{"^"}{reg1}{reg2}{reg3}{reg4}{"$"}</h3>
          <CopyBtn/>
        </div>
      )
    } else if (reg1&&reg2&&reg3) {
      return (
        <div>
          <h3 className="regText">{"^"}{reg1}{reg2}{reg3}{"$"}</h3>
          <CopyBtn/>
        </div>
      )
    } else if (reg1&&reg2) {
      return (
        <div>
          <h3 className="regText">{"^"}{reg1}{reg2}{"$"}</h3>
          <CopyBtn/>
        </div>
      ) 
    } else if (reg1) {
      return (
        <div>
          <h3 className="regText">{"^"}{reg1}{"$"}</h3>
          <CopyBtn/>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

  // お知らせモーダル
  const MessageModal = () => {
    return (
      <Modal
        closeOnDimmerClick={false}
        basic
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
        >
        <Header icon>
          <Icon name='info circle' />
          更新のお知らせ
        </Header>
        <Modal.Content>
          <div className="messageModal">{updateMessage}</div>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' inverted onClick={() => setOpen(false)}>
            <Icon name='checkmark' /> 了解
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  // ヘッダー
  const Head = () => {
    return (
      <div className="title">
        <Menu inverted secondary>
        <Menu.Header as='h1'>Ruby furifuri 2</Menu.Header>
        </Menu>
        <Menu inverted secondary>
          <Menu.Item
            name='ルビ'
            active={activeItem === 'rubyfuriMode'}
            onClick={()=> setActiveItem('rubyfuriMode')}
          />
          <Menu.Item
            name='正規表現'
            active={activeItem === 'regexMode'}
            onClick={()=> setActiveItem('regexMode')}
          />
          <Menu.Item position='right'>ver 2.3.0</Menu.Item>
        </Menu>
      </div>
    )
  }

  // 基本的なレンダー部分
  if (activeItem === 'rubyfuriMode') {
    return (
      <div className="App">
        <MessageModal/>
        <Head/>

        <div className="contents">
          <Segment>
            <Header as='h2' color='grey'>
              <Icon name='rocket'/>
              <Header.Content>入力欄</Header.Content>
            </Header>
            <Grid columns={2} stackable divided textAlign='center'>
              <Grid.Column>
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
                  <input
                    className="ruby"
                    value={ruby7}
                    placeholder="ルビ⑦"
                    onChange={(e) => {setRuby7(e.target.value)}}
                  ></input>
                  <input
                    className="ruby"
                    value={ruby8}
                    placeholder="ルビ⑧"
                    onChange={(e) => {setRuby8(e.target.value)}}
                  ></input>
                </div>
              </Grid.Column>
              <Grid.Column>
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
              </Grid.Column>
            </Grid>
            <div><Popup
                trigger={<button className="resetBtn" onClick={resetBtn}>RESET</button>}
                content='入力欄がリセットされ、履歴に追加されます。'
                on='hover'
                style={{"opacity":0.8}}
                inverted
                position="bottom right"
                hideOnScroll
                wide
              /></div>
          </Segment>
          
          <Segment>
            <Header as='h2'color='grey'>
              <Icon name='code'/>
              <Header.Content>ルビタグ表示欄</Header.Content>
            </Header>
            <Grid>
              <Grid.Column>
                <div className="rubyContent">
                  <Rubyfuri />
                </div>
              </Grid.Column>
            </Grid>
          </Segment>
          
          <Segment>
            <Header as='h2'color='grey'>
              <DeleteBtn/>
              <Icon name='history'/>
              <Header.Content>最近の履歴</Header.Content>
            </Header>
            <Popup
              trigger={
                <Input transparent icon>
                  <input
                    placeholder='検索できちゃうよ'
                    value={search}
                    onChange={(e) => {setSearch(e.target.value)}}
                  />
                  <Icon link name='remove' onClick={() => setSearch("")} />
                </Input>
              }
              content='検索したい言葉のルビを入力してください'
              on='focus'
              style={{"opacity":0.8}}
              inverted
              position="right center"
              hideOnScroll
              wide
            />
            <Grid>
              <Grid.Column className="historyContent">
              <List celled horizontal size="huge">
                {logItems}
              </List>
              </Grid.Column>
            </Grid>
          </Segment>
        </div>
      </div>
      
    )
  } else if (activeItem === 'regexMode') {
    return (
      <div className="App">
        <MessageModal/>        
        <Head/>
        
        <div className="contents">
          <Segment>
            <Header as='h2' color='grey'>
              <Icon name='rocket'/>
              <Header.Content>入力欄</Header.Content>
            </Header>
            <Grid columns={4} divided>
              <Grid.Row>
                <Grid.Column>
                  <h3>①</h3>
                  <input
                    className="regexInput"
                    value={word1}
                    placeholder="(例) 村"
                    autoFocus="true"
                    onChange={(e) => {setWord1(e.target.value)}}
                  ></input>
                  <input
                    className="regexInput"
                    value={hiragana1}
                    placeholder="(例) むら"
                    onChange={(e) => {setHiragana1(e.target.value)}}
                  ></input>
                </Grid.Column>
                <Grid.Column>
                  <h3>②</h3>
                  <input
                    className="regexInput"
                    value={word2}
                    placeholder="(例) 田"
                    onChange={(e) => {setWord2(e.target.value)}}
                  ></input>
                  <input
                    className="regexInput"
                    value={hiragana2}
                    placeholder="(例) た"
                    onChange={(e) => {setHiragana2(e.target.value)}}
                  ></input>
                </Grid.Column>
                <Grid.Column>
                  <h3>③</h3>
                  <input
                    className="regexInput"
                    value={word3}
                    placeholder="(例) さん"
                    onChange={(e) => {setWord3(e.target.value)}}
                  ></input>
                  <input
                    className="regexInput"
                    value={hiragana3}
                    placeholder=""
                    onChange={(e) => {setHiragana3(e.target.value)}}
                  ></input>
                </Grid.Column>
                <Grid.Column>
                  <h3>④</h3>
                  <input
                    className="regexInput"
                    value={word4}
                    placeholder=""
                    onChange={(e) => {setWord4(e.target.value)}}
                  ></input>
                  <input
                    className="regexInput"
                    value={hiragana4}
                    placeholder=""
                    onChange={(e) => {setHiragana4(e.target.value)}}
                  ></input>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <div><Popup
                trigger={<button className="resetBtn" onClick={RegresetBtn}>RESET</button>}
                content='入力欄がリセットされます。（履歴追加は未対応）'
                on='hover'
                style={{"opacity":0.8}}
                inverted
                position="bottom right"
                hideOnScroll
                wide
              /></div>
          </Segment>

          <Segment>
            <Header as='h2'color='grey'>
              <Icon name='code'/>
              <Header.Content>正規表現表示欄</Header.Content>
            </Header>
            <br/>
            <Grid>
              <Grid.Column>
                <div className="rubyContent">
                  <Regexfuri/>
                </div>
              </Grid.Column>
            </Grid>
          </Segment>

          <Segment>
            <Header as='h2'color='grey'>
              <Icon name='key'/>
              <Header.Content>使い方</Header.Content>
            </Header>
            <Grid>
              <Grid.Column>
                <div style={{"padding": "2%"}}>
                （例）「村田さん」の正規表現を作りたい場合<br/><br/>
                ① の上部に「村」、下部に「むら」のように入力していきます。<br/>「さん」のように正規表現不要なものは、上部にだけ入力すればOKです。
                </div>
              </Grid.Column>
            </Grid>
          </Segment>
        </div>
      </div>
    )
  }
}

export default App;
