const ScriptName = 'RELAUNCH : RPG';
let userId = 1938103211;
const j = '!';
const deco = '[TRPG]'
const FS = FileStream;
const Path = '/sdcard/RPG/';
//UserListPath = '/sdcard/RPG/UserList.txt', RPGWood_Ores = '/sdcard/Pictures/RPGWood_Ores.json';
//const Item_DB = '/sdcard/Pictures/RPGItems.json';
let CreateArrayFile = (path) => {
    if(!FS.read(path)) FS.write(path, JSON.stringify([], null, 4));
}
const CommandPath = '/sdcard/RPG/cmds.json';
let cmdsLists = JSON.parse(FS.read(CommandPath));

const Tools = {

    wait : (function(sec){
        java.lang.Thread.sleep(sec * 1000);
    }),

    generateId : (function(len){
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for(let i = 0; i < len; i++){
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }),

    save : (function(Id, obj){
        if(!user(Id)){
            return false;
        }
        FS.write(Path + Id + '.txt', JSON.stringify(obj, null, 4));
        return true;
    }),

    user : (function(Id){
        return JSON.parse(FS.read(Path + Id + '.txt'));
    }),

    PercentRandom : (function(Names, Percent){
        if(Names.length !== Percent.length) return false;
        const TotalPercent = Percent.reduce((x, y) => x + y, 0);
        let number = Math.random() * TotalPercent;
        for (i in Names){
            number -= Percent[i];
            if (number <= 0) {
                return Names[i];
            }
        }
    }),

    NumberTranslator : (function(num){
        if(!num) return 0;
        let wordArray = ['', '만', '억', '조', '경', '해', '자', '양', '구', '간', '정', '재', '극', '항아사', '아승기', '나유타', '불가사의', '무량대수'];
        let basicUnit = 10000, resultArray = [];
        let a = wordArray.reverse();
        for (let i = 0; i < wordArray.length; i++){
            let splitRes = Math.floor((num % Math.pow(basicUnit, i + 1))/Math.pow(basicUnit, i));
            if (splitRes > 0){
                resultArray.unshift(String(splitRes) + a[wordArray.length - (i + 1)]);
            }
        }
        let comma = resultArray[resultArray.length - 1].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        resultArray.pop(), resultArray.push(comma);
        return resultArray.join(' ');
    }),

    gauge : (function(number, maximum, lengthofbar, doPerc, doSlash){
        if(isNaN(number)) return '숫자가 아님';
        if(String(number).includes('.')) number = Math.round(number);
        let nowbar = number<=0?[0,0]:number>=maximum?[lengthofbar, 100]:[Math.round(lengthofbar * (number / maximum)),Math.floor((number/maximum)*100)]; 
        let lastStr;
        (doPerc?lastStr=' 《 '+nowbar[1]+'% 》':doSlash?lastStr=' 《 '+number+' / '+maximum+' 》':'');
        return ('[' + ('█'.repeat(nowbar[0]))) + ('░'.repeat(lengthofbar - nowbar[0]) + ']' + lastStr);
    }),

    comma : (function(num){
        let parts = num.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    })

}
const gameEvents = {
    signUp : (function(Name){

    })
}
const cmds = {

    input : (function(message){
        //명령어 목록에서 찾기
        let FindCmd = cmdsLists.find(x => message.includes(x.cmd));
        if(!FindCmd){
            return false;
        }
        if(FindCmd.type == 'startsWith'){
            return [FindCmd.cmdCode, message.slice(FindCmd.cmd.length + 1)];
        }
        if(FindCmd.type == 'both'){
            if(message.length == FindCmd.cmd.length){
                return [FindCmd.cmdCode, false];
            }
            else {
                return [FindCmd.cmdCode, message.slice(FindCmd.cmd.length + 1)];
            }
        }
        else{
            return [FindCmd.cmdCode, false];
        }
    })
//[{cmd : '가입', cmdCode : 'signUp', type : startwith, both, same}]
}


const roomList = ['들어오지마'];
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, a, b, c, d){
    //허용방
    if(!roomList.includes(room)) return;
    const rpy = (message) => {
        replier.reply(message);
    };
    let player = Tools.user(userId);
    //접두어메시지
    if(msg.startsWith(j)){
        msg = msg.slice(j.length);
        let ChosenCmd = cmds.input(msg);
        if(!ChosenCmd) return;
        if(ChosenCmd[0] == 'signUp'){
            if(player){ rpy(deco + '이미 가입하셨습니다.'); return; }
            if(ChosenCmd[1]){ rpy(deco + '공백은 입력할 수 없습니다.'); return; }
            if(/[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi.test(ChosenCmd[1])){ rpy(deco + '특수문자는 입력이 불가합니다.'); return; }
            if(ChosenCmd[1].length < 3 || ChosenCmd[1].length > 10){
                rpy(deco + '닉네임은 3~10글자 제한입니다.');
                return;
            }
        }
        if(!ChosenCmd[1]){
            gameEvents[ChosenCmd[0]]();
        } else if(ChosenCmd){
            gameEvents[ChosenCmd[0]](ChosenCmd[1]);
        }
    }
}