// From https://github.com/flowtype/flow-typed/blob/aea5b7bb7d36a7aa577d1318c1a8bc191ae20e1d/definitions/mocha_v2.4.x/flow_%3E%3Dv0.22.x/mocha_v2.4.x.js

type TestFunction = (() => void | Promise<mixed>) | ((done : () => void) => void);

declare var describe : {
    (name:string, spec:() => void): void;
    only(description:string, spec:() => void): void;
    skip(description:string, spec:() => void): void;
    timeout(ms:number): void;
};

declare var it : {
    (name:string, spec:TestFunction): void;
    only(description:string, spec:TestFunction): void;
    skip(description:string, spec:TestFunction): void;
    timeout(ms:number): void;
};

declare function before(method : TestFunction):void;
declare function beforeEach(method : TestFunction):void;
declare function after(method : TestFunction):void;
declare function afterEach(method : TestFunction):void;
