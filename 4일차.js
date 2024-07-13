const ScriptName = 'RELAUNCH : RPG';

let userId = 1938103211

const j = '!';
const s = ':';
const FS = FileStream;
const Path = '/sdcard/RPG/', UserListPath = '/sdcard/RPG/UserList.txt', RPGWood_Ores = '/sdcard/Pictures/RPGWood_Ores.json';
const Item_DB = '/sdcard/Pictures/RPGItems.json';
const progress = {};
let CreateArrayFile = (path) => {
    if(!FS.read(path)) FS.write(path, JSON.stringify([], null, 4));
}

CreateArrayFile(UserListPath);

let NameLists = JSON.parse(FS.read(UserListPath));
let Wood_Ores = JSON.parse(FS.read(RPGWood_Ores));
let Items = JSON.parse(FS.read(Item_DB));

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, a, b, c, d){
    
    const reply = (message) => {
        replier.reply(message);
    };


    let p = user(userId);

    if(msg == '!초'){
        p.isTuting = false;
        save(userId, p);
    }

    if(msg == j + '가입'){
        reply('---형식으로 입력');
        return;
    }

    if(msg.startsWith(j + '가입 ')){
        
        if(p){
            reply('이미 가입');
            return;
        }

        let inputName = msg.slice(4);

        if(!inputName){
            reply('공백 X');
            return;
        }

        /** 금지 글자 추가 가능 */
        let RegExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi;
        if(RegExp.test(inputName,)){
            reply('특수문자 불가');
            return;
        }
 
        if(inputName.length > 10){
            reply('10글자 이상 X');
            return;
        }
        if(inputName.length < 3){
            reply('3글자 이상');
            return;
        }

        if(NameLists.includes(inputName)){
            reply('중복 X');
            return;
        }

        let displayId = generateId(5);

        Data = {

            JoinName : sender,
            UserId : userId,
            displayName : inputName,
            Code : displayId,

            Tut : false,
            isTuting : false,
            TutAmt : 0,

            Gold : 10000,

            Dogam : {
                LvL : 1,
                Bookmark : []
            },

            //{Name : '', Rank : '', Amount : ''} 형식
            Inventory : [{Name : '철', Rank : '일반', Amount : 10},
                {Name : '닉변권', Rank : '무한', Amount : 1}],

            Mine : {
                isMining : false,
                MineAmt : 0,
                Pixaxe : [
                    {
                        Name : '나무 곡괭이', Rank : '일반', Amount : 1, Luck : [0,0,0,0,0,0,0,0,0,0,0], isPicked : true, Time : 30
                    }
                ],
                //레벨 제한 10
                MineLvL : 1
            },

            Logg : {
            isLogging : false,
            LogAmt : 0
            }
        };

        NameLists.unshift(inputName);
        FS.write(UserListPath, JSON.stringify(NameLists, null, 4));
        FS.write(Path + userId + '.txt', JSON.stringify(Data, null, 4));
        reply('18pt, 가입됨, 튜토리얼 하셈');
        return;

    }

    if(!p && msg.startsWith(j)){
        reply('가입을 먼저해');
        return;
    }

    if(msg == j + '튜토리얼'){
        if(p.isTuting){
            reply('이미 하는중');
            return;
        }
        p.isTuting = true;
        if(p.TutAmt > 0){
            reply('[한스] : 오 자네 다시 왔구만! 설명이 또 다시 필요한가보군. 걱정하지 말게나, 내가 천천히 알려줄테니 말이야.');
        } else {
            reply('[한스] : 오 신규 유저로군, 게임이 처음이라고? 하하 걱정하지 말게나, 내가 천천히 알려줄테니 말이야.');
            reply('※대답 선택은 해당 대답의 번호를 입력하시면 됩니다.');
            progress[userId] = '1';
        }
        save(userId, p);
    }



    //튜토리얼 진행
    switch(progress[userId]){

        case '1' : {
            progress[userId] = '2';
            reply('[한스] : 이게임의 목적은 세계의 진실을 알아내는 것이라네. 그게 뭐냐고? 허허, 나도 잘은 모른다네. 그건 오직 『개발자』님의 영역이니 말이야.\n\n1) 그럼 어떻게 하는지 알려줘.\n2) 개발자가 누구야?');
        } break;

        case '2' : {
            if(msg == '1'){
                progress[userId] = '2-1';
                reply('[한스] : 허허 알겠다네. 우선 이 세계의 진실을 알기 위해선 강해지는것이 먼저라네. 한번 "!광질"이라고 입력해보지 않겠나?');
                reply('※"!광질"을 입력하세요');
            }
            if(msg == '2'){
                progress[userId] = '2-2';
                reply('[한스] : 나도 잘은 모르지만 우리를 창조해낸 위대한 존재라네. 흠흠, 그런건 나중에 다시 알려줄테니 우선 어떻게 하는지 알려주겠다네\n\n1) 알겠어');
            }
        } break;

        case '2-1' : {
            if(msg == '!광질'){
                progress[userId] = '3';
                reply('사용자님이 [일반]돌을(를) 채굴하셨습니다.');
                reply('[한스] : 이렇게 광질을 하면 랜덤으로 광물이 나온다네. 이렇게 캐고 나온 광물은 팔거나, 재련하거나, 다른 NPC들에게 주거나, 아니면 유저들과 교환이 가능하다네. 흠흠 물론 내 능력을 이용해 채굴 시간을 없앴으니 실전에서는 30초 정도가 소요될걸세.');
                reply('[한스] : 광물을 캤으니 가방을 확인해보게나. "!가방"이라 입력하면 될걸세');
                reply('※"!가방"을 입력하세요');
            }
        } break;

        case '2-2' : {
            if(msg == '1'){
                progress[userId] = '2-1';
                reply('[한스] : 우선 이 세계의 진실을 알기 위해선 강해지는것이 먼저라네. 한번 "!광질"이라고 입력해보지 않겠나?');
                reply('※"!광질"을 입력하세요');
            }
        } break;

        case '3' : {
            if(msg == '!가방'){
                progress[userId] = '4';
                reply('사용자님의 가방' + '\u200b'.repeat(500) + '\n--------------------------------------\n\n[일반] 돌 x 1');
                reply('[한스] : 자 그럼 이렇게 자네가 캔 광물과 나무를 한번에 볼 수 있다네. 그럼 돌을 한번 팔아보게나. "!판매 1"이라고 입력해보게.');
                reply('※"!판매 1"을 입력하세요');
            }
        } break;

        case '4' : {
            if(msg == '!판매 1'){
                progress[userId] = '5';
                reply('[한스] : 사용자님이 [일반] 돌을 판매하셨습니다.\n[200$ 획득]');
                reply('[한스] : 허허 대단하구만, 앞으로 그렇게 "!판매 "를 입력한 후 판매하고 싶은 아이템 번호를 적으면 될걸세. 이제 미션에 대해 알려주겠다네.\n\n1) 알겠어');
            }
        } break;

        case '5' : {
            if(msg == '1'){
                progress[userId] = '6';
                reply('[한스] : 미션을 진행할 경우 보상을 얻고, NPC들과 친해질 수 있을 것이라네. 정말 드물지만 가끔 희귀 칭호도 발견할 수 있으니 열심히 해보게나.\n\n1) 칭호는 뭐야?');
            }
        } break;

        case '6' : {
            if(msg == '1'){
                progress[userId] = '7';
                reply('[한스] : 이 게임에는 어떠한 행동을 해야만 얻을 수 있는 희귀 칭호들이 많다네. 도감을 통해서도 알 수 있겠지만, 칭호에는 4가지 등급이 있다네. 각각 [일반], [특이], [전설], [영원] 이지. 특히 [전설] 칭호부터는 칭호마다 고유 능력이 있으니 열심히 모아보게나.\n\n1) 도감은 뭐야?');
            }
        } break;

        case '7' : {
            if(msg == '1'){
                progress[userId] = '8';
                reply('[한스] : 도감은 어느 정신나감 작자의 손에서 태어난 시스템이라네. 거기엔 이 게임의 모든 아이템과 칭호와 관련된 정보들이 있다네. "!도감 "을 입력한 후 아이템 이름이나 키워드를 입력하여 그 정보를 열람할 수 있으나, 지금은 하지 말게나. 시간이 없으니 말일세.\n\n1) 알겠어');
            }
        } break;

        case '8' : {
            if(msg == '1'){
                progress[userId] = '9';
                reply('[한스] : 이제 스토리에 대해 설명해주겠네. 스토리는 이 세계의 진실을 알 수 있는 열쇠라네. 스토리를 모두 봐야만 이 세계의 진실을 알 수 있다네. 하지만 스토리를 보기 위해서는 돈이 필요하다네. 또한 스토리를 들려주는 각각의 NPC가 원하는 바를 이루어 주어야 한다네.\n\n1) 그렇군');
            }
        } break;

        case '9' : {
            if(msg == '1'){
                progress[userId] = '10';
                reply('[한스] : 마지막일세, 일반 곡괭이와 도끼로는 높은 등급의 광물 혹은 나무를 얻기는 어려울걸세. 하지만 곡괭이와 도끼를 강화해 그 확률을 높이는 방법이 있다네.\n\n1) 확률이 어떻게 되는데?\n2) 알겠어');
            }
        } break;

        case '10' : {
            if(msg == '1'){
                progress[userId] = '10-1';
                reply('[한스] : 우선 아이템의 등급부터 알아야 한다네. 알려진 바로는 9개가 전부일세. 각각 [일반], [희귀], [초희귀], [영웅], [전설], [초월], [영원], [불멸], [무한]이 있다네. 기본 곡괭이로는 [일반] - 40%, [희귀] - 32%, [초희귀] - 18%, [영웅] - 4%, [전설] - 3%, [초월] - 2%, [영원] - 0.9%, [불멸] - 0.08%, [무한] - 0.019% 라네.\n\n1) 더 높은 등급은 없어?');
            }
            if(msg == '2'){
                progress[userId] = '10-2';
                reply('[한스] : 곡괭이와 도끼 강화는 강화재료와 돈을 소모한다네. 강화재료는 광물이나 나무를 재련소에서 재련하면 될걸세.\n\n1) 재련소는 뭐야?');
            }
        } break;

        case '10-1' : {
            if(msg == '1'){
                progress[userId] = '10-1-1';
                reply('[한스]: 그건 나도 모른다네. 하지만 자네가 노력한다면 찾아낼지도 모르겠군. 노력해보게나.\n\n1) 알겠어');
            }
        } break;

        case '10-1-1' : {
            if(msg == '1'){
                progress[userId] = '10-2';
                reply('[한스] : 곡괭이와 도끼 강화는 강화재료와 돈을 소모한다네. 강화재료는 광물이나 나무를 재련소에서 재련하면 될걸세.\n\n1) 재련소는 뭐야?');
            }
        } break;

        case '10-2' : {
            if(msg == '1'){
                progress[userId] = '11';
                reply('[한스] : 허허, 그건 다른 이들에게 묻거나 "!도움말"을 입력해 답을 찾아보게나. 그것이 자네의 길잡이가 되어줄 것이라네.\n\n1) 알겠어');
            }
        } break;

        case '11' : {
            if(msg == '1'){
                progress[userId] = '12';
                reply('[한스] : 자 이제 이걸 받게나.');
                reply('사용자님이 아이템을 획득하셨습니다.\n\n[일반] 나무 곡괭이 x 1\n[10000$]');
                reply('[한스] : 이제 이 아이템을 들고 모험을 시작해보게나. 행운을 빈다네.\n\n1) 다시 설명해줘\n2) 종료');
                p.TutAmt += 1;
                p.Tut = true;

                save(userId, p);
            }
        } break;

        case '12' : {
            if(msg == '1'){
                progress[userId] = '2';
                if(p.TutAmt == 1){
                    reply('[한스] : 자네 안듣고 뭐했나? 이번엔 제대로 듣게나.');
                    reply('[한스] : 다시 설명하겠네. 이게임의 목적은 세계의 진실을 알아내는 것이라네. 그게 뭐냐고? 허허, 나도 잘은 모른다네. 그건 오직 『개발자』님의 영역이니 말이야.\n\n1) 그럼 어떻게 하는지 알려줘.\n2) 개발자가 누구야?');
                }
                else if(p.TutAmt == 2){
                    reply('[한스] : 자네 지금 장난하는겐가. 마지막일세.');
                    reply('[한스] : 다시 설명하겠네. 이게임의 목적은 세계의 진실을 알아내는 것이라네. 그게 뭐냐고? 허허, 나도 잘은 모른다네. 그건 오직 『개발자』님의 영역이니 말이야.\n\n1) 그럼 어떻게 하는지 알려줘.\n2) 개발자가 누구야?');
                }
                else if(p.TutAmt == 3){
                    reply('[한스] : 자네! 정말 안듣고 있구만. 이 이상 나를 화나게 하지 말게나.');
                    reply('칭호 {[특이](전설을 화나게 한 남자)}를 획득하셨습니다.');
                    reply('[한스] : 다시 설명하겠네. 이게임의 목적은 세계의 진실을 알아내는 것이라네. 그게 뭐냐고? 허허, 나도 잘은 모른다네. 그건 오직 『개발자』님의 영역이니 말이야.\n\n1) 그럼 어떻게 하는지 알려줘.\n2) 개발자가 누구야?');
                }
                
                //칭호 추가
                else {
                    reply('[한스] : 자네 해보자는 건가? 좋다. 누가 끝까지 가나 보세.');
                    reply('[한스] : 다시 설명하겠네. 이게임의 목적은 세계의 진실을 알아내는 것이라네. 그게 뭐냐고? 허허, 나도 잘은 모른다네. 그건 오직 『개발자』님의 영역이니 말이야.\n\n1) 그럼 어떻게 하는지 알려줘.\n2) 개발자가 누구야?');
                }


            }
            if(msg == '2'){
                progress[userId] = 'END';
                p.isTuting = false;
                save(userId, p);
                reply('튜토리얼이 종료되었습니다. [스타터팩]이 지급됩니다.');
                reply('사용자님이 아이템을 획득하셨습니다.\n\n[일반] 철 x 10\n[무한] 닉변권 x 1\n[10,000$]');
                reply('※미션이 갱신되었습니다.');
                reply('[시작]\n> 광질을 시작하세요\n\n보상 : [1,000G]');
            }
        } break;


    }

    //허용 접두어 추가
    if(!msg.startsWith(j) && !msg.startsWith(s)) return;

    //튜토리얼 진행 감지
    if(!p.Tut && !p.isTuting){
        reply('튜토리얼 먼저 해 !튜토리얼');
        return;
    }

    //튜토리얼 중 감지
    if(p.isTuting && msg != '!튜토리얼' && msg.startsWith(j)){
        return;
    }

    if(msg.startsWith(s + '검색 ')){
        let keyWord = msg.slice(4);
        if(!keyWord){
            reply('빈칸X');
            return;
        }
        let Search = Items.filter(x => x.Name.includes(keyWord));
        if(!Search.length){
            reply('검색결과 X');
            return;
        }
        let result = keyWord + '의 결과\n\n';
        for(i in Search){
            result = result + '[' + Search[i].Rank + '] ' + Search[i].Name + ' (' + Search[i].Code + ')';
        }
        reply(result);
    }

    if(msg.startsWith(s + '열람 ')){
        let inputCode = msg.slice(4);
        if(!inputCode){
            reply('공백X');
            return;
        }
        let Search = Items.find(x => x.Code == inputCode);
        if(!Search){
            reply('없음');
            return;
        }
        let result = '『' + Search.Name + '』               [' + Search.Code + ']\n사진'
        reply(result)
    }

    //우선순위 제작
    if(p.Mine.isMining){
        reply('광질중에 다른명령어는 사용이 불가합니다.');
        return;
    }

    if(p.Logg.isLogging){
        reply('벌목중에 다른명령어는 사용이 불가합니다.');
        return;
    }

    if(msg == j + '광질'){
        if(p.Mine.isMining){
            replier.reply('이미 광질중입니다.');
            return;
        }
        if(!p.Mine.Pixaxe.some(x => x.isPicked)){
            replier.reply(acces + '장착된 곡괭이가 없습니다.');
            return;
        }
        reply('광질시작!');
        let MineTime = p.Mine.Pixaxe.find(x => x.isPicked).Time;
        p.Mine.isMining = true;
        save(userId, p);
        wait(MineTime);
        if(!p.Mine.isMining){
            return;
        }
        let PickedPixaxeLuck = p.Mine.Pixaxe.find(x => x.isPicked).Luck
        let RankResult = PercentRandom(['일반', '희귀', '초희귀', '영웅', '전설', '초월', '영원', '불멸', '무한', '유일', '공허'], [(40 + PickedPixaxeLuck[0]), (32 + PickedPixaxeLuck[1]), (18 + PickedPixaxeLuck[2]), (4 + PickedPixaxeLuck[3]), (3 + PickedPixaxeLuck[4]), (2 + PickedPixaxeLuck[5]), (0.9 + PickedPixaxeLuck[6]), (0.08 + PickedPixaxeLuck[7]), (0.019 + PickedPixaxeLuck[8]), (0.001 + PickedPixaxeLuck[9]), PickedPixaxeLuck[10]]);
        let FilteredMinerals = Wood_Ores.Ores[RankResult];
        let RandomMinerals = FilteredMinerals[Math.floor(Math.random() * FilteredMinerals.length)];
        let a = p.Inventory.findIndex(x => x.Name == RandomMinerals);
        let MineralAmount = (Math.random() * (p.Mine.MineLvL - 1)) + 1;
        if(a == -1){
            p.Inventory.push({Name : RandomMinerals, Rank : RankResult, Amount : MineralAmount});
        } else {
            p.Inventory[a].Amount += MineralAmount;
        }
        p.Mine.isMining = false;
        p.Mine.MineAmt++;
        save(userId, p);
        reply('아이템 획득\n\n[' + RankResult + '] ' + RandomMinerals + ' x ' + MineralAmount);
    }

    if(msg == j + '도감'){
        reply('');
    }
}

