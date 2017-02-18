// pages/game/game.js
var app = getApp()
Page({
  data: {
    userInfo: {},
    boxs: new Array(16),
    currentScore: 0,
    bestScore: 0,
    startPoint: [0, 0],
    direction: "",
    random: 1,
    lastbox: 0,
    animationData: {},
    flag: true,
    buttonDisabled: true,
    modalHidden: true,
    animation: ''
  },
  //触摸时获取坐标
  touchStart: function (e) {
    this.setData({ startPoint: [e.touches[0].x, e.touches[0].y] })
  },
  //手指移动并计算方向
  touchMove: function (e) {
    var curPoint = [e.touches[0].x, e.touches[0].y]
    var startPoint = this.data.startPoint
    var that = this
    if (curPoint[0] <= startPoint[0]) {
      if (Math.abs(curPoint[0] - startPoint[0]) >= Math.abs(curPoint[1] - startPoint[1])) {
        that.setData({ direction: "left" })
      } else {
        if (curPoint[1] - startPoint[1] < 0) {
          that.setData({ direction: "up" })
        } else {
          that.setData({ direction: "down" })
        }
      }
    } else {
      if (Math.abs(curPoint[0] - startPoint[0]) >= Math.abs(curPoint[1] - startPoint[1])) {
        that.setData({ direction: "right" })
      } else {
        if (curPoint[1] - startPoint[1] < 0) {
          that.setData({ direction: "up" })
        } else {
          that.setData({ direction: "down" })
        }
      }
    }
  },
  //手指离开操作
  touchEnd: function (e) {
    var that = this
    var lastbox = 0
    if (this.data.direction) {
      that.boxMove(this.data.direction, lastbox)
      setTimeout(function () {
        that.mergeBoxs(that.data.direction, lastbox)
      }, 10)
      setTimeout(function () {
        if (that.data.random == 1 || that.data.mergeRandom == 1) { that.randomNum() }
      }, 200)
    }
  },
  //方块移动
  boxMove: function (direction, lastbox) {
    var curboxs = this.data.boxs
    var that = this
    if (direction == "left") {
      curboxs.forEach(function (item, index) {
        if (item != '') {
          if ((index + 1) > 4 && curboxs[index - 4] == '') {
            that.refreshArray(index, '')
            that.refreshArray(index - 4, item)
            lastbox = 1 + lastbox
            setTimeout(function () { that.boxMove(direction, lastbox) }, 15)
          } else {
            lastbox = 0 + lastbox
          }
        }
      })
    } else if (direction == "right") {
      for (var i = 15; i >= 0; i--) {
        if (curboxs[i] != '') {
          if (i < 12 && curboxs[i + 4] == '') {
            that.refreshArray(i + 4, curboxs[i])
            that.refreshArray(i, '')
            lastbox = 1 + lastbox
            setTimeout(function () { that.boxMove(direction, lastbox) }, 15)
          } else {
            lastbox = 0 + lastbox
          }
        }
      }
    } else if (direction == "up") {
      curboxs.forEach(function (item, index) {
        if (item != '') {
          if (index % 4 != 0 && curboxs[index - 1] == '') {
            that.refreshArray(index, '')
            that.refreshArray(index - 1, item)
            lastbox = 1 + lastbox
            setTimeout(function () { that.boxMove(direction, lastbox) }, 15)
          } else {
            lastbox = 0 + lastbox
          }
        }
      })
    } else if (direction == "down") {
      for (var i = 15; i >= 0; i--) {
        if (curboxs[i] != '') {
          if ((i + 1) % 4 != 0 && curboxs[i + 1] == '') {
            that.refreshArray(i + 1, curboxs[i])
            that.refreshArray(i, '')
            lastbox = 1 + lastbox
            setTimeout(function () { that.boxMove(direction, lastbox) }, 15)
          } else {
            lastbox = 0 + lastbox
          }
        }
      }
    }
    if (lastbox == 0) {
      that.setData({ random: 0 })
    } else {
      that.setData({ random: 1 })
    }
  },
  //方块合并
  mergeBoxs: function (direction, lastbox) {
    var that = this
    var curboxs = this.data.boxs
    if (direction == "left") {
      curboxs.forEach(function (item, index) {
        var curIndex = index
        var preIndex = index - 4
        var curNum = curboxs[index]
        var preNum = curboxs[index - 4]
        if ((index + 1) > 4 && preNum == curNum && curNum != '') {
          that.refreshArray(curIndex, '')
          that.boxMove(that.data.direction, lastbox)
          that.refreshArray(preIndex, curNum + preNum)
          that.score(curNum + preNum)
          lastbox = lastbox + 1
        } else {
          that.boxMove(that.data.direction, lastbox)
          lastbox = lastbox + 0
        }
      })
    } else if (direction == "right") {
      for (var i = 15; i >= 0; i--) {
        var nextIndex = i + 4
        var curIndex = i
        var nextNum = curboxs[i + 4]
        var curNum = curboxs[i]
        if (i < 12 && nextNum == curNum && curNum != '') {
          that.refreshArray(curIndex, '')
          that.refreshArray(nextIndex, nextNum + curNum)
          that.boxMove(that.data.direction, lastbox)
          that.score(curNum + nextNum)
          lastbox = lastbox + 1
        } else {
          that.boxMove(that.data.direction, lastbox)
          lastbox = lastbox + 0
        }
      }
    } else if (direction == "up") {
      curboxs.forEach(function (item, index) {
        var upIndex = index - 1
        var curIndex = index
        var upNum = curboxs[index - 1]
        var curNum = curboxs[index]
        if (index % 4 != 0 && upNum == curNum && curNum != '') {
          that.refreshArray(curIndex, '')
          that.refreshArray(upIndex, upNum + curNum)
          that.boxMove(that.data.direction, lastbox)
          that.score(upNum + curNum)
          lastbox = lastbox + 1
        } else {
          that.boxMove(that.data.direction, lastbox)
          lastbox = lastbox + 0
        }
      })
    } else if (direction == "down") {
      for (var i = 15; i >= 0; i--) {
        var downIndex = i + 1
        var curIndex = i
        var downNum = curboxs[i + 1]
        var curNum = curboxs[i]
        if ((i + 1) % 4 != 0 && curNum == downNum && curNum != '') {
          that.refreshArray(curIndex, '')
          that.refreshArray(downIndex, downNum + curNum)
          that.boxMove(that.data.direction, lastbox)
          that.score(downNum + curNum)
          lastbox = lastbox + 1
        } else {
          that.boxMove(that.data.direction, lastbox)
          lastbox = lastbox + 0
        }
      }
    } else {
      that.boxMove(that.data.direction, lastbox)
      lastbox = lastbox + 0
    }
    if (lastbox == 0) {
      that.setData({ random: 0 })
    } else {
      that.setData({ random: 1 })
    }
  },
  //获取账号信息
  getUserInfo: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
  },
  //生成随机数
  randomNum: function () {
    var indexArray = [];
    var that = this
    this.data.boxs.forEach(function (item, index) {
      if (item == '') {
        indexArray.push(index)
      }
    })
    var num = Math.random()
    var initNum = num > 0.85 ? 4 : 2
    var index = indexArray[Math.floor(Math.random() * indexArray.length)]
    this.refreshArray(index, initNum)
    this.gameOver()
  },
  boxAnimation: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.scale(1, 1).step()
    animation.scale(1.1, 1.1).step()
    animation.scale(1, 1).step()
    this.setData({
      animationData: animation.export()
    })
  },
  //计算分数
  score: function (score) {
    var currentScore = this.data.currentScore
    var bestScore = this.data.bestScore
    this.setData({
      currentScore: currentScore += score,
    })
    if (currentScore > bestScore) {
      this.setData({
        bestScore: currentScore,
      })
      try {
        wx.setStorageSync('bestScore', this.data.bestScore)
      } catch (e) {
      }
    }
  },
  //刷新数组
  refreshArray: function (index, initNum) {
    var newBoxs = {}
    newBoxs['boxs[' + index + ']'] = initNum
    this.setData(newBoxs)
  },
  //游戏结束
  gameOver: function () {
    var that = this
    var curboxs = this.data.boxs
    var i = 0
    curboxs.forEach(function (item, index) {
      var preNum = curboxs[index - 4]
      var upNum = curboxs[index - 1]
      if (item != '' && preNum != item) {
        if (index % 4 != 0 && upNum != item) {
          i++
        } else if (index % 4 == 0) {
          i++
        } else { }
      }
    })
    if (i == 16) {
      // this.setData({
      //   modalHidden: !this.data.modalHidden
      // })
      wx.showModal({
        title: 'Game Over',
        content: '请重新来过',
        success: function (res) {
          if (res.confirm) {
            that.restart()
          } else {
            wx.navigateTo({
              url: '../start/start'
            })
          }
        }
      })
    }
  },
  //刷新游戏
  restart: function () {
    var that = this
    var curboxs = this.data.boxs
    curboxs.forEach(function (item, index) {
      that.refreshArray(index, '')
    })
    this.setData({
      currentScore: 0,
    })
    this.randomNum()
    this.randomNum()
  },
  //重新开始
  restartGame: function () {
    var that = this
    this.restart()
    this.animation.rotate(360).step()
    this.setData({
      //输出动画
      animation: that.animation.export()
    })
  },
  //弹框按钮
  // modalBindaconfirm: function () {
  //   this.restart()
  //   this.setData({
  //     modalHidden: !this.data.modalHidden
  //   })
  // },
  // modalBindcancel: function () {
  //   this.setData({
  //     modalHidden: !this.data.modalHidden
  //   })
  // },
  //页面载入
  onLoad: function () {
    var that = this
    this.data.boxs.fill('')
    this.getUserInfo()
    this.randomNum()
    this.randomNum()
    wx.getStorage({
      key: 'bestScore',
      success: function (res) {
        that.setData({
          bestScore: res.data,
        })
      }
    })
  },
  onReady: function () {
    this.animation = wx.createAnimation({
      duration: 1500,
      timingFunction: 'ease'
    })
  }
})