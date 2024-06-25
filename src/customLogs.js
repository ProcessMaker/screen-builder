export default class CustomLog {
  static logWithStyle(icon, type, name, status, message, color) {
    const baseColor = color === '255, 0, 0' ? 'red' : 'green';
    const style = `background-color: rgba(${color}, 0.1); color: ${baseColor}; padding: 2px 4px; border-radius: 3px;`;
    const transparentStyle = 'background-color: transparent';

    const logPrefix = `%c${icon} %c${type} "${name}" has`;
    const logStatus = `%c${status}`;

    if (status === 'RUN') {
      console.log(`${logPrefix} ${logStatus}`, style, transparentStyle, style);
    } else if (status === 'FAILED') {
      console.groupCollapsed(`${logPrefix} ${logStatus}`, style, transparentStyle, style);
      console.log(`%c${message}`, style);
      console.groupEnd();
    }
  }

  static success(type, name) {
    this.logWithStyle('\u2705', type, name, 'RUN', '', '0, 128, 0');
  }

  static error(type, name, message) {
    this.logWithStyle('\u274C', type, name, 'FAILED', message, '255, 0, 0');
  }
}
