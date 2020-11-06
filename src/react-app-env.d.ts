/// <reference types="react-scripts" />

// declare module 'react' {
//   interface HTMLAttributes<T> {
//     'layout-flex'?: string
//     'layout-align'?: string
//   }
// }

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

// 以上声明解决 import img from './img/bd_logo1.png' 出现的 TS2307: can not find module '....png'
