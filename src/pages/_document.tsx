import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html lang="ja">
                <Head>
                    {/* ダークモード検出用のインラインスクリプト */}
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function() {
                                    try {
                                        var mode = localStorage.getItem('theme');
                                        var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                                        if (!mode && supportDarkMode) document.documentElement.classList.add('dark');
                                        if (mode === 'dark') document.documentElement.classList.add('dark');
                                    } catch (e) {}
                                })();
                            `,
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument 