const ScriptName = 'RELAUNCH : RPG';

let userId = 1938103211

const j = '!';
const FS = FileStream;
const Path = '/sdcard/RPG/', UserListPath = '/sdcard/RPG/UserList.txt', RPGItemPath1 = '/sdcard/RPG/ItemData1.txt';

let CreateArrayFile = (path) => {
    if(!FS.read(path)) FS.write(path, JSON.stringify([], null, 4));
}

CreateArrayFile(UserListPath);

let NameLists = JSON.parse(FS.read(UserListPath));

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName, a, b, c, d){
    
    const reply = (message) => {
        replier.reply(message);
    };

    if(!msg.startsWith(j)) return;
    let p = user(userId);


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

        if(NameLists.includes(inputName)){
            reply('중복 X');
            return;
        }

        let displayId = generateId(5);

        Data = {

            JoinName : sender,
            UserId : userId,
            displayName : inputName,
            Code : displayId
        
        };

        NameLists.unshift(inputName);
        FS.write(UserListPath, JSON.stringify(NameLists, null, 4));
        FS.write(Path + userId + '.txt', JSON.stringify(Data, null, 4));
        reply('18pt, 가입됨, 튜토리얼 하셈');
        return;

    }

    if(!p){
        reply('가입을 먼저해');
        return;
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
