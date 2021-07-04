<template>
  <div class="osero">
    <h1 :class="[turn ? 'yureru-j': 'none']">
      {{ title }}
      <span v-if="turn">手番：黒</span>
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
          @click="putPiece(Vindex, Hindex)"
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
                ? 'front yureru-j'
                : horizon.value === false
                ? 'back yureru-j'
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
      <button @click="start" style="margin: 50px">リスタート</button>
      <button @click="judge" style="margin: 50px">判定</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Osero",
  data() {
    return {
      masu: [],
      title: "Osero",
      turn: true,
      put: true,
    };
  },
  created() {
    this.start();
  },
  watch: {
    put() {
      // 次の手版の人がおけるか調べる おけるなら手版入れ替え
      if (this.canSerth()) this.turn = !this.turn;
      else {
        // 次の次の人が置けるか調べる
        this.turn = !this.turn
        if(this.canSerth()){
          this.turn = !this.turn
          alert("おけないので手版もう一回")
        }else{
          // console.log("両方置けないとき")
          this.judge()
        }
      }
    },
  },
  methods: {
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
      for (let i = 0; i < 8; i++) {
        this.masu[i] = [];
        for (let j = 0; j < 8; j++) {
          if (i === 3 && j == 3) this.masu[i].push({ value: true });
          else if (i === 4 && j == 4) this.masu[i].push({ value: true });
          else if (i === 3 && j == 4) this.masu[i].push({ value: false });
          else if (i === 4 && j == 3) this.masu[i].push({ value: false });
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
    putPiece(v, h) {
      let canPutPiece = false; //駒を置くかどうかのフラグ
      // 駒が置いてない＝＝null
      if (this.masu[v][h].value === null) {
        // 指定した場所の周り9マスを調べる
        for (let i = -1; i < 2; i++) {
          let roundV = v + i;
          for (let j = -1; j < 2; j++) {
            let roundH = h + j;

            // 盤面をはみ出さない＆＆相手の駒がある
            if (![-1, 8].includes(roundV) && ![-1, 8].includes(roundH)) {
              if (this.masu[roundV][roundH].value === !this.turn) {
                // 先にある駒を調べて、フラグを変える
                canPutPiece =
                  this.nextMasuSerch(v, h, i, j) || canPutPiece ? true : false;
              }
            }

          }
        }
      }
      if (canPutPiece) {
        this.reverse(v, h);
        // this.putは、駒を置いたかどうかウォッチするためのフラグ
        this.put = !this.put;
      }
    },
    nextMasuSerch(v, h, vi, hj) {
      let reverseArr = [];
      for (let i = 0; ; i++) {
        // 先にある駒の座標
        let nextV = (Math.abs(vi) + i) * vi + v;
        let nextH = (Math.abs(hj) + i) * hj + h;

        // 先にある駒が盤面外||駒が置かれてないとき
        if ([-1, 8].includes(nextV) || [-1, 8].includes(nextH)) break;
        if (this.masu[nextV][nextH].value === null) break;

        // 先にある駒が自分の駒の時
        if (this.masu[nextV][nextH].value === this.turn) {
          for (let j = 0; j < reverseArr.length; j++) {
            this.reverse(reverseArr[j].nV, reverseArr[j].nH);
          }
          return true;
        }

        // 先にある駒が相手の駒であるのが続くと配列に追加する
        reverseArr.push({ nV: nextV, nH: nextH });
      }
      return false;
    },
    // おけるかどうか調べる関数
    canSerth() {
      let flug = false
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (flug || this.putCanSerch(i, j)) flug = true; //おけたらtrue
        }
      }
      return flug;
    },
    putCanSerch(v, h) {
      if (this.masu[v][h].value === null) {
        // 指定した場所の周り9マスを調べる
        for (let i = -1; i < 2; i++) {
          let roundV = v + i;
          for (let j = -1; j < 2; j++) {
            let roundH = h + j;
            
            // 盤面をはみ出さない＆＆相手の駒がある
            if (![-1, 8].includes(roundV) && ![-1, 8].includes(roundH)) {
              if (this.masu[roundV][roundH].value === this.turn) {
                for (let k = 1; ; k++) {

                  // 先にある駒の座標
                  let nextV = (Math.abs(i) + k) * i + v;
                  let nextH = (Math.abs(j) + k) * j + h;

                  if ([-1, 8].includes(nextV) || [-1, 8].includes(nextH)) break;
                  if (this.masu[nextV][nextH].value === null) break;

                  if (this.masu[nextV][nextH].value === !this.turn) {
                    // console.log(v,h,"testjlkjdsa",nextV,nextH)
                    return true;
                  }
                }
              }
            }
          }
        }
      }
      return false;
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
.yureru-j {
    animation: yureru-j 2s 1;
}
@keyframes yureru-j {
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
