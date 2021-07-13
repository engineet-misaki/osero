<template>
  <div class="osero">
    <h1 :class="[turn ? 'yureru' : 'none']">
      <span v-if="turn && CPUMode">持ち駒 黒：あなたの番です。</span>
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
          @click="putPiese(Vindex, Hindex,false)"
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
      <button @click="cpuButtle" :class="[CPUMode === true ? 'CPUmode' : '']" style="margin: 10px; padding: 10px;">CPU対戦</button>
    </div>
  </div>
</template>

<script>
import helpModule from "./method/module.js"

export default {
name: "Osero",
  data() {
    return {
      masu: [],
      title: "Osero",
      turn: true,
      put: true,
      itteme: true,
      CPUMode: false,
    };
  },
  created() {
    this.start();
    this.module = new helpModule
  },
  watch: {
  },
  methods: {
    putPiese(v,h,cpu) {
      const reverceMasu = this.module.getReverceMasu(this.masu,this.turn,v,h)
      console.log(v,h,this.turn)
      if(reverceMasu.length){
        for(let i = 0;i<reverceMasu.length;i++){
          this.reverse(reverceMasu[i][0],reverceMasu[i][1])
        }
        this.changeTurn(cpu)
      }
    },

    changeTurn(cpu) {
      // 次の人が置けるか調べる
      if(this.module.getNextMasu(this.masu, !this.turn).length){
        if(this.CPUMode && !cpu){//人が打った時、はいる
          this.turn = !this.turn
          let cloneMasu = JSON.stringify(this.masu)
          cloneMasu = JSON.parse(cloneMasu)
          const putCPU = this.module.CPUput(cloneMasu,this.turn)
          console.log(putCPU)
          this.putPiese(putCPU[0],putCPU[1],true)
        } 
        else this.turn = !this.turn;
      }
      else {
        // 次の次の人が置けるか調べる
        if((this.module.getNextMasu(this.masu, this.turn).length)){
          if(this.CPUMode && cpu){//人が打った時、はいらない
          let cloneMasu = this.masu.slice()
          const putCPU = this.module.CPUput(cloneMasu,this.turn)
          this.putPiese(putCPU[0],putCPU[1],true)
        } 
        }else {
          // //console.log("両方置けないとき")
          this.judge();
        }
      }
    },

    cpuButtle() {
      this.CPUMode = !this.CPUMode
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
        alert("黒 ("+blackNum+"枚) win");
      } else if (whiteNum === blackNum) {
        alert("引き分け～");
      } else if (blackNum < whiteNum) {
        alert("白 ("+whiteNum+"枚) win");
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
