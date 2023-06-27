const userAgent = window.navigator.userAgent.toLowerCase();
const iPadOS13Up =
  window.navigator.platform === "MacIntel" &&
  window.navigator.maxTouchPoints > 1;

class DeviceDetector {
  constructor() {
    this.windows = this.find("windows");
    this.ipod = this.find("ipod");
    this.ipad = this.find("ipad") || iPadOS13Up;
    this.iphone = !this.windows && this.find("iphone");


    this.ios = this.iphone || this.ipod || this.ipad;
    this.android = !this.windows && this.find("android");
    this.androidPhone = this.android && this.find("mobile");
    this.mobile = this.androidPhone || this.iphone || this.ipod;
  };

  find(key) {
    return userAgent.indexOf(key) !== -1; 
  }
}

const DeviceDetectorInstance = {
  // called by Vue.use(DeviceDetector)
  install(Vue, options) {
    // create a mixin
    Vue.mixin({
      created() {
        const alias = "$device";
        const deviceDetector = new DeviceDetector();
        Vue.prototype[alias] = deviceDetector;
      },
    });
  },
};

export default DeviceDetectorInstance;