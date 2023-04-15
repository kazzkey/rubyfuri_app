import axios from 'axios';
const API_URL = 'https://api.openai.com/v1/';
const MODEL = 'gpt-3.5-turbo';
const API_KEY= process.env.React_APP_GPT_API_KEY;

export const chat = async ( message ) => {
  try {
    const response = await axios.post( `${ API_URL }chat/completions`, {
      // モデル ID の指定
      model: MODEL,
      // 質問内容
      messages: [
        {
          'role': 'system',
          'content': "You are a specialist who converts a piece of input text into html ruby tags. The final output is a text after conversion."
        },
        {
          'role': 'system',
          'content': 
          `# You know the following
          - Input text is written in Japanese.
          - Y is "ひらがな" or "カタカナ".
          - X is "漢字" that are read as Y.
          - If you find "X《Y》" in text, you can convert them into a ruby tag.
          - You do not edit any part except X《Y》.
          - If X is "熟語"(=two or more "漢字"), You can convert this X《Y》 to a mono ruby tag.

          # Here are examples.

          [Example1]
          Before conversion:
          読《よ》む
          After conversion
          <ruby><rb>読</rb><rp>（</rp><rt>よ</rt><rp>）</rp></ruby>む

          [Example2]
          Before conversion:
          日本《にほん》
          After conversion
          <ruby><rb>日</rb><rp>（</rp><rt>に</rt><rp>）</rp><rb>本</rb><rp>（</rp><rt>ほん</rt><rp>）</rp></ruby>

          [Example3]
          Before conversion:
          執筆《しっぴつ》
          After conversion:
          <ruby><rb>執</rb><rp>（</rp><rt>しっ</rt><rp>）</rp><rb>筆</rb><rp>（</rp><rt>ぴつ</rt><rp>）</rp></ruby>

          [Example4]
          Before conversion:
          一冊《いっさつ》
          After conversion:
          <ruby><rb>一</rb><rp>（</rp><rt>いっ</rt><rp>）</rp><rb>冊</rb><rp>（</rp><rt>さつ</rt><rp>）</rp></ruby>

          [Example5]
          Before conversion:
          学校《がっこう》
          After conversion:
          <ruby><rb>学</rb><rp>（</rp><rt>がっ</rt><rp>）</rp><rb>校</rb><rp>（</rp><rt>こう</rt><rp>）</rp></ruby>

          [Example6]
          Before conversion:
          平安京《へいあんきょう》
          After conversion:
          <ruby><rb>平</rb><rp>（</rp><rt>へい</rt><rp>）</rp><rb>安</rb><rp>（</rp><rt>あん</rt><rp>）</rp><rb>京</rb><rp>（</rp><rt>きょう</rt><rp>）</rp></ruby>

          [Example7]
          Before conversion:
          織田信長《おだのぶなが》
          After conversion:
          <ruby><rb>織</rb><rp>（</rp><rt>お</rt><rp>）</rp><rb>田</rb><rp>（</rp><rt>だ</rt><rp>）</rp><rb>信</rb><rp>（</rp><rt>のぶ</rt><rp>）</rp><rb>長</rb><rp>（</rp><rt>なが</rt><rp>）</rp></ruby>

          [Example8]
          Before conversion:
          中華人民共和国《ちゅうかじんみんきょうわこく》
          After conversion:
          <ruby><rb>中</rb><rp>（</rp><rt>ちゅう</rt><rp>）</rp><rb>華</rb><rp>（</rp><rt>か</rt><rp>）</rp><rb>人</rb><rp>（</rp><rt>じん</rt><rp>）</rp><rb>民</rb><rp>（</rp><rt>みん</rt><rp>）</rp><rb>共</rb><rp>（</rp><rt>きょう</rt><rp>）</rp><rb>和</rb><rp>（</rp><rt>わ</rt><rp>）</rp><rb>国</rb><rp>（</rp><rt>こく</rt><rp>）</rp></ruby>

          [Example9]
          Before conversion:
          書《か》き直《なお》す
          After conversion:
          <ruby><rb>書</rb><rp>（</rp><rt>か</rt><rp>）</rp></ruby>き<ruby><rb>直</rb><rp>（</rp><rt>なお</rt><rp>）</rp></ruby>す`
        },
        {
          'role': 'user',
          'content': "友人《ゆうじん》と一緒《いっしょ》に、図書館《としょかん》へ行った。\n「私《わたし》は私、何者でもないわ。」とナンシー教授は言《い》った。",
        },
        {
          'role': 'assistant',
          'content': "<ruby><rb>友</rb><rp>（</rp><rt>ゆう</rt><rp>）</rp><rb>人</rb><rp>（</rp><rt>じん</rt><rp>）</rp></ruby>と<ruby><rb>一</rb><rp>（</rp><rt>いっ</rt><rp>）</rp><rb>緒</rb><rp>（</rp><rt>しょ</rt><rp>）</rp></ruby>に<ruby><rb>図</rb><rp>（</rp><rt>と</rt><rp>）</rp><rb>書</rb><rp>（</rp><rt>しょ</rt><rp>）</rp><rb>館</rb><rp>（</rp><rt>かん</rt><rp>）</rp></ruby>へ<ruby><rb>行</rb><rp>（</rp><rt>い</rt><rp>）</rp></ruby>った。\n「<ruby><rb>私</rb><rp>（</rp><rt>わたし</rt><rp>）</rp></ruby>は私、何者でもないわ。」とナンシー教授は<ruby><rb>言</rb><rp>（</rp><rt>い</rt><rp>）</rp></ruby>った。",
        },
        {
          'role': 'user',
          'content': '僕は公園へ行った。そこで彼《かれ》に話しかけた。',
        },
        {
          'role': 'assistant',
          'content': '僕は公園へ行った。そこで<ruby><rb>彼</rb><rp>（</rp><rt>かれ</rt><rp>）</rp></ruby>に話しかけた。',
        },
        {
          'role': 'user',
          'content': message,
        }
      ],
    }, {
      // 送信する HTTP ヘッダー(認証情報)
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ API_KEY }`
      }
    });
    // 回答の取得
    return response.data.choices[0].message.content;
 
  } catch ( error ) {
    console.error( error );
    return null;
  }
}