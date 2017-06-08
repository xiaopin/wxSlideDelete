// pages/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        items: [],
        offsetRecord: { 'index': -1, 'startX': 0, 'offset': 0 }, // 偏移记录
        deleteButtonWidth: 200, // 删除按钮的宽度(rpx)
        pixelScale: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let res = wx.getSystemInfoSync();
        this.data.pixelScale = (750/2) / (res.screenWidth/2);

        // 模拟数据
        let items = new Array(20).fill(0).map((v, idx) => `Label ${idx}`);
        this.setData({ items: items });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 表格cell触摸开始事件
     */
    onTableCellTouchStart: function (event) {
        if (event.changedTouches.length != 1) return;
        let index = event.currentTarget.dataset.index;
        let x = event.changedTouches[0].clientX;
        this.setData({ offsetRecord: { 'index': index, 'startX': x, 'offset': 0 } });
    },

    /**
     * 表格cell触摸移动事件
     */
    onTableCellTouchMove: function (event) {
        if (event.changedTouches.length != 1) return;
        let index = event.currentTarget.dataset.index;
        let record = this.data.offsetRecord;
        if (index != Reflect.get(record, 'index')) {
            return;
        }
        let clientX = event.changedTouches[0].clientX;
        let startX = Reflect.get(record, 'startX');
        let distance = Math.max(Math.min((startX - clientX) * this.data.pixelScale, this.data.deleteButtonWidth), 0);
        Reflect.set(record, 'offset', distance);
        this.setData({ offsetRecord: record });
    },

    /**
     * 表格cell触摸结束事件
     */
    onTableCellTouchEnd: function (event) {
        if (event.changedTouches.length != 1) return;
        let index = event.currentTarget.dataset.index;
        let record = this.data.offsetRecord;

        if (index == Reflect.get(record, 'index')) {
            let offset = Reflect.get(record, 'offset');
            if (offset >= this.data.deleteButtonWidth / 2) {
                Reflect.set(record, 'offset', this.data.deleteButtonWidth);
            } else {
                record = null;
            }
            this.setData({ offsetRecord: record });
        }
    },

    /**
     * 表格cell删除按钮点击事件
     */
    onDeleteButtonTapped: function (event) {
        let index = event.currentTarget.dataset.index;
        wx.showModal({
            content: `确定要删除第${index}行表格吗？`,
            showCancel: true,
            success: (res) => {
                if (!res.confirm) return;
                let items = Reflect.get(this.data, 'items');
                items.splice(index, 1);
                this.setData({ items: items, offsetRecord: null });
            }
        });
    }


})