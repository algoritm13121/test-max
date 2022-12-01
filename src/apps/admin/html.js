export default function () {
    return `
    <!doctype html>
    <html lang='ru'>
        <head>
            <meta charset="utf-8">
            <meta http-equiv='x-ua-compatible' content='ie=edge'>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <title>Админ панель</title>
            <link rel='stylesheet' type='text/css' href='/public/admin.chunk.css'>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            <link rel='shortcut icon' href='/client/images/favicon.png' type='image/png'>
        </head>
        <body>
            <div id='app'></div>
            <script src='/public/vendors-admin.chunk.js' defer='defer'></script>
            <script src='/public/admin.chunk.js' defer='defer'></script>
        </body>
    </html>`;
}
