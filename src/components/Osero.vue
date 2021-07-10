<template>
  <div class="osero">
    <h1 :class="[turn ? 'yureru' : 'none']">
      <span v-if="turn && CPU">持ち駒 黒：あなたの番です。</span>
      <span v-else-if="turn">手番：黒</span>
      <span v-else>手番：白</span>
    </h1>
    <div
      class="filed"
      style="max-width: 488px; border-top: 5px solid black; margin: auto"
    >
      <div
        v-for="(vertical, Vindex) in masu"
        :key="Vindex"
        style="display: flex; border-left: 5px solid black"
      >
        <div
          v-for="(horizon, Hindex) in vertical"
          :key="Hindex"
          class="green"
          @click="putTest(Vindex, Hindex)"
          style="
            flex: 1;
            min-height: 50px;
            border-right: 5px solid black;
            border-bottom: 5px solid black;
          "
        >
          <button
            :class="[
              horizon.value === true
                ? 'front yureru'
                : horizon.value === false
                ? 'back yureru'
                : 'green',
            ]"
            style="
              flex: 1;
              min-height: 50px;
              min-width: 50px;
              border-radius: 50%;
              border: none;
            "
          ></button>
        </div>
      </div>
    </div>
    <div style="margin: 50px">
      <button @click="start" style="margin: 10px; padding: 10px;">リスタート</button>
      <button @click="judge" style="margin: 10px; padding: 10px;">判定</button>
      <button @click="cpuButtle" :class="[CPU === true ? 'CPUmode' : '']" style="margin: 10px; padding: 10px;">CPU対戦</button>
    </div>
  </div>
</template>

<script>
import helpModule from "./method/module.js"

