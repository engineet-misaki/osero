export default class {
    constructor() {
        
      }

    getNextMasu(masu,myTurn){// [{put: [],reverse: [[ひっくり返るとこの座標],[],[]]},,,]
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

    dfs(masu,myTurn,count){//return [v,h]
        if(count === 2){
            const score = this.judgeScore(masu,myTurn)
            return score
        }

        
        let newbanmen = JSON.stringify(masu)
        newbanmen = JSON.parse(newbanmen)
        newbanmen = this.returnMasu(newbanmen,myTurn) //現状の盤面入れたときに、相手が打った後の盤面を返す

        count ++
        const nextTurn = !myTurn
        const score = this.dfs(newbanmen,nextTurn,count)
        return score
    }

    CPUput(masu,myTurn){
        let score = 100
        const nextTurn = !myTurn
        const nextMasu = this.getNextMasu(masu,myTurn)//CPUが次打てる手を列挙
        let put = nextMasu[0].put
        for(let i = 0;i<nextMasu.length;i++){
            // 隅に置けるとき置くようにする
            if((nextMasu[i].put[0] === 0 && nextMasu[i].put[1] === 0 )||
                (nextMasu[i].put[0] === 7 && nextMasu[i].put[1] === 0 )||
                (nextMasu[i].put[0] === 0 && nextMasu[i].put[1] === 7 )||
                (nextMasu[i].put[0] === 7 && nextMasu[i].put[1] === 7 )){
                    return nextMasu[i].put
                }

            let newbanmen = JSON.stringify(masu)
            newbanmen = JSON.parse(newbanmen)
            newbanmen = this.makeNewMasu(newbanmen,myTurn,nextMasu[i].reverce)//新しい盤面作る

            console.log("-------------",i)
            let newScore = this.dfs(newbanmen,nextTurn,0)
            console.log(nextMasu[i].put,newScore)
            if(newScore < score && this.notPutBConer(nextMasu[i].put)) {// 隅手前に置かないようにする
                console.log(nextMasu[i].put,newScore)
                score = newScore
                put = nextMasu[i].put
            }
        }
        return put
    }

    judgeScore(masu,myTurn) {
        const nextMasu = this.getNextMasu(masu,myTurn)
        let score = nextMasu.length
        return score
    }

    returnMasu(masu,myTurn) {
        let returnMasu= masu
        let score = 100
        const nextTurn = !myTurn
        const nextMasu = this.getNextMasu(masu,myTurn)
        for(let i = 0;i<nextMasu.length;i++){

            let newbanmen = JSON.stringify(masu)
            newbanmen = JSON.parse(newbanmen)
            newbanmen = this.makeNewMasu(newbanmen,myTurn,nextMasu[i].reverce)//新しい盤面作る

            let newScore = this.judgeScore(newbanmen,nextTurn)
            if(newScore<score) {
                score = newScore
                returnMasu = newbanmen
            }
        }
        return returnMasu
    }

    makeNewMasu(masu,turn,reverceMasu) {
        //masuの座標の値をmyTurn に帰る
        if(reverceMasu.length){
            for(let i = 0;i<reverceMasu.length;i++){
              masu[reverceMasu[i][0]][reverceMasu[i][1]] = {value: turn}
            }
        }
        return masu
    }

    notPutBConer(put){
        console.log(put)
        if((put[0] === 0 && put[1] === 1) ||
            (put[0] === 1 && put[1] === 1) ||
            (put[0] === 1 && put[1] === 0) ||

            (put[0] === 0 && put[1] === 6) ||
            (put[0] === 1 && put[1] === 6) ||
            (put[0] === 1 && put[1] === 7) ||

            (put[0] === 6 && put[1] === 0) ||
            (put[0] === 6 && put[1] === 1) ||
            (put[0] === 7 && put[1] === 1) ||
            
            (put[0] === 6 && put[1] === 6) ||
            (put[0] === 6 && put[1] === 7) ||
            (put[0] === 7 && put[1] === 6) ){
                console.log(put)
                return false
            }
        return true
    }
}