declare module 'download-git-repo' {
    function download(path: string, target: string, options: any, cb: (err: Error) => void): void
    export = download;
};