export default {
  
//必要なmethod 
//スタートとジャッジ、リバース（前後の盤面入れたら変わる）
//盤面を入れて盤面を返す関数
//2手読みして返す関数
//有利不利を判定する関数


name: "Osero",
  data() {
    return {
      masu: [],
      title: "Osero",
      turn: true,
      put: true,
      itteme: true,
      CPU: false,
    };
  },
  created() {
    this.start();
    this.module = new helpModule
  },
  watch: {
  },
  methods: {
    putTest(v,h) {
      const reverceMasu = this.module.getReverceMasu(this.masu,this.turn,v,h)
      if(reverceMasu.length){
        for(let i = 0;i<reverceMasu.length;i++){
          this.reverse(reverceMasu[i][0],reverceMasu[i][1])
        }
        // this.CPU = true
        this.changeTurn()
      }
    },

    changeTurn() {
      // 次の人が置けるか調べる
      if(this.module.getNextMasu(this.masu, !this.turn).length){
        if(this.CPU) this.cpuPut()
        else this.turn = !this.turn;
      }
      else {
        // 次の次の人が置けるか調べる
        if((this.module.getNextMasu(this.masu, this.turn).length)){
          if(this.CPU) this.cpuPut()
        }else {
          // //console.log("両方置けないとき")
          this.judge();
        }
      }
    },


    cpuPut() { // 相手の開放度を観察 ,残りますの少ないほうに置く TODO
      let canPutArr = this.canPutMasu(); //黒が打ち終わったタイミングの状態でおけるマスを探る
      this.turn = !this.turn
      let ArrNum = this.firstStrategy(canPutArr)
      
      if(this.itteme){
        this.itteme = false
        ArrNum = this.masu[4][5].value !== null ? 1 : 0
      }

      this.putPiece(canPutArr[ArrNum][0], canPutArr[ArrNum][1]); //打つ

    },
    firstStrategy(canPutArr) {
      let kaihoudo = [64,0];
      for (let x = 0; x < canPutArr.length; x++) {

          // 隅に置いてしまうことがないようにする
          if(canPutArr[x][0] === 0 && canPutArr[x][1] === 1) continue
          if(canPutArr[x][0] === 0 && canPutArr[x][1] === 6) continue
          if(canPutArr[x][0] === 1 && canPutArr[x][1] === 0) continue
          if(canPutArr[x][0] === 1 && canPutArr[x][1] === 1) continue
          if(canPutArr[x][0] === 1 && canPutArr[x][1] === 6) continue
          if(canPutArr[x][0] === 1 && canPutArr[x][1] === 7) continue
          if(canPutArr[x][0] === 6 && canPutArr[x][1] === 0) continue
          if(canPutArr[x][0] === 6 && canPutArr[x][1] === 1) continue
          if(canPutArr[x][0] === 6 && canPutArr[x][1] === 6) continue
          if(canPutArr[x][0] === 6 && canPutArr[x][1] === 7) continue
          if(canPutArr[x][0] === 7 && canPutArr[x][1] === 1) continue
          if(canPutArr[x][0] === 7 && canPutArr[x][1] === 6) continue
        // }

        // 角における時は置く
        if(canPutArr[x][0] === 0 && canPutArr[x][1] === 0) return x
        if(canPutArr[x][0] === 0 && canPutArr[x][1] === 7) return x
        if(canPutArr[x][0] === 7 && canPutArr[x][1] === 0) return x
        if(canPutArr[x][0] === 7 && canPutArr[x][1] === 7) return x

        //置いたときにひっくり返す駒の座標をとって、その周り９マスのnullの座標を数エル
        let reversePieceArr = [];
        let v = canPutArr[x][0];
        let h = canPutArr[x][1];
        // ------------------------------------------------
        // 指定した場所の周り9マスを調べる
        for (let i = -1; i < 2; i++) {
          let roundV = v + i;
          for (let j = -1; j < 2; j++) {
            let roundH = h + j;

            // 盤面をはみ出さない＆＆相手の駒がある
            if (![-1, 8].includes(roundV) && ![-1, 8].includes(roundH)) {
              if (this.masu[roundV][roundH].value === !this.turn) {
                let reversePieceArrTmp = [];
                for (let k = 0; ; k++) {
                  // 先にある駒の座標
                  let nextV = (Math.abs(i) + k) * i + v;
                  let nextH = (Math.abs(j) + k) * j + h;
                  reversePieceArrTmp.push([nextV, nextH]);

                  if ([-1, 8].includes(nextV) || [-1, 8].includes(nextH)) break;
                  if (this.masu[nextV][nextH].value === null) break;

                  if (this.masu[nextV][nextH].value === this.turn) {
                    reversePieceArrTmp.pop();
                    reversePieceArr =
                      reversePieceArr.concat(reversePieceArrTmp);
                    break;
                  }
                }
              }
            }
          }
        }

        // ------------------------------------------------
        console.log(reversePieceArr);

        let kaihoudoArr = []
        for (let k = 0; k < reversePieceArr.length; k++) {
          let v = reversePieceArr[k][0];
          let h = reversePieceArr[k][1];
          // ------------------------------------------------
          // 指定した場所の周り9マスを調べる
          for (let i = -1; i < 2; i++) {
            let roundV = v + i;
            for (let j = -1; j < 2; j++) {
              let roundH = h + j;
              if (![-1, 8].includes(roundV) && ![-1, 8].includes(roundH)) {
                if (this.masu[roundV][roundH].value === null) {

                  let flug = true
                  for(let y = 0;y<kaihoudoArr.length;y++){
                    if(kaihoudoArr[y][0] === roundV && kaihoudoArr[y][1] === roundH){
                      flug = false
                      break
                    }
                  }
                  if(flug){
                    kaihoudoArr.push([roundV,roundH])
                  }
                }
              }
            }
          }

          let kaihoudoCount = kaihoudoArr.length
          console.log("----------",kaihoudoCount)

          if (kaihoudoCount < kaihoudo[0]) {
            kaihoudo[0] = kaihoudoCount
            kaihoudo[1] = x
            console.log(kaihoudo[1])
          }
        }

      }
      return kaihoudo[1];
    },
    cpuButtle() {
      this.CPU = !this.CPU
      this.start()
    },
    judge() {
      let whiteNum = 0;
      let blackNum = 0;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (this.masu[i][j].value === true) {
            blackNum++;
          } else if (this.masu[i][j].value === false) {
            whiteNum++;
          }
        }
      }
      if (whiteNum < blackNum) {
        alert("黒 win");
      } else if (whiteNum === blackNum) {
        alert("引き分け～");
      } else if (blackNum < whiteNum) {
        alert("白 win");
      }
    },
    start() {
      this.masu = [];
      this.turn = true;
      this.putCount = 4
      this.itteme = true
      for (let i = 0; i < 8; i++) {
        this.masu[i] = [];
        for (let j = 0; j < 8; j++) {
          if (i === 3 && j == 3) this.masu[i].push({ value: false });
          else if (i === 4 && j == 4) this.masu[i].push({ value: false });
          else if (i === 3 && j == 4) this.masu[i].push({ value: true });
          else if (i === 4 && j == 3) this.masu[i].push({ value: true });
          else {
            let masuObj = { value: null };
            this.masu[i].push(masuObj);
          }
        }
      }
    },
    reverse(v, h) {
      this.masu[v][h].value = this.turn;
      const changeV = this.masu[v];
      this.masu.splice(v, 1);
      this.masu.splice(v, 0, changeV);
    },
  },
};
</script>

<style scoped>
.osero {
  text-align: center;
}
.front {
  background-color: black;
}
.back {
  background-color: white;
}
.green {
  background-color: green;
}
.CPUmode {
  background-color: slategray;
}
.yureru {
  animation: yureru 2s 1;
}
@keyframes yureru {
  0% {
    transform: translate(0px, 2px);
  }
  5% {
    transform: translate(0px, -2px);
  }
  10% {
    transform: translate(0px, 2px);
  }
  15% {
    transform: translate(0px, -2px);
  }
  20% {
    transform: translate(0px, 2px);
  }
  25% {
    transform: translate(0px, -2px);
  }
  30% {
    transform: translate(0px, 0px);
  }
}
</style>
