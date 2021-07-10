export default class {
    constructor() {
        
      }
    
      hoge() {
        console.log("test");
      }

      checkDiff(before, after) {
        let diffArr = []
        for(let i = 0;i<before.length;i++){
            for(let j = 0;j<before[i].length;j++){
                if(before[i][j].value !== after[i][j].value){
                    diffArr.push([i,j])
                }
            }
        }
        return diffArr
      }

    getNextMasu(masu,myTurn){
        let nextAction = []
        for(let i = 0;i<masu.length;i++){
            for(let j = 0;j<masu[i].length;j++){
                let reverceMasu = this.getReverceMasu(masu,myTurn,i,j)
                if(reverceMasu.length){
                    nextAction.push({put: [i,j], reverce: reverceMasu})
                }
            }
        }
        return nextAction
      }

    getReverceMasu(masu,myTurn,v,h){//[[],[],[]]
        let changeMasu = []
        if (masu[v][h].value === null) {
            // 指定した場所の周り9マスを調べる
            for (let i = -1; i < 2; i++) {
            let roundV = v + i;
            for (let j = -1; j < 2; j++) {
                let roundH = h + j;
    
                // 盤面をはみ出さない＆＆相手の駒がある
                if (![-1, 8].includes(roundV) && ![-1, 8].includes(roundH)) {
                if (masu[roundV][roundH].value === !myTurn) {
                    for (let k = 1; ; k++) {
                    // 先にある駒の座標
                    let nextV = (Math.abs(i) + k) * i + v;
                    let nextH = (Math.abs(j) + k) * j + h;
    
                    if ([-1, 8].includes(nextV) || [-1, 8].includes(nextH)) break;
                    if (masu[nextV][nextH].value === null) break;
    
                    if (masu[nextV][nextH].value === myTurn) {
                        for(;k !== 0;){
                            let nextV = (Math.abs(i) + k-1) * i + v;
                            let nextH = (Math.abs(j) + k-1) * j + h;
                            changeMasu.push([nextV,nextH])
                            k--
                        }
                        changeMasu.push([v,h])
                        break
                    }
                    }
                }
                }
            }
            }
        }
        return changeMasu
          
      }
}