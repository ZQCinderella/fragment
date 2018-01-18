
/**
 * Created by fet on 2017/12/22.
 */

/* rem */
;
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function recalc() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        };
    recalc();
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
})(document, window);

/*后半部分增强*/
function extend(dest, source) {
	if (!source) {
		source = dest;
		dest = {};
	}
	for (var property in source) {
		if (!(property in {})) {
			dest[property] = source[property];
		}
	}
	return dest;
};
var Class = {
	create: function create() {
		var parent = null;
		var argc = Array.prototype.slice.call(arguments,0);
		if (typeof argc[0] === 'function') {
			parent = argc.shift();
		}

		function res() {
			this.init && this.init.apply(this, arguments);
		}

		function sub() {}
		if (parent) {
			sub.prototype = parent.prototype;
			res.prototype = new sub();
		}
		res.superclass = parent;
		for (var i = 0, length = argc.length; i < length; i++) {
			extend(res.prototype, argc[i]);
		}
		res.prototype.constructor = res;
		return res;
	}
};


//这样写可以可以记录所有实例化出来的modal，能简单应对可能出现的多层modal

var SModal_Con = Class.create({
  init: function() {
    this.key = Math.floor(Math.random() * 1000);
    this.all = [];
    this.data = {};
    this.initModalContainer();
    this.onresize(this.resizeContainer.bind(this));
    //event
    this.bindEvents();
  },
  initModalContainer: function() {
    var bodyNode = document.body;
    var container = this.container = document.createElement("div");
    container.className = "smodal-container";
    container.style.display = 'none';
    //container.innerHTML = '<div class="smodal-mask"></div>';
    bodyNode.appendChild(container);
  },
  isMobile: function() {
    var ua = navigator.userAgent;
    if (ua.indexOf("Mobile") !== -1) {
      return true;
    } else if (/Android|iPhone|Windows Phone|Nexus|MiuiBrowser/.test(ua)) {
      return true;
    }
    return false;
  },
  resizeContainer: function() {
    var doc = document.body;
    var width = document.documentElement.scrollWidth || document.body.scrollWidth;
    var height = document.documentElement.scrollHeight || document.body.scrollHeight;
    this.container.style.width = !this.isMobile() ? width - 1 + 'px' : "100%";
    this.container.style.height = !this.isMobile() ? height + 'px' : "100%";;
  },
  onresize: function(fn) {
    this.lastResize = +new Date() - 100;
    window.onresize = function() {
    	var now = +new Date();
    	if (now - this.lastResize > 10) {
    		setTimeout(fn, 50);
    		this.lastResize = now;
    	}
    }.bind(this);
  },
  hideAll: function() {
    this.all.forEach(function(item) {
      this.data[item].style.display = 'none';
    }.bind(this));
  },
  showModal: function(key) {
    this.data[key].style.display = 'flex';
    this.data[key].style.display = '-webkit-flex';
  },
  show: function() {
    this.resizeContainer();
    this.container.style.display = 'flex';
    this.container.style.display = '-webkit-flex';
  },
  hide: function() {
    this.container.style.display = 'none';
  },
  getKey: function(prefix) {
    prefix = prefix || "smodal";
    return prefix + "-" + this.key++;
  },
  add: function(key, modal) {
    this.container.appendChild(modal);
    this.all.push(key);
    this.data[key] = modal;
  },
  get: function(key) {
    return this.data[key];
  },
  bindEvents: function (){
    var that = this;
    this.container.addEventListener('touchmove', function(e){
      e.preventDefault();
      that.touchmoveFlag = true;
    }, false)
    this.container.addEventListener('touchend', function(e){
      if (that.touchmoveFlag) {
        that.touchmoveFlag = false;
        return false;
      }
      that._innerCon = document.getElementsByClassName('smodal-con')[0];
      if (!that._innerCon.contains(e.target)) {
        that.hide();
      }
    }, false);
  }
});
var ModalStore = new SModal_Con();
var SModal = Class.create({
  init: function(conf) {
  	this.conf = conf;
    this.buttons = {};
    var con = this.con = document.createElement("div");
    con.className = "smodal-con";
    this.con.className = "smodal-con";
    this.key = ModalStore.getKey();
    con.id = this.key;
    ModalStore.add(this.key, con);
    //render && events
    this.render();
    this.bindEvents();
    //this.initWidthAndHeight();
  },
  initWidthAndHeight: function(){
    this.initHeight = 3.5;
    this.initWidth = 5.5;
  },
  getElement: function(className) {
  	return document.getElementsByClassName(className)[0];
  },
  bindEvents: function() {
    var that = this;
    if (this.conf.btns){
      var btns = document.getElementsByClassName('smodal-btn');
      for (var i = 0; i < btns.length; i++) {
        btns[i].onclick = function(){
          var key = this.getAttribute('data-key');
          if (key in that.buttons) {
            that.execBtnClick(key, this);
          }
        }
      }
      this.getElement('smodal-close').onclick = function (){
      	that.style.display = 'none';
      	return false;
      }
    }
  },
  execBtnClick: function(key, btn) {
    var fns = this.buttons[key] || [];
    var that = this;
    fns.forEach(function(item, index) {
      item.call(btn, that);
    });
  },
  render: function() {
    var conf = this.conf;
    var that = this;
    var con = this.con;
    /*con 的初始化*/
    con.innerHTML = '<div class="smodal-header clearfix">\
                <span class="smodal-header-content"></span>\
                <span class="smodal-close">x</span>\
              </div>\
              <div class="smodal-body clearfix">\
                <div class="smodal-face"></div>\
              </div>\
              <div class="smodal-footer clearfix">\
              </div>';
    this.header = this.getElement("smodal-header-content");
    this.body = this.getElement("smodal-body");
    this.footer = this.getElement("smodal-footer");
    //弹窗btns
    var html = "";
    if (conf.btns) {
      var btnWidth = Math.floor(100/conf.btns.length) + '%';
      console.log(btnWidth);
	    conf.btns.forEach(function(item, index) {
	      var key = item.key || index;
	      var fns = that.buttons[key];
	      if (!fns) {
	        fns = that.buttons[key] = [];
	      }
	      fns.push(item.handle);

	      html += '<div class="smodal-btn ' + item.cls + ' smodal-btn-' + key + '" data-key="' + key + '" style="width:'+ btnWidth +'">' + item.text + '</div>';
	    });
    }
    this.footer.innerHTML = html;
  },
  updateBtn: function(conf) {
    var key = conf.key || conf.index;
    var fns = this.buttons[key] = [];
    fns.push(conf.handle);
    if (conf.cls) {
    	this.getElement("smodal-btn-" + key).className = conf.cls;
    }
    if (conf.text) {
    	this.getElement("smodal-btn-" + key).innerText = cong.text;
    }
  },
  html: function html(_html) {
    this.body.innerHTML = _html;
  },
  show: function() {
    ModalStore.show();
    this.con.style.display = 'block';
  },
  hide: function(before) {
    ModalStore.hide();
    this.con.style.disaply = 'none';
  },
  getStyle: function (obj, attr){
    if (obj.currentStyle) {
      return obj.currentStyle[attr];
    } else {
      return getComputedStyle(obj, null)[attr];
    }
  },
  resetPosition: function (w,h) {
    console.log(w,h);
    this.con.style.marginTop = -h/2 + 'rem';
    this.con.style.marginLeft = -w/2 + 'rem';
  }
});
var SAlert = Class.create(SModal, {
  init: function(conf) {
    SAlert.superclass.prototype.init.call(this, conf);
    this.changeFace(conf.face);
    this.renderAlert();
    this.showAlert(conf);
    if (this.conf.afterRender) {
      this.conf.afterRender.call(this);
    }
  },
  changeFace: function(face){
    this.getElement('smodal-face').className = 'smodal-face face-' + face;
  },
  renderAlert: function() {
    //this.header.addClass("salert-text-title");
    this.alertCon = document.createElement("div");
    this.alertCon.className = 'salert-text-content';
    this.body.appendChild(this.alertCon);
    this.alertTitle = this.header;
  },
  showAlert: function(conf) {
    conf = conf || this.conf;
    conf.text && (this.alertCon.innerText = conf.text);
    conf.html && (this.alertCon.innerHTML = conf.html);
    conf.title && (this.alertTitle.innerText = conf.title);
  },
  updateTitle: function(title) {
    title && (this.alertTitle.innerText = title);
  },
  updateText: function(text) {
    text && (this.alertCon.innerText = text);
  },
  updateHtml: function(html) {
    html && (this.alertCon.innerHtml = html);
  }
});