function user(Id){
    return JSON.parse(FS.read(Path + Id + '.txt'));
}

function save(Id, obj){
    if(!user(Id)){
        return false;
    }
    FS.write(Path + Id + '.txt', JSON.stringify(obj, null, 4));
    return true;
}

function generateId(len){
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for(let i = 0; i < len; i++){
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function wait(sec){
  java.lang.Thread.sleep(sec * 1000);
}

function PercentRandom(Names, Percent){
  if(Names.length !== Percent.length) return false;
  const TotalPercent = Percent.reduce((x, y) => x + y, 0);
  let number = Math.random() * TotalPercent;
  for (i in Names){
    number -= Percent[i];
    if (number <= 0) {
      return Names[i];
    }
  }
}






/*

__                   __                
/\ \                 /\ \               
\ \ \____     __     \ \ \____    ___   
 \ \ '__`\  /'__`\    \ \ '__`\  / __`\ 
  \ \ \L\ \/\ \L\.\_   \ \ \L\ \/\ \L\ \
   \ \_,__/\ \__/.\_\   \ \_,__/\ \____/
    \/___/  \/__/\/_/    \/___/  \/___/ 
                                        
                                        



⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡄⡔⣔⢤⣠⢠⡀⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⢄⢌⢎⢎⢮⡪⣗⣗⢯⢳⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠠⡐⢔⢕⢕⢕⢵⡹⣪⡞⡗⡕⢕⢕⠅⠀⠀⠀
⠀⠀⠀⠠⡠⡣⡑⡜⡜⡜⣜⢮⣳⢝⢇⢇⢕⢜⠎⠀⠀⠀⠀⠀
⠀⠀⠀⠠⡫⡺⡪⡮⣪⡺⣪⢗⢕⢕⢑⣕⠕⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠸⣰⢨⢊⠪⡪⡺⡇⢇⢕⢕⠕⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠉⠺⠸⣌⠪⣫⢢⠣⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠪⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
*/
