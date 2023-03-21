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
          'content': '《》が1つも使われていない文章が入力された場合はその文章を回答せず、「エラー：ルビを作成したい場合は、「漢字《ルビ》」の形で入力してください。」と出力してください。'
        },
        {
          'role': 'user',
          'content':
          `【ルール】に記載された事項を遵守して、【変換対象】をhtmlのルビタグに変換してください。
          【ルール】
          1. 【変換対象】の中の、漢字《ひらがな》を変換します。
          2. 《》の中は左隣の漢字のルビです。
          3. 2字以上の漢字は、モノルビタグにしてください。4.と5.に例を示します。
          4. 漢字《かんじ》→<ruby><rb>漢</rb><rp>（</rp><rt>かん</rt><rp>）</rp><rb>字</rb><rp>（</rp><rt>じ</rt><rp>）</rp></ruby>
          5. 下線部《かせんぶ》→<ruby><rb>下</rb><rp>（</rp><rt>か</rt><rp>）</rp><rb>線</rb><rp>（</rp><rt>せん</rt><rp>）</rp><rb>部</rb><rp>（</rp><rt>ぶ</rt><rp>）</rp></ruby>
          6. 漢字が熟字訓の場合は、グループルビタグにしてください。7.と8.に例を示します。
          7. 今日《きょう》→<ruby><rb>今日</rb><rp>（</rp><rt>きょう</rt><rp>）</rp></ruby>
          8. 明日《あした》→<ruby><rb>明日</rb><rp>（</rp><rt>あした</rt><rp>）</rp></ruby>
          9. 訓読みの漢字は、送り仮名をルビタグの外に出してください。10.に例を示します。
          10. 書《か》く→<ruby><rb>書</rb><rp>（</rp><rt>か</rt><rp>）</rp></ruby>く 
          【変換対象】
          ${message}`,
